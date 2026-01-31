import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import imports from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import vitest from '@vitest/eslint-plugin';
import tsdoc from 'eslint-plugin-tsdoc';
import {
  restrictedImportPaths,
  securityRestrictions,
  searchInputRestrictions,
  modalStateRestrictions,
} from '../rules/rules.ts';

export const baseTypeScriptConfig = {
  files: ['**/*.ts', '**/*.tsx'],
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
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
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
      ...modalStateRestrictions,
    ],
    'no-restricted-imports': ['error', { paths: restrictedImportPaths }],
  },
};
