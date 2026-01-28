import customRules from '../index.ts';
/**
 * ESLint flat config for the prefer-crud-modal-template rule.
 * Targets TypeScript React files in src/ while excluding test, spec, and story files.
 */
export const preferCrudModalTemplateConfig = {
  files: ['src/**/*.tsx'],
  ignores: [
    '**/*.spec.tsx',
    '**/*.test.tsx',
    '**/*.story.tsx',
    '**/*.stories.tsx',
  ],
  plugins: {
    'custom-rules': customRules,
  },
  rules: {
    'custom-rules/prefer-crud-modal-template': 'error',
  },
};
