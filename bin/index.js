#!/usr/bin/env node
const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');
const execa = require('execa');
process.argv.shift();
process.argv.shift();
const args = ['-t', './transform.js', ...process.argv];
const result = execa.sync(jscodeshiftExecutable, args, {
  stdio: 'inherit',
  stripEof: false,
});
if (result.error) {
  throw result.error;
}
