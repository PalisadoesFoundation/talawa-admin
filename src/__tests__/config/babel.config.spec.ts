import { describe, it, expect, beforeAll } from 'vitest';

let babelConfig: { presets: string[]; plugins: string[] };

beforeAll(async () => {
  const module = await import('../../../config/babel.config.cjs');
  babelConfig = ((
    module as { default?: { presets: string[]; plugins: string[] } }
  ).default ?? module) as {
    presets: string[];
    plugins: string[];
  };
});

describe('babel configuration', () => {
  it('exports the expected preset pipeline', () => {
    expect(babelConfig.presets).toEqual([
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react',
    ]);
  });

  it('enables required plugins for import meta support and coverage', () => {
    expect(babelConfig.plugins).toEqual([
      'babel-plugin-transform-import-meta',
      'istanbul',
    ]);
  });
});
