import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export const cypressConfig = {
  files: ['cypress/**/*.ts', 'cypress/**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: tsParser,
    globals: {
      cy: 'readonly',
      Cypress: 'readonly',
      describe: 'readonly',
      it: 'readonly',
      before: 'readonly',
      beforeEach: 'readonly',
      after: 'readonly',
      afterEach: 'readonly',
      expect: 'readonly',

      window: 'readonly',
      document: 'readonly',
      console: 'readonly',

      require: 'readonly',
      module: 'readonly',
      exports: 'readonly',
      __dirname: 'readonly',
      __filename: 'readonly',
    },
  },
  plugins: {
    '@typescript-eslint': ts,
    prettier,
  },
  rules: {
    ...js.configs.recommended.rules,
    ...ts.configs.recommended.rules,
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'no-undef': 'off',
    'prettier/prettier': 'error',
  },
};
