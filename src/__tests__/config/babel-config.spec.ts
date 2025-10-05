import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const babelConfig = require('../../../config/babel.config.cjs');

describe('babel configuration', () => {
  it('exports the expected preset list', () => {
    expect(Array.isArray(babelConfig.presets)).toBe(true);
    expect(babelConfig.presets).toEqual(
      expect.arrayContaining([
        '@babel/preset-env',
        '@babel/preset-typescript',
        '@babel/preset-react',
      ]),
    );
  });

  it('exports the expected plugin list', () => {
    expect(Array.isArray(babelConfig.plugins)).toBe(true);
    expect(babelConfig.plugins).toEqual(
      expect.arrayContaining([
        'babel-plugin-transform-import-meta',
        'istanbul',
      ]),
    );
  });

  it('keeps presets and plugins in declaration order', () => {
    expect(babelConfig.presets).toMatchObject([
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react',
    ]);

    expect(babelConfig.plugins).toMatchObject([
      'babel-plugin-transform-import-meta',
      'istanbul',
    ]);
  });
});
