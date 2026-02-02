import vitestIsolation from '../plugins/eslint-plugin-vitest-isolation/index.js';

export const testConfig = {
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
};
