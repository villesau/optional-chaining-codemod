# Optional chaining codemod

[![Build Status](https://travis-ci.org/villesau/optional-chaining-codemod.svg?branch=master)](https://travis-ci.org/villesau/optional-chaining-codemod)
[![npm version](https://badge.fury.io/js/optional-chaining-codemod.svg)](https://www.npmjs.com/package/optional-chaining-codemod)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/villesau/optional-chaining-codemod/blob/master/README.md#Contributing)

This is a codemod to migrate different types of lodash `get` calls and `a && a.b` kind of 
expressions to use [optional chaining](https://github.com/tc39/proposal-optional-chaining)
and [nullish coalescing](https://github.com/tc39/proposal-nullish-coalescing) instead.

Following babel plugins are required to transpile optional chaining and nullish
coalescing:

- [babel-plugin-proposal-optional-chaining](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining)
- [babel-plugin-proposal-nullish-coalescing-operator](https://babeljs.io/docs/en/babel-plugin-proposal-nullish-coalescing-operator)

## What it does?

- `a && a.b` becomes `a?.b`
- `_.get(foo, 'a.b')` and `_.get(foo, ['a', 'b'])` becomes `foo?.a?.b`
- `_.get(foo, 'a.b', defaultValue)` becomes `foo?.a?.b ?? defaultValue`

You can check out the [`__textfixtures__`](https://github.com/villesau/optional-chaining-codemod/tree/master/__testfixtures__) folder to see full list of supported transformations.

## Why should I migrate to use optional chaining?

- When using static type checkers like [Flow](https://github.com/facebook/flow), 
optional chaining provides much better type safety than lodash `get`. However, optional 
chaining is not only Flow feature but you can use it with babel already today.
- It also has a neater syntax than chaining `&&` expressions one after another.

## Install

```bash
$ yarn global add optional-chaining-codemod
```

or 

```bash
$ npm install -g optional-chaining-codemod
```

## Usage

```bash
$ optional-chaining-codemod ./**/*.js
```

with flow parser:

```bash
$ optional-chaining-codemod ./**/*.js --parser=flow
```

with typescript parser:

```bash
$ optional-chaining-codemod ./**/*.ts --parser=ts
```

The CLI is the same as in [jscodeshift](https://github.com/facebook/jscodeshift)
except you can omit the transform file.

Alternatively, you can run the codemod using jscodeshift as follows:

```bash
$ yarn global add jscodeshift
$ yarn add optional-chaining-codemod
$ jscodeshift -t node_modules/optional-chaining-codemod/transform.js ./**/*.js
```

### flags

This codemod has two flags:
1. `--skipVariables` to skip variables passed to lodash `get`
2. `--skipTemplateStrings` to skip template strings passed to lodash `get`

Especially the first case is risky as the variable might actually be something
like `var bar = "a.b.c"` and produce from `_.get(foo, bar)` following: `foo?[bar]` although lodash would treat it like `foo?.a?.b?.c"`.


## Contributing

Contributions are more than welcome! One area of improvement could be e.g 
better CLI or finding out new areas to migrate to use optional chaining.
