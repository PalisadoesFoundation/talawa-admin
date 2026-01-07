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
        // Prevent insecure token handling in authorization headers
        // See docs/docs/docs/developer-resources/security.md for details on these rules
        // Note: No current violations exist. This rule is retained to prevent future regressions.
        // Prohibited: { authorization: localStorage.getItem('token') }
        // Safe pattern: const token = localStorage.getItem('token'); { authorization: token }
        {
          selector:
            "Property[key.name='authorization'][value.type='CallExpression'][value.callee.type='MemberExpression'][value.callee.property.name='getItem'][value.arguments.0.value='token']",
          message:
            "Security Risk: Do not use getItem('token') directly inside authorization headers. Extract it to a variable first to handle null values.",
        },
        // Prevent using deprecated REVOKE_REFRESH_TOKEN mutation
        {
          selector: "ImportSpecifier[imported.name='REVOKE_REFRESH_TOKEN']",
          message:
            'HTTP-Only Cookie Violation: Do not use REVOKE_REFRESH_TOKEN for logout. Use LOGOUT_MUTATION instead, which correctly reads refresh tokens from HTTP-only cookies.',
        },
        // Prevent passing refreshToken as a variable to mutations
        {
          selector:
            "Property[key.name='variables'] Property[key.name='refreshToken']",
          message:
            'HTTP-Only Cookie Violation: Do not pass refreshToken as a variable. The API reads refresh tokens from HTTP-only cookies automatically.',
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
       * Note: Approximately 20+ files currently use direct imports and will require
       * migration in a future ticket. This rule prevents new violations.
       *
       * Also enforces usage of standardized date picker wrappers
       * Issue #6146: https://github.com/PalisadoesFoundation/talawa-admin/issues/6146
       */
      'no-restricted-imports': [
        'error',
        {
          paths: [
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
            {
              name: 'react-bootstrap',
              importNames: ['Spinner'],
              message:
                'Do not import Spinner from react-bootstrap. Use the shared LoadingState component instead.',
            },
            {
              name: 'react-bootstrap',
              importNames: ['Modal'],
              message:
                'Do not import Modal directly. Use the shared BaseModal component instead.',
            },
            {
              name: '@mui/x-date-pickers',
              message:
                'Direct imports from @mui/x-date-pickers are not allowed. Please use the wrappers (DateRangePicker, DatePicker, TimePicker) from src/shared-components/ instead. See issue #6146 for details.',
            },
          ],
        },
      ],
    },
  },
  /**
   * Exemption: Wrapper component files
   *
   * These wrapper components need direct access to their underlying libraries:
   * - DataGridWrapper: Direct MUI DataGrid access
   * - LoadingState: Direct Spinner access from react-bootstrap
   * - BaseModal: Direct react-bootstrap Modal access
   * - DatePicker/TimePicker/DateRangePicker: Direct @mui/x-date-pickers access
   */
  {
    files: [
      'src/shared-components/DataGridWrapper/**/*.{ts,tsx}',
      'src/types/DataGridWrapper/**/*.{ts,tsx}',
      'src/shared-components/LoadingState/**/*.{ts,tsx}',
      'src/types/shared-components/LoadingState/**/*.{ts,tsx}',
      'src/components/Loader/**/*.{ts,tsx}',
      'src/shared-components/BaseModal/**/*.{ts,tsx}',
      'src/types/shared-components/BaseModal/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  /**
   * Exemption: Date picker wrapper components
   *
   * These wrapper components need direct access to @mui/x-date-pickers
   * to provide standardized date/time picker interfaces for the application.
   *
   * Note: This exemption is specific - it only allows @mui/x-date-pickers imports.
   * Other restricted imports (like react-bootstrap Modal) are still blocked.
   */
  {
    files: [
      'src/shared-components/DateRangePicker/**/*.{ts,tsx}',
      'src/types/shared-components/DateRangePicker/**/*.{ts,tsx}',
      'src/shared-components/DatePicker/**/*.{ts,tsx}',
      'src/shared-components/TimePicker/**/*.{ts,tsx}',
      'src/index.tsx',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            // Still enforce other restrictions, only allow @mui/x-date-pickers
            {
              name: 'react-bootstrap',
              importNames: ['Modal'],
              message:
                'Do not import Modal directly. Use the shared BaseModal component instead.',
            },
            {
              name: 'react-bootstrap',
              importNames: ['Spinner'],
              message:
                'Do not import Spinner from react-bootstrap. Use the shared LoadingState component instead.',
            },
          ],
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
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
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
  /**
   * Exemption: interfaces.ts file
   *
   * This file contains JSDoc-style comments that predate TSDoc linting.
   * The file is large and contains many interface definitions with JSDoc syntax.
   * TSDoc linting is disabled for this file to avoid breaking existing documentation.
   */
  {
    files: ['src/utils/interfaces.ts'],
    rules: {
      'tsdoc/syntax': 'off',
    },
  },
  /**
   * Test file-specific configuration
   *
   * This config MUST come after all other configs to override the main
   * no-restricted-imports rule and allow @mui/x-date-pickers in test files
   * (needed for testing date picker components).
   * Only Modal and Spinner remain restricted in test files.
   */
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
    plugins: {
      'vitest-isolation': vitestIsolation,
    },
    rules: {
      'vitest-isolation/require-aftereach-cleanup': 'error',
      // Allow @mui/x-date-pickers in test files for testing date picker components
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-bootstrap',
              importNames: ['Modal'],
              message:
                'Do not import Modal directly. Use the shared BaseModal component instead.',
            },
            {
              name: 'react-bootstrap',
              importNames: ['Spinner'],
              message:
                'Do not import Spinner from react-bootstrap. Use the shared LoadingState component instead.',
            },
            // Note: @mui/x-date-pickers is allowed in test files for testing purposes
          ],
        },
      ],
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
  /**
   * Exemption: interfaces.ts file
   *
   * This file contains JSDoc-style comments that predate TSDoc linting.
   * The file is large and contains many interface definitions with JSDoc syntax.
   * TSDoc linting is disabled for this file to avoid breaking existing documentation.
   * This must come last to override all other TypeScript configs.
   */
  {
    files: ['src/utils/interfaces.ts'],
    rules: {
      'tsdoc/syntax': 'off',
    },
  },
];
