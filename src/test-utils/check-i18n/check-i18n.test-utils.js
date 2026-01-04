import path from 'path';
import fs from 'fs';
import os from 'os';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const scriptPath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'scripts',
  'check-i18n.js',
);
export const fixturesDir = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'scripts',
  '__fixtures__',
);

const tempDirs = [];


const sleepSync = (ms) => {
  if (ms <= 0) return;
  const sab = new SharedArrayBuffer(4);
  const int32 = new Int32Array(sab);
  Atomics.wait(int32, 0, 0, ms);
};

export const runScript = (targets, options = {}) => {
  const { env, scriptContent, ...rest } = options;
  let targetScript = scriptPath;


  if (scriptContent) {
    const tempDir = makeTempDir();
    targetScript = path.join(tempDir, 'script.js');
    fs.writeFileSync(targetScript, scriptContent);
  }

  // Retry logic for EBADF errors (Bad File Descriptor)
  let res;
  let attempts = 0;
  const maxAttempts = 8;
  const backoffBaseMs = 25;

  while (attempts < maxAttempts) {
    res = spawnSync(process.execPath, [targetScript, ...targets], {
      encoding: 'utf-8',
      env: { ...process.env, ...(env ?? {}), FORCE_COLOR: '0', NO_COLOR: '1' },
      timeout: 30_000,
      ...rest,
    });

    // If EBADF error, wait a bit and retry
    if (res.error && res.error.code === 'EBADF' && attempts < maxAttempts - 1) {
      attempts++;
      // Exponential backoff with a small cap to avoid long stalls
      const waitMs = Math.min(200, backoffBaseMs * Math.pow(2, attempts - 1));
      sleepSync(waitMs);
      continue;
    }

    break;
  }

  // Don't cleanup immediately - let cleanupTempDirs handle it
  // This prevents EBADF errors from file descriptor race conditions

  if (res.error) throw res.error;
  return res;
};

export const makeTempDir = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-detector-'));
  tempDirs.push(dir);
  return dir;
};

export const writeTempFile = (dir, relPath, content) => {
  const filePath = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
};

export const cleanupTempDirs = () => {
  // Cleanup temp dirs (which includes temp files inside them)
  tempDirs.forEach((dir) => {
    fs.rmSync(dir, { recursive: true, force: true });
  });
  tempDirs.length = 0;
};
