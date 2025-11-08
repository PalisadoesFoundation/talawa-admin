#!/usr/bin/env node

/**
 * Cross-platform test sharding script for Windows/macOS/Linux compatibility
 * Reads SHARD_INDEX and SHARD_COUNT from env (defaults: 1 and 1)
 */

import { spawn } from 'child_process';

const shardIndex = process.env.SHARD_INDEX || '1';
const shardCount = process.env.SHARD_COUNT || '1';
const withCoverage = process.argv.includes('--coverage');

const args = ['vitest', 'run'];
if (withCoverage) args.push('--coverage');
args.push('--shard', `${shardIndex}/${shardCount}`);

const child = spawn('npx', args, { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code || 0));
