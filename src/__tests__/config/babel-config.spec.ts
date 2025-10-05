import { describe, it, expect } from 'vitest';

describe('babel configuration', () => {
  it('exposes the expected presets and plugins in order', async () => {
    const module = await import('../../../config/babel.config.cjs');
    const babelConfig = (module.default ?? module) as {
      presets: string[];
      plugins: string[];
    };

    expect(Array.isArray(babelConfig.presets)).toBe(true);
    expect(Array.isArray(babelConfig.plugins)).toBe(true);

    expect(babelConfig.presets).toEqual([
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react',
    ]);

    expect(babelConfig.plugins).toEqual([
      'babel-plugin-transform-import-meta',
      'istanbul',
    ]);
  });
});
