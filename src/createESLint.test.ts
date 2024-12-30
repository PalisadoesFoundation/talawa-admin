import { createESLintCompat } from '../eslint.config.mjs';
import { FlatCompat } from '@eslint/eslintrc';

describe('createESLintCompat', () => {
  it('should initialize FlatCompat with the correct configuration', () => {
    const compat = createESLintCompat();

    expect(compat).toBeDefined();
    expect(compat).toHaveProperty('baseDirectory');
    expect(compat).toHaveProperty('recommendedConfig');
    expect(compat).toHaveProperty('allConfig');
  });

  it('should return a valid FlatCompat instance', () => {
    const compat = createESLintCompat();

    expect(compat instanceof FlatCompat).toBe(true);
  });
});
