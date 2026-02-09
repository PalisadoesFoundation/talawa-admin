/**
 * Central export point for all custom ESLint rules and restrictions.
 */
import {
  restrictImportsExcept,
  restrictedImportPaths,
  stripId,
  restrictedImports,
} from './imports.js';
import { securityRestrictions } from './security.js';
import { searchInputRestrictions } from './search-input.js';
import preferCrudModalTemplate from './prefer-crud-modal-template.js';
import { modalStateRestrictions } from './modal-state.js';
import { nativeButtonRestrictions } from './native-button.js';

export {
  restrictedImports,
  restrictedImportPaths,
  restrictImportsExcept,
  stripId,
  securityRestrictions,
  searchInputRestrictions,
  preferCrudModalTemplate,
  modalStateRestrictions,
  nativeButtonRestrictions,
};
