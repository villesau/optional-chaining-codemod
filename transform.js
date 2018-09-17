const stp = require("./tra_stp");

const replaceArraywithOptionalChain = (node, j) =>
  node.value.arguments[1].elements.reduce(
    (p, c) =>
      j.optionalMemberExpression(
        p,
        c.type === "Literal" ? j.identifier(c.value) : j.identifier(c.name),
        c.type === "Identifier"
      ),
    node.value.arguments[0]
  );

const replaceStringWithOptionalChain = (node, j) =>
  stp(node.value.arguments[1].value).reduce(
    (p, c) =>
      j.optionalMemberExpression(
        p,
        isNaN(c) ? j.identifier(c) : j.literal(parseInt(c))
      ),
    node.value.arguments[0]
  );

const replaceGetWithOptionalChain = (node, j) =>
  node.value.arguments[1].type === "ArrayExpression"
    ? replaceArraywithOptionalChain(node, j)
    : replaceStringWithOptionalChain(node, j);

module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;
  const ast = j(fileInfo.source);
  const getImportSpecifier = ast
    .find("ImportDeclaration", { source: { type: "Literal", value: "lodash" } })
    .find("ImportSpecifier", { imported: { name: "get" } });
  if (getImportSpecifier.length) {
    const getName = getImportSpecifier.get().value.local.name;
    ast
      .find("CallExpression", { callee: { name: getName } })
      .replaceWith(node => replaceGetWithOptionalChain(node, j));
    const parent = getImportSpecifier.get().parent;
    getImportSpecifier.remove();
    if (parent.value.specifiers.length === 0) {
      parent.prune();
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
      .replaceWith(node => replaceGetWithOptionalChain(node, j));
    getScopedImport.remove();
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
      .replaceWith(node => replaceGetWithOptionalChain(node, j));
    const lodashCallCount = ast.find("CallExpression", {
      callee: {
        object: { name: lodashDefaultImportName }
      }
    }).length;
    if (lodashCallCount === 0) {
      ast
        .find("ImportDeclaration", {
          source: { type: "Literal", value: "lodash" },
          specifiers: [
            {
              type: "ImportDefaultSpecifier",
              local: { name: lodashDefaultImportName }
            }
          ]
        })
        .remove();
    }
  }

  return ast.toSource();
};
