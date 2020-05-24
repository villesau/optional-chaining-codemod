const lodashObjectPathParser = require("./lodashObjectPathParser");
const isValidIdentifier = value => /^([a-zA-Z0-9_])*$/.test(value);

const replaceArrayWithOptionalChain = (node, j) =>
  node.value.arguments[1].elements.reduce(
    (p, c) =>
      j.optionalMemberExpression(
        p,
        ["Literal", "StringLiteral"].includes(c.type)
          ? isNaN(c.value) && isValidIdentifier(c.value)
            ? j.identifier(c.value)
              : isValidIdentifier(c.value)
              ? j.literal(parseInt(c.value))
            : j.literal(c.value)
          : c,
        !["Literal", "StringLiteral"].includes(c.type) || !isNaN(c.value) || !isValidIdentifier(c.value)
      ),
    node.value.arguments[0]
  );

const replaceStringWithOptionalChain = (str, startNode, j) =>
  lodashObjectPathParser(str)
    .filter(Boolean)
    .reduce((p, c) => {
      return j.optionalMemberExpression(
        p,
        isNaN(c) && isValidIdentifier(c)
          ? j.identifier(c)
          : isValidIdentifier(c)
          ? j.literal(parseInt(c))
          : j.literal(c),
        !isNaN(c) || !isValidIdentifier(c)
      );
    }, startNode);

const replaceTemplateLiteralWithOptionalChain = (node, j) => {
  const templateLiteral = node.value.arguments[1];
  const parts = [];
  templateLiteral.quasis.forEach((q, i) => {
    parts.push(q);
    if (templateLiteral.expressions[i]) {
      parts.push(templateLiteral.expressions[i]);
    }
  });
  return parts.reduce(
    (p, c) =>
      c.type === "TemplateElement"
        ? replaceStringWithOptionalChain(c.value.cooked, p, j)
        : j.optionalMemberExpression(p, c, true),
    node.value.arguments[0]
  );
};

const defaultOptionalChain = (node, j) =>
  j.optionalMemberExpression(
    node.value.arguments[0],
    node.value.arguments[1],
    true
  );

const generateOptionalChain = (node, j) => {
  switch (node.value.arguments[1].type) {
    case "ArrayExpression":
      return replaceArrayWithOptionalChain(node, j);
    case "TemplateLiteral":
      return replaceTemplateLiteralWithOptionalChain(node, j);
    case "StringLiteral":
    case "Literal":
      return replaceStringWithOptionalChain(
        node.value.arguments[1].value,
        node.value.arguments[0],
        j
      );
    case "Identifier":
    case "MemberExpression":
    case "CallExpression":
      return defaultOptionalChain(node, j);
    default:
      throw new Error(`argument type not supported "${node.value.arguments[1].type}"`);
  }
};

const skip = (node, options) => {
  switch (node.value.arguments[1].type) {
    case "ArrayExpression":
    case "StringLiteral":
    case "Literal":
      return false;
    case "TemplateLiteral":
      return !!options.skipTemplateStrings;
    case "Identifier":
    case "MemberExpression":
    case "CallExpression":
      return !!options.skipVariables;
    default:
      throw new Error(`argument type not supported "${node.value.arguments[1].type}"`);
  }
};

const addWithNullishCoalescing = (node, j) =>
  j.logicalExpression(
    "??",
    generateOptionalChain(node, j),
    node.value.arguments[2]
  );

const swapArguments = (node, options) => {
  const [object, path] = node.value.arguments;
  node.value.arguments = [path, object];
  return node;
};

const replaceGetWithOptionalChain = (node, j, shouldSwapArgs) =>
  node.value.arguments[2]
    ? addWithNullishCoalescing(node, j)
    : generateOptionalChain(shouldSwapArgs ? swapArguments(node) : node, j);

const mangleLodashGets = (ast, j, options, isTypescript, importLiteral = "lodash") => {
  const literal = isTypescript ? "StringLiteral" : "Literal";

  const getFirstNode = () => ast.find(j.Program).get("body", 0).node;
  // Save the comments attached to the first node
  const firstNode = getFirstNode();
  const { comments } = firstNode;
  const shouldSwapArgs = importLiteral === "lodash/fp";

  const getImportSpecifier = ast
    .find("ImportDeclaration", { source: { type: literal, value: importLiteral } })
    .find("ImportSpecifier", { imported: { name: "get" } });
  if (getImportSpecifier.length) {
    const getName = getImportSpecifier.get().value.local.name;
    ast
      .find("CallExpression", { callee: { name: getName } })
      .replaceWith(node =>
        skip(node, options, isTypescript)
          ? node.get().value
          : replaceGetWithOptionalChain(node, j, shouldSwapArgs)
      );
    if (
      ast.find("CallExpression", { callee: { name: getName } }).length === 0
    ) {
      const parent = getImportSpecifier.get().parent;
      getImportSpecifier.remove();
      if (parent.value.specifiers.length === 0) {
        parent.prune();
      }
    }
  }

  const getScopedImport = ast.find("ImportDeclaration", {
    source: { type: literal, value: `${importLiteral}/get` }
  });

  const getScopedSpecifier = getScopedImport
    .find("ImportDefaultSpecifier")
    .find("Identifier");

  if (getScopedSpecifier.length) {
    const getScopedName = getScopedSpecifier.get().node.name;
    ast
      .find("CallExpression", { callee: { name: getScopedName } })
      .replaceWith(node =>
        skip(node, options)
          ? node.get().value
          : replaceGetWithOptionalChain(node, j, shouldSwapArgs)
      );
    if (
      ast.find("CallExpression", { callee: { name: getScopedName } }).length ===
      0
    ) {
      getScopedImport.remove();
    }
  }

  function rewriteBlanketImports(lodashDefaultImportName) {
    ast
      .find("CallExpression", {
        callee: {
          object: { name: lodashDefaultImportName },
          property: { name: "get" }
        }
      })
      .replaceWith(node =>
        skip(node, options)
          ? node.get().value
          : replaceGetWithOptionalChain(node, j, shouldSwapArgs)
      );
  }

  function deleteBlanketIfOnlyUse(lodashDefaultImportName, type) {
    const lodashIdentifiers = ast.find("Identifier", {
      name: lodashDefaultImportName
    });
    if (
      lodashIdentifiers.length === 1 &&
      lodashIdentifiers.get().parent.value.type === type
    ) {
      const importDeclaration = ast.find("ImportDeclaration", {
        source: { type: literal, value: importLiteral },
        specifiers: [
          {
            type: type,
            local: { name: lodashDefaultImportName }
          }
        ]
      });
      if (importDeclaration.get().value.specifiers.length === 1) {
        importDeclaration.remove();
      }
    }
  }

  const baseDeclarations = ast
    .find("ImportDeclaration", { source: { type: literal, value: importLiteral } });

  const getDefaultSpecifier = baseDeclarations
    .find("ImportDefaultSpecifier")
    .find("Identifier");

  if (getDefaultSpecifier.length) {
    const foundName = getDefaultSpecifier.get().node.name;
    rewriteBlanketImports(foundName);
    deleteBlanketIfOnlyUse(foundName, "ImportDefaultSpecifier");
  }

  const getNamespaceSpecifier = baseDeclarations
    .find("ImportNamespaceSpecifier")
    .find('Identifier');

  if (getNamespaceSpecifier.length) {
    const foundName = getNamespaceSpecifier.get().node.name;
    rewriteBlanketImports(foundName);
    deleteBlanketIfOnlyUse(foundName, "ImportNamespaceSpecifier");
  }

  const firstNode2 = getFirstNode();
  if (firstNode2 !== firstNode) {
    firstNode2.comments = comments;
  }
};

const nameEquals = (a, b) => a.name && b.name && a.name === b.name;
const valueEquals = (a, b) =>
  a.value !== undefined && b.value !== undefined && a.value === b.value;

const isPropertyMatch = (a, b) => {
  if (b && b.object && a && a.object) {
    return (
      isPropertyMatch(a.object, b.object) &&
      (nameEquals(a.property, b.property) ||
        valueEquals(a.property, b.property))
    );
  }
  return !!(a && b && (nameEquals(a, b) || valueEquals(a, b)));
};

const getDepth = (node, depth) =>
  node.object ? getDepth(node.object, depth + 1) : depth;

const dive = (node, compare, j) => {
  if (node.object.type === "MemberExpression") {
    const d1 = getDepth(node, 0);
    const d2 = getDepth(compare, 0);
    const toCompare = d1 <= d2 ? compare.object : compare;
    const propertyMatch = isPropertyMatch(compare, node.object);
    const object = propertyMatch ? compare : dive(node.object, toCompare, j);
    if (object === node.object) {
      return node;
    }
    return j.optionalMemberExpression(
      object,
      node.property,
      node.computed,
      propertyMatch
    );
  } else if (
    node.object.name &&
    compare.name &&
    node.object.name === compare.name
  ) {
    return j.optionalMemberExpression(
      node.object,
      node.property,
      node.computed,
      true
    );
  } else {
    return node;
  }
};

const logicalExpressionToOptionalChain = (node, j) => {
  const right = node.value.right;
  if (node.value.left.type === "LogicalExpression") {
    const left = node.value.left.right;
    const expression = dive(right, left, j);
    if (expression.type === "OptionalMemberExpression") {
      node.get("right").replace(expression);
      node.get("left").replace(node.value.left.left);
    }
  } else {
    const left = node.value.left;
    const expression = dive(right, left, j);
    if (expression.type === "OptionalMemberExpression") {
      node.replace(expression);
    }
  }

  if (
    node.parent.value.type === "LogicalExpression" &&
    node.parent.value.operator === "&&" &&
    node.parent.value.right.type === "MemberExpression"
  ) {
    logicalExpressionToOptionalChain(node.parent, j);
  }
};

const mangleNestedObjects = (ast, j, options) => {
  const nestedObjectAccesses = ast.find("LogicalExpression", {
    operator: "&&",
    right: { type: "MemberExpression" }
  });

  nestedObjectAccesses
    .filter(path => path.value.left.type !== "LogicalExpression")
    .forEach(path => logicalExpressionToOptionalChain(path.get(), j));
  return ast;
};

module.exports = function(fileInfo, api, options) {
  const isTypescript = /.tsx?$/.test(fileInfo.path);

  const j = api.jscodeshift;
  const ast = j(fileInfo.source);
  mangleNestedObjects(ast, j, options, isTypescript);
  mangleLodashGets(ast, j, options, isTypescript);
  mangleLodashGets(ast, j, options, isTypescript, "lodash/fp");
  return ast.toSource();
};
