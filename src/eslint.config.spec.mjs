import { ESLint } from 'eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

describe('ESLint Config Tests', () => {
  let eslint;

  beforeAll(() => {
    eslint = new ESLint({
      overrideConfigFile: path.resolve(_dirname, '../eslint.config.mjs'),
    });
  });

  test('should ignore specified file patterns', async () => {
    const results = await eslint.lintFiles([
      '**/*.css',
      '**/*.scss',
      '**/*.less',
      '**/*.json',
      '**/*.svg',
      'docs/docusaurus.config.ts',
      'docs/sidebars.ts',
      'docs/src/**/*',
      'docs/blog/**/*',
      'src/components/CheckIn/tagTemplate.ts',
      '**/package.json',
      '**/package-lock.json',
      '**/tsconfig.json',
      'docs/**/*',
    ]);

    results.forEach((result) => {
      expect(result.errorCount).toBe(0);
      expect(result.warningCount).toBe(0);
    });
  });
});
