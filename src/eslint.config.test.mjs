import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

describe('eslint.config.mjs', () => {

  it('should correctly resolve _filename', () => {
    const _filename = fileURLToPath(import.meta.url);
    expect(_filename).toBeDefined();
    expect(typeof _filename).toBe('string');
  });

  it('should correctly resolve _dirname', () => {
    const _filename = fileURLToPath(import.meta.url);
    const _dirname = path.dirname(_filename);
    expect(_dirname).toBeDefined();
    expect(typeof _dirname).toBe('string');
  });

  it('should correctly initialize FlatCompat', () => {
    const _filename = fileURLToPath(import.meta.url);
    const _dirname = path.dirname(_filename);
    const compat = new FlatCompat({
      baseDirectory: _dirname,
      recommendedConfig: js.configs.recommended,
      allConfig: js.configs.all,
    });
    expect(compat).toBeDefined();
    expect(compat).toBeInstanceOf(FlatCompat);
  });

});
