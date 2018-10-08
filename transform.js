const fs = require("fs");
const stp = require("./tra_stp");

const replaceArrayWithOptionalChain = (node, j) =>
  node.value.arguments[1].elements.reduce(
    (p, c) =>
      j.optionalMemberExpression(
        p,
        c.type === "Literal"
          ? isNaN(c.value)
            ? j.identifier(c.value)
            : j.literal(parseInt(c.value))
          : c,
        c.type !== "Literal" || !isNaN(c.value)
      ),
    node.value.arguments[0]
  );

const replaceStringWithOptionalChain = (str, startNode, j) =>
  stp(str)
    .filter(Boolean)
    .reduce(
      (p, c) =>
        j.optionalMemberExpression(
          p,
          isNaN(c) ? j.identifier(c) : j.literal(parseInt(c)),
          !isNaN(c)
        ),
      startNode
    );

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
    case "Literal":
      return replaceStringWithOptionalChain(
        node.value.arguments[1].value,
        node.value.arguments[0],
        j
      );
    case "Identifier":
      return defaultOptionalChain(node, j);
    case "MemberExpression":
      return defaultOptionalChain(node, j);
    default:
      throw new Error("argument type not supported");
  }
};

const skip = (node, options) => {
  switch (node.value.arguments[1].type) {
    case "ArrayExpression":
    case "Literal":
      return false;
    case "TemplateLiteral":
      return !!options.skipTemplateStrings;
    case "Identifier":
    case "MemberExpression":
      return !!options.skipVariables;
    default:
      throw new Error("argument type not supported");
  }
};

const addWithNullishCoalescing = (node, j) =>
  j.logicalExpression(
    "??",
    generateOptionalChain(node, j),
    node.value.arguments[2]
  );

const replaceGetWithOptionalChain = (node, j) =>
  node.value.arguments[2]
    ? addWithNullishCoalescing(node, j)
    : generateOptionalChain(node, j);

const mangleLodashGets = (ast, j, options) => {
  const getFirstNode = () => ast.find(j.Program).get("body", 0).node;
  // Save the comments attached to the first node
  const firstNode = getFirstNode();
  const { comments } = firstNode;
  const getImportSpecifier = ast
    .find("ImportDeclaration", { source: { type: "Literal", value: "lodash" } })
    .find("ImportSpecifier", { imported: { name: "get" } });
  if (getImportSpecifier.length) {
    const getName = getImportSpecifier.get().value.local.name;
    ast
      .find("CallExpression", { callee: { name: getName } })
      .replaceWith(
        node =>
          skip(node, options)
            ? node.get().value
            : replaceGetWithOptionalChain(node, j)
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
    source: { type: "Literal", value: "lodash/get" }
  });

  const getScopedSpecifier = getScopedImport
    .find("ImportDefaultSpecifier")
    .find("Identifier");

  if (getScopedSpecifier.length) {
    const getScopedName = getScopedSpecifier.get().node.name;
    ast
      .find("CallExpression", { callee: { name: getScopedName } })
      .replaceWith(
        node =>
          skip(node, options)
            ? node.get().value
            : replaceGetWithOptionalChain(node, j)
      );
    if (
      ast.find("CallExpression", { callee: { name: getScopedName } }).length ===
      0
    ) {
      getScopedImport.remove();
    }
  }
  const getDefaultSpecifier = ast
    .find("ImportDeclaration", { source: { type: "Literal", value: "lodash" } })
    .find("ImportDefaultSpecifier")
    .find("Identifier");
  if (getDefaultSpecifier.length) {
    const lodashDefaultImportName = getDefaultSpecifier.get().node.name;
    ast
      .find("CallExpression", {
        callee: {
          object: { name: lodashDefaultImportName },
          property: { name: "get" }
        }
      })
      .replaceWith(
        node =>
          skip(node, options)
            ? node.get().value
            : replaceGetWithOptionalChain(node, j)
      );
    const lodashIdentifiers = ast.find("Identifier", {
      name: lodashDefaultImportName
    });
    if (
      lodashIdentifiers.length === 1 &&
      lodashIdentifiers.get().parent.value.type === "ImportDefaultSpecifier"
    ) {
      const importDeclaration = ast.find("ImportDeclaration", {
        source: { type: "Literal", value: "lodash" },
        specifiers: [
          {
            type: "ImportDefaultSpecifier",
            local: { name: lodashDefaultImportName }
          }
        ]
      });
      if (importDeclaration.get().value.specifiers.length === 1) {
        importDeclaration.remove();
      }
    }
  }
  const firstNode2 = getFirstNode();
  if (firstNode2 !== firstNode) {
    firstNode2.comments = comments;
  }
};
const match = (a, b) => {
  if (b && b.object && a && a.object) {
    return match(a.object, b.object) && a.property.name === b.property.name;
  }
  return !!(a && b && a.name === b.name);
};

const getDepth = (node, d) => (node.object ? getDepth(node.object, d + 1) : d);

const dive = (node, compare, j) => {
  if (node.object.type === "MemberExpression") {
    const d1 = getDepth(node, 0);
    const d2 = getDepth(compare, 0);
    const toCompare = d1 <= d2 ? compare.object : compare;
    const propertyMatch = match(compare, node.object);
    const object = propertyMatch ? compare : dive(node.object, toCompare, j);
    if (object === node.object) {
      return node;
    }
    return j.optionalMemberExpression(
      object,
      node.property,
      false,
      propertyMatch
    );
  } else if (node.object.name === compare.name) {
    return j.optionalMemberExpression(node.object, node.property, false, true);
  } else {
    return node;
  }
};

const logicalExpressionToOptionalChain = (node, j) => {
  const left = node.value.left;
  const expression = dive(node.value.right, left, j);
  if (expression.type === "OptionalMemberExpression") {
    node.replace(expression);
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
  const j = api.jscodeshift;
  const ast = j(fileInfo.source);
  mangleLodashGets(ast, j, options);
  mangleNestedObjects(ast, j, options);
  return ast.toSource();
};
