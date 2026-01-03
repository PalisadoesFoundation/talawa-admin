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
      '@typescript-eslint/no-require-imports': 'error',
      'react/destructuring-assignment': 'error',
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'import/no-duplicates': 'error',
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
      'vitest/no-disabled-tests': 'error',
      'vitest/no-focused-tests': 'error',
      'vitest/no-identical-title': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Property[key.name='authorization'] CallExpression[callee.name='getItem'][arguments.0.value='token']",
          message:
            "Security Risk: Do not use getItem('token') directly inside authorization headers. Extract it to a variable first to handle null values.",
        },
      ],
      /**
       * Enforce usage of standardized DataGridWrapper component
       * Issue #6099: https://github.com/PalisadoesFoundation/talawa-admin/issues/6099
       * Parent Issue #5290: DataGridWrapper foundation component
       *
       * This rule blocks direct imports from @mui/x-data-grid to ensure all usage
       * goes through the standardized DataGridWrapper component located at
       * src/shared-components/DataGridWrapper/
       *
       * Note: Set to 'warn' temporarily to allow existing violations while preventing new ones.
       * Approximately 20+ files currently use direct imports and will require migration.
       * Once migration is complete, this should be changed to 'error'.
       */
      'no-restricted-imports': [
        'warn',
        {
          name: '@mui/x-data-grid',
          message:
            'Direct imports from @mui/x-data-grid are not allowed. Please use the DataGridWrapper component from src/shared-components/DataGridWrapper/ instead. See issue #5290 for details.',
        },
        {
          name: '@mui/x-data-grid-pro',
          message:
            'Direct imports from @mui/x-data-grid-pro are not allowed. Please use the DataGridWrapper component from src/shared-components/DataGridWrapper/ instead. See issue #5290 for details.',
        },
      ],
    },
  },
  /**
   * Exemption: DataGridWrapper and ReportingTable component files
   *
   * DataGridWrapper and ReportingTable files need direct MUI DataGrid access for wrapper implementation.
   * These files are the only ones allowed to import directly from @mui/x-data-grid.
   */
  {
    files: [
      'src/shared-components/DataGridWrapper/**/*.ts',
      'src/shared-components/DataGridWrapper/**/*.tsx',
      'src/types/DataGridWrapper/**/*.ts',
      'src/types/DataGridWrapper/**/*.tsx',
      'src/shared-components/ReportingTable/**/*.ts',
      'src/shared-components/ReportingTable/**/*.tsx',
      'src/types/ReportingTable/**/*.ts',
      'src/types/ReportingTable/**/*.tsx',
    ],
    rules: {
      'no-restricted-imports': 'off',
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
