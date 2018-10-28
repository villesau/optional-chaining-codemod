# Optional chaining codemod

[![Build Status](https://travis-ci.org/villesau/optional-chaining-codemod.svg?branch=master)](https://travis-ci.org/villesau/optional-chaining-codemod)

This is codemod to migrate different types of lodash gets and `a && a.b` kind of 
expressions to use optional [optional chaining](https://github.com/tc39/proposal-optional-chaining)
and [nullish coalescing](https://github.com/tc39/proposal-nullish-coalescing) instead.

## Why should I migrate to use optional chaining?

- When using static type checkers like [Flow](https://github.com/facebook/flow), 
optional chaining gives much better type safety than lodash get.
- It's also neater syntax than chaining logical and expressions after each other.

### flags

This codemod has two flags:
1. `--skipVariables` to skip variables passed to lodash `get` and other 
2. `--skipTemplateStrings` to skip template strings passed to lodash `get`.

Especially first case is risky as the variable might actually be something
like `var bar = "a.b.c"` but produce `_.get(foo, myVar) => foo?.bar`.
