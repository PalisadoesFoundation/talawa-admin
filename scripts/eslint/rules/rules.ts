/**
 * Central export point for all custom ESLint rules and restrictions.
 */
import {
  restrictImportsExcept,
  restrictedImportPaths,
  stripId,
  restrictedImports,
} from './imports.ts';
import { securityRestrictions } from './security.ts';
import { searchInputRestrictions } from './search-input.ts';
import preferCrudModalTemplate from './prefer-crud-modal-template.ts';
import { modalStateRestrictions } from './modal-state.ts';

export {
  restrictedImports,
  restrictedImportPaths,
  restrictImportsExcept,
  stripId,
  securityRestrictions,
  searchInputRestrictions,
  preferCrudModalTemplate,
  modalStateRestrictions,
};
