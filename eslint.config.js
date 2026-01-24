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
import {
  restrictedImportPaths,
  restrictImportsExcept,
  securityRestrictions,
  searchInputRestrictions,
} from './scripts/eslint/rules/rules.ts';

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
      'src/shared-components/CheckIn/tagTemplate.ts',
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

      'tsdoc/syntax': 'error',

      '@typescript-eslint/no-require-imports': 'error',
      'react/destructuring-assignment': 'error',
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'import/no-duplicates': 'error',
      'no-undef': 'off',
      '@typescript-eslint/ban-ts-comment': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true, // Allow unused vars when using rest properties for filtering
          varsIgnorePattern: '^_', // Allow unused vars that start with underscore
          argsIgnorePattern: '^_', // Allow unused function args that start with underscore
        },
      ],
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
        ...securityRestrictions,
        ...searchInputRestrictions,
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
       * Note: Approximately 20+ files currently use direct imports and will require
       * migration in a future ticket. This rule prevents new violations.
       *
       * Also enforces usage of standardized date picker wrappers
       * Issue #6146: https://github.com/PalisadoesFoundation/talawa-admin/issues/6146
       */
      'no-restricted-imports': ['error', { paths: restrictedImportPaths }],
    },
  },
  /**
   * Exemption: DataGridWrapper component files
   *
   * DataGridWrapper files need direct MUI DataGrid access for wrapper implementation.
   * These files are the only ones allowed to import from @mui/x-data-grid/-pro.
   * Allowed IDs: mui-data-grid, mui-data-grid-pro.
   */
  {
    files: [
      'src/shared-components/DataGridWrapper/**/*.{ts,tsx}',
      'src/types/DataGridWrapper/**/*.{ts,tsx}',
    ],
    rules: restrictImportsExcept(['mui-data-grid', 'mui-data-grid-pro']),
  },
  /**
   * Exemption: LoadingState and Loader component files
   *
   * LoadingState/Loader files need direct Spinner access from react-bootstrap for wrapper implementation.
   * These files are the only ones allowed to import Spinner directly from react-bootstrap.
   * Allowed ID: rb-spinner.
   */
  {
    files: [
      'src/shared-components/LoadingState/**/*.{ts,tsx}',
      'src/types/shared-components/LoadingState/**/*.{ts,tsx}',
      'src/components/Loader/**/*.{ts,tsx}',
    ],
    rules: restrictImportsExcept(['rb-spinner']),
  },
  /**
   * Exemption: FormFieldGroup and FormField component files
   *
   * FormFieldGroup and FormField files need direct react-bootstrap Form access for wrapper implementation.
+  * These files are the only ones allowed to import Form directly from react-bootstrap.
   * Allowed ID: rb-form, rb-form-path.
   */
  {
    files: [
      'src/shared-components/FormFieldGroup/**/*.{ts,tsx}',
      'src/shared-components/Auth/FormField/**/*.{ts,tsx}',
      'src/types/shared-components/FormFieldGroup/**/*.{ts,tsx}',
      'src/types/shared-components/Auth/FormField/**/*.{ts,tsx}',
    ],
    rules: restrictImportsExcept(['rb-form', 'rb-form-path']),
  },
  /**
   * Exemption: BaseModal component files
   *
   * BaseModal files need direct react-bootstrap Modal access for wrapper implementation.
   * These files are the only ones allowed to import Modal directly from react-bootstrap.
   * Allowed ID: rb-modal, rb-modal-path.
   */
  {
    files: [
      'src/shared-components/BaseModal/**/*.{ts,tsx}',
      'src/types/shared-components/BaseModal/**/*.{ts,tsx}',
    ],
    rules: restrictImportsExcept(['rb-modal', 'rb-modal-path']),
  },

  /**
   * Exemption: NotificationToast component files
   *
   * NotificationToast files need direct react-toastify access for wrapper implementation.
   * These files are the only ones allowed to import from react-toastify.
   * Allowed ID: react-toastify.
   */
  {
    files: [
      'src/shared-components/NotificationToast/**/*.{ts,tsx}',
      'src/types/shared-components/NotificationToast/**/*.{ts,tsx}',
    ],
    rules: restrictImportsExcept(['react-toastify']),
  },
  /**
   * Exemption: Date picker wrapper components
   *
   * These wrapper components need direct access to @mui/x-date-pickers
   * to provide standardized date/time picker interfaces for the application.
   *
   * Note: This exemption is specific - it only allows @mui/x-date-pickers imports.
   * Other restricted imports (like react-bootstrap Modal) are still blocked.
   * Allowed ID: mui-date-pickers.
   */
  {
    files: [
      'src/shared-components/DateRangePicker/**/*.{ts,tsx}',
      'src/types/shared-components/DateRangePicker/**/*.{ts,tsx}',
      'src/shared-components/DatePicker/**/*.{ts,tsx}',
      'src/shared-components/TimePicker/**/*.{ts,tsx}',
      'src/index.tsx',
    ],
    rules: restrictImportsExcept(['mui-date-pickers', 'rb-form', 'rb-form-path']),
  },
  /**
   * Exemption: DataTable wrapper component
   *
   * DataTable files need direct react-bootstrap Table access for wrapper implementation.
   * These files are the only ones allowed to import Table directly from react-bootstrap.
   * Allowed IDs: rb-table, rb-table-path.
   */
  {
    files: [
      'src/shared-components/DataTable/**/*.{ts,tsx}',
      'src/types/shared-components/DataTable/**/*.{ts,tsx}',
    ],
    rules: restrictImportsExcept(['rb-table', 'rb-table-path']),
  },
  /**
   * Exemption: Shared Button wrapper implementation
   *
   * The shared Button component needs direct react-bootstrap Button access.
   * These files are the only ones allowed to import Button directly.
   * Allowed IDs: rb-button, rb-button-path.
   */
  {
    files: [
      'src/shared-components/Button/**/*.{ts,tsx}',
      'src/types/shared-components/Button/**/*.{ts,tsx}',
    ],
    rules: restrictImportsExcept(['rb-button', 'rb-button-path']),
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
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@graphql-eslint/known-type-names': 'error',
      '@graphql-eslint/no-unreachable-types': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  /**
   * Exemption: Avatar and createAvatar component files
   *
   * Avatar and createAvatar files need direct `@dicebear/core` access for wrapper implementation.
   * These files are the only ones allowed to import from `@dicebear/core`.
   * Allowed ID: dicebear-core.
   */
  {
    files: [
      'src/shared-components/Avatar/**/*.{ts,tsx,d.ts}',
      'src/shared-components/createAvatar/**/*.{ts,tsx}',
      'src/types/shared-components/Avatar/**/*.{ts,tsx,d.ts}',
      'src/types/shared-components/createAvatar/**/*.{ts,tsx}',
    ],
    rules: restrictImportsExcept(['dicebear-core']),
  },
  /**
   * Exemption: SearchBar, SearchFilterBar, and DataTable components
   * These components implement search functionality and need to use search inputs directly.
   * Security restrictions still apply, but search input restrictions are disabled.
   */
  {
    files: [
      'src/shared-components/SearchFilterBar/SearchFilterBar.tsx',
      'src/shared-components/DataTable/SearchBar.tsx',
      'src/shared-components/SearchBar/SearchBar.tsx',
    ],
    rules: {
      'no-restricted-syntax': ['error', ...securityRestrictions],
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
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/20[2-9]\\d-\\d{2}-\\d{2}/]',
          message:
            'Avoid hardcoded date strings in tests. Use dynamic dates with dayjs instead (e.g., dayjs().add(30, "days").format("YYYY-MM-DD")).',
        },
        {
          selector:
            'Literal[value=/\\d{1,2}\\s+(January|February|March|April|May|June|July|August|September|October|November|December)\\s+20[2-9]\\d/]',
          message:
            'Avoid hardcoded date strings like "31 December 2025". Use dynamic dates with dayjs instead.',
        },
      ],
    },
  },
];
