'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('lodash get to optional chaining', () => {
  defineTest(__dirname, 'transform')
});
