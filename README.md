# Optional chaining codemod

[![Build Status](https://travis-ci.org/villesau/optional-chaining-codemod.svg?branch=master)](https://travis-ci.org/villesau/optional-chaining-codemod)

This is a codemod to migrate different types of lodash `get` calls and `a && a.b` kind of 
expressions to use [optional chaining](https://github.com/tc39/proposal-optional-chaining)
and [nullish coalescing](https://github.com/tc39/proposal-nullish-coalescing) instead.

Following babel plugins are required to transpile optional chaining and nullish
coalescing:

- [babel-plugin-proposal-optional-chaining](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining)
- [babel-plugin-proposal-nullish-coalescing-operator](https://babeljs.io/docs/en/babel-plugin-proposal-nullish-coalescing-operator)

## Why should I migrate to use optional chaining?

- When using static type checkers like [Flow](https://github.com/facebook/flow), 
optional chaining provides much better type safety than lodash `get`. However, optional 
chaining is not only Flow feature but you can use it with babel already today.
- It also has a neater syntax than chaining `&&` expressions one after another.

## Usage

```
$ yarn global add optional-chaining-codemod
```
```
$ optional-chaining-codemod ./**/*.js
```

with flow parser:

```
$ optional-chaining-codemod ./**/*.js --parser=flow
```

The CLI is the same as in [jscodeshift](https://github.com/facebook/jscodeshift)
except you can omit the transform file.

Alternatively, you can run the codemod using jscodeshift as follows:

```
$ yarn global add jscodeshift
$ yarn add optional-chaining-codemod
$ jscodeshift -t node_modules/optional-chaining-codemod/transform.js ./**/*.js
```

### flags

This codemod has two flags:
1. `--skipVariables` to skip variables passed to lodash `get`
2. `--skipTemplateStrings` to skip template strings passed to lodash `get`

Especially the first case is risky as the variable might actually be something
like `var bar = "a.b.c"` but produce `_.get(foo, bar) => foo?[bar]`.
