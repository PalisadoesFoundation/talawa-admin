#!/usr/bin/env node
import { realpathSync } from 'fs';
import { fileURLToPath } from 'url';
import { handleCliInvocation, run } from '../../src/utils/tsdocChecker';

const modulePath = realpathSync(fileURLToPath(import.meta.url));

await handleCliInvocation(
  () => run(),
  process.argv,
  realpathSync,
  modulePath,
);
