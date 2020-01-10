"use strict";

jest.autoMockOff();
const defineTest = require("jscodeshift/dist/testUtils").defineTest;

describe("lodash get to optional chaining", () => {
  describe("basic happy case scenario", () => {
    defineTest(__dirname, "transform");
  });
  describe("flags", () => {
    describe("skipTemplateStrings", () => {
      defineTest(
        __dirname,
        "transform",
        { skipTemplateStrings: true },
        "skipTemplateStrings"
      );
    });
    describe("skipVariables", () => {
      defineTest(
        __dirname,
        "transform",
        { skipVariables: true },
        "skipVariables"
      );
    });

    describe("typescript", () => {
      defineTest(
        __dirname,
        "transform",
        null,
        "typescript",
        { parser: 'ts' },
        { parser: 'ts' },
      );
    });
  });

  describe("mangle nested object checks", () => {
    defineTest(__dirname, "transform", null, "nestedObjects");
  });

  describe("import from lodash/fp", () => {
    defineTest(__dirname, "transform", null, "lodashFP")
  });
});
