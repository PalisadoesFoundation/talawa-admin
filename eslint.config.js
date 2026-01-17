import js from '@eslint/js';
import graphql from '@graphql-eslint/eslint-plugin';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import imports from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import vitest from '@vitest/eslint-plugin';
import tsdoc from 'eslint-plugin-tsdoc';

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'fix-readme-links.js',
      'fix-repo-url.js',
      'src/components/CheckIn/tagTemplate.ts',
      'docs/**',
      '*.md',
      'docker/**',
      'config/docker/setup/nginx*.conf',
      '**/*.css',
      '**/*.scss',
      '**/*.less',
      '**/*.json',
      '**/*.svg',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'], // Changed from ['*.ts', '*.tsx'] to include subdirectories
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly',

        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    plugins: {
      react,
      '@typescript-eslint': ts,
      vitest,
      import: imports,
      prettier,
      tsdoc,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      'react/destructuring-assignment': 'error',
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'import/no-duplicates': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-bootstrap',
              importNames: ['Button'],
              message:
                "Direct Button imports from 'react-bootstrap' are not allowed. Use 'import Button from react-bootstrap/Button' instead.",
            },
          ],
        },
      ],
      'no-undef': 'off',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^(TestInterface|I|Interface)[A-Z]',
            match: true,
          },
        },
        { selector: ['typeAlias', 'typeLike', 'enum'], format: ['PascalCase'] },
        { selector: 'typeParameter', format: ['PascalCase'], prefix: ['T'] },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        { selector: 'variable', modifiers: ['exported'], format: null },
      ],
      'react/jsx-pascal-case': [
        'error',
        { allowAllCaps: false, allowNamespace: false },
      ],
      'react/no-this-in-sfc': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'prettier/prettier': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-focused-tests': 'error',
      'vitest/no-identical-title': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
    },
  },
  {
    files: ['*.graphql'],
    languageOptions: {
      parser: graphql.parser,
    },
    plugins: {
      '@graphql-eslint': graphql,
      prettier,
      tsdoc,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@graphql-eslint/known-type-names': 'error',
      '@graphql-eslint/no-unreachable-types': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'tsdoc/syntax': 'error',
    },
  },
  // Cypress-specific configuration
  {
    files: ['cypress/**/*.ts', 'cypress/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        // Cypress globals
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',

        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',

        // Node.js globals for config files
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
  },
  // Configuration files
  {
    files: ['*.config.ts', '*.config.js', 'cypress.config.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
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
      'no-undef': 'error',
      'prettier/prettier': 'error',
    },
  },
];
