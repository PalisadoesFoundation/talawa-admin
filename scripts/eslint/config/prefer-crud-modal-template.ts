import customRules from '../index.ts';
// ESLint config for custom rule: prefer-crud-modal-template
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
