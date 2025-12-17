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

export const runScript = (targets, options = {}) => {
  const { env, ...rest } = options;
  const res = spawnSync(process.execPath, [scriptPath, ...targets], {
    encoding: 'utf-8',
    env: { ...process.env, ...(env ?? {}), FORCE_COLOR: '0', NO_COLOR: '1' },
    timeout: 30_000,
    ...rest,
  });
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
  tempDirs.forEach((dir) => {
    fs.rmSync(dir, { recursive: true, force: true });
  });
  tempDirs.length = 0;
};
