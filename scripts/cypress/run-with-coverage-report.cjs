#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

const cypressArgs = process.argv.slice(2);

const runCommand = (command, args) =>
  spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

const cypressResult = runCommand('pnpm', [
  'exec',
  'cypress',
  'run',
  ...cypressArgs,
]);

const nycResult = runCommand('pnpm', [
  'exec',
  'nyc',
  'report',
  '--reporter=text-summary',
]);

const cypressExitCode =
  typeof cypressResult.status === 'number'
    ? cypressResult.status
    : cypressResult.error
      ? 1
      : 0;

const nycExitCode =
  typeof nycResult.status === 'number' ? nycResult.status : nycResult.error ? 1 : 0;

process.exit(cypressExitCode !== 0 ? cypressExitCode : nycExitCode);
