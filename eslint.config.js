import { baseTypeScriptConfig } from './scripts/eslint/config/base.js';
import {
  avatarExemption,
  wrapperExemptions,
} from './scripts/eslint/config/exemptions.js';
import { cypressConfig } from './scripts/eslint/config/cypress.js';
import { testConfig } from './scripts/eslint/config/tests.js';
import { preferCrudModalTemplateConfig } from './scripts/eslint/config/prefer-crud-modal-template.js';
import {
  configFilesConfig,
  graphqlConfig,
  searchComponentsExemption,
} from './scripts/eslint/config/special.js';

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
  baseTypeScriptConfig,
  ...wrapperExemptions,
  graphqlConfig,
  avatarExemption,
  searchComponentsExemption,
  cypressConfig,
  configFilesConfig,
  testConfig,
  preferCrudModalTemplateConfig,
];
