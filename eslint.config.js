import js from '@eslint/js';
import graphql from '@graphql-eslint/eslint-plugin';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import imports from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import vitest from '@vitest/eslint-plugin';
import tsdoc from 'eslint-plugin-tsdoc';
import vitestIsolation from './scripts/eslint-plugin-vitest-isolation/index.js';

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
      ts,
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

      'tsdoc/syntax': 'error',

      'ts/no-require-imports': 'error',
      'react/destructuring-assignment': 'error',
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'import/no-duplicates': 'error',
      'no-undef': 'off',
      'ts/ban-ts-comment': 'error',
      'ts/no-unused-vars': 'error',
      'ts/no-explicit-any': 'error',
      'ts/no-non-null-assertion': 'error',
      'ts/consistent-type-assertions': 'error',
      'ts/naming-convention': [
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
      'vitest/no-disabled-tests': 'error',
      'vitest/no-focused-tests': 'error',
      'vitest/no-identical-title': 'error',
      'ts/no-unused-expressions': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Property[key.name='authorization'] CallExpression[callee.name='getItem'][arguments.0.value='token']",
          message:
            "Security Risk: Do not use getItem('token') directly inside authorization headers. Extract it to a variable first to handle null values.",
        },
      ],
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
    },
    rules: {
      'ts/consistent-type-imports': 'off',
      'ts/naming-convention': 'off',
      'ts/explicit-function-return-type': 'off',
      '@graphql-eslint/known-type-names': 'error',
      '@graphql-eslint/no-unreachable-types': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
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
      ts,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      'ts/no-require-imports': 'off',
      'ts/no-namespace': 'off',
      'ts/naming-convention': 'off',
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
      ts,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      'no-undef': 'error',
      'prettier/prettier': 'error',
    },
  },
  // Test file-specific configuration for mock isolation
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
    plugins: {
      'vitest-isolation': vitestIsolation,
    },
    rules: {
      'vitest-isolation/require-aftereach-cleanup': 'error',
    },
  },
];
