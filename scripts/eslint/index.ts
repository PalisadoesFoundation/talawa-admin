import preferCrudModalTemplate from './rules/prefer-crud-modal-template.ts';

/**
 * Map of custom ESLint rule IDs to their implementations.
 * Used by ESLint flat config to register rules under the 'custom-rules' plugin namespace.
 */
export const rules = {
  'prefer-crud-modal-template': preferCrudModalTemplate,
};

export default { rules };
