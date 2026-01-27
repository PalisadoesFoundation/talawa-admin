import js from '@eslint/js';
import graphql from '@graphql-eslint/eslint-plugin';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import { securityRestrictions } from '../rules/rules.ts';

export const graphqlConfig = {
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
};

export const configFilesConfig = {
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
};

export const searchComponentsExemption = {
  files: [
    'src/shared-components/SearchFilterBar/SearchFilterBar.tsx',
    'src/shared-components/DataTable/SearchBar.tsx',
    'src/shared-components/SearchBar/SearchBar.tsx',
  ],
  rules: {
    'no-restricted-syntax': ['error', ...securityRestrictions],
  },
};
