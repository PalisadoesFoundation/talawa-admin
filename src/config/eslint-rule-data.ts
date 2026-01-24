/**
 * Test data for ESLint configuration rules
 * This file exports the rule arrays to enable proper test coverage
 * without affecting the main ESLint configuration
 */

/**
 * Central registry for restricted imports used by the base rule and overrides.
 * Add new restrictions here, then allow them in specific folders via IDs.
 * For more details refer `docs/docs/docs/developer-resources/reusable-components.md`
 */
export const restrictedImports = [
  {
    id: 'mui-data-grid',
    name: '@mui/x-data-grid',
    message:
      'Direct imports from @mui/x-data-grid are not allowed. Please use the DataGridWrapper component from src/shared-components/DataGridWrapper/ instead.',
  },
  {
    id: 'mui-data-grid-pro',
    name: '@mui/x-data-grid-pro',
    message:
      'Direct imports from @mui/x-data-grid-pro are not allowed. Please use the DataGridWrapper component from src/shared-components/DataGridWrapper/ instead.',
  },
  {
    id: 'rb-spinner',
    name: 'react-bootstrap',
    importNames: ['Spinner'],
    message:
      'Do not import Spinner from react-bootstrap. Use the shared LoadingState component instead.',
  },
  {
    id: 'rb-modal',
    name: 'react-bootstrap',
    importNames: ['Modal'],
    message:
      'Do not import Modal directly. Use the shared BaseModal or the CRUDModalTemplate/* components instead.',
  },
  {
    id: 'rb-modal-path',
    name: 'react-bootstrap/Modal',
    message:
      'Do not import Modal directly. Use the shared BaseModal or the CRUDModalTemplate/* components instead.',
  },

  {
    id: 'rb-form',
    name: 'react-bootstrap',
    importNames: ['Form'],
    message:
      'Do not import Form directly. Use the shared FormFieldGroup component instead.',
  },
  {
    id: 'rb-form-path',
    name: 'react-bootstrap/Form',
    message:
      'Do not import Form directly. Use the shared FormFieldGroup component instead.',
  },
  {
    id: 'mui-date-pickers',
    name: '@mui/x-date-pickers',
    message:
      'Direct imports from @mui/x-date-pickers are not allowed. Please use the wrappers (DateRangePicker, DatePicker, TimePicker) from src/shared-components/ instead.',
  },
  {
    id: 'rb-table',
    name: 'react-bootstrap',
    importNames: ['Table'],
    message:
      'Do not import Table directly. Use the shared DataTable component instead.',
  },
  {
    id: 'rb-table-path',
    name: 'react-bootstrap/Table',
    message:
      'Do not import react-bootstrap/Table directly. Use the shared DataTable component instead.',
  },
  {
    id: 'rb-button',
    name: 'react-bootstrap',
    importNames: ['Button'],
    message:
      'Direct imports of Button from react-bootstrap are not allowed. Use the shared Button component from src/shared-components/Button/ instead.',
  },
  {
    id: 'rb-button-path',
    name: 'react-bootstrap/Button',
    message:
      'Direct imports of react-bootstrap/Button are not allowed. Use the shared Button component from src/shared-components/Button/ instead.',
  },
  {
    id: 'react-toastify',
    name: 'react-toastify',
    message:
      'Direct imports from react-toastify are not allowed. Please use the NotificationToast component from src/shared-components/NotificationToast/ instead.',
  },
  {
    id: 'dicebear-core',
    name: '@dicebear/core',
    message:
      'Direct imports from @dicebear/core are not allowed. Use the shared createAvatar wrapper instead.',
  },
  {
    name: '@testing-library/react',
    importNames: ['fireEvent'],
    message:
      'Tests in this file use fireEvent for user interactions; our test standards require using userEvent from @testing-library/user-event for interaction fidelity and test reliability.',
  },
  {
    name: '@mui/material',
    importNames: ['Chip'],
    message:
      'Do not import Chip from @mui/material. Use the shared StatusBadge component from src/shared-components/StatusBadge/ instead.',
  },
  {
    name: '@mui/material/Chip',
    message:
      'Do not import Chip from @mui/material. Use the shared StatusBadge component from src/shared-components/StatusBadge/ instead.',
  },
  {
    name: '@mui/material',
    importNames: ['TextField'],
    message:
      'Do not import TextField from @mui/material. Use the shared FormFieldGroup component from src/shared-components/FormFieldGroup/ instead.',
  },
  {
    name: '@mui/material/TextField',
    message:
      'Do not import TextField from @mui/material. Use the shared FormFieldGroup component from src/shared-components/FormFieldGroup/ instead.',
  },
  {
    name: '@mui/material',
    importNames: ['FormControl'],
    message:
      'Do not import FormControl from @mui/material. Use the shared FormFieldGroup component from src/shared-components/FormFieldGroup/ instead.',
  },
  {
    name: '@mui/material/FormControl',
    message:
      'Do not import FormControl from @mui/material. Use the shared FormFieldGroup component from src/shared-components/FormFieldGroup/ instead.',
  },
  {
    name: '@mui/material',
    importNames: ['Button'],
    message:
      'Direct imports of Button from @mui/material are not allowed. Use the shared Button component from src/shared-components/Button/ instead.',
  },
  {
    name: '@mui/material/Button',
    message:
      'Direct imports of Button from @mui/material are not allowed. Use the shared Button component from src/shared-components/Button/ instead.',
  },
];

/**
 * Security-related syntax restrictions that apply everywhere
 */
export const securityRestrictions = [
  {
    selector:
      "Property[key.name='authorization'][value.type='CallExpression'][value.callee.type='MemberExpression'][value.callee.property.name='getItem'][value.arguments.0.value='token']",
    message:
      "Security Risk: Do not use getItem('token') directly inside authorization headers. Extract it to a variable first to handle null values.",
  },
  {
    selector: "ImportSpecifier[imported.name='REVOKE_REFRESH_TOKEN']",
    message:
      'HTTP-Only Cookie Violation: Do not use REVOKE_REFRESH_TOKEN for logout. Use LOGOUT_MUTATION instead, which correctly reads refresh tokens from HTTP-only cookies.',
  },
  {
    selector:
      "Property[key.name='variables'] Property[key.name='refreshToken']",
    message:
      'HTTP-Only Cookie Violation: Do not pass refreshToken as a variable. The API reads refresh tokens from HTTP-only cookies automatically.',
  },
];

/**
 * Search input restrictions - disabled for search component implementations
 */
export const searchInputRestrictions = [
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='type'] > Literal[value='search']",
    message:
      'Direct <input type="search"> is not allowed. Use SearchBar or SearchFilterBar components instead.',
  },
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='placeholder'] > Literal[value=/[Ss]earch|[Ff]ind|[Qq]uer/]",
    message:
      'Input with search-related placeholder detected. Use SearchBar or SearchFilterBar components for search functionality.',
  },
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='name'] > Literal[value=/[Ss]earch/]",
    message:
      'Input with search-related name detected. Use SearchBar or SearchFilterBar components for search functionality.',
  },
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='id'] > Literal[value=/[Ss]earch/]",
    message:
      'Input with search-related id detected. Use SearchBar or SearchFilterBar components for search functionality.',
  },
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='aria-label'] > Literal[value=/[Ss]earch|[Ff]ind|[Qq]uer/]",
    message:
      'Input with search-related aria-label detected. Use SearchBar or SearchFilterBar components for search functionality.',
  },
];

// Helper functions for rule processing
export const stripId = (entry: {
  id?: string;
  name: string;
  message?: string;
  importNames?: string[];
}) => {
  const { id: _id, ...rule } = entry;
  return rule;
};

export const restrictedImportPaths = restrictedImports.map(stripId);

export const restrictImportsExcept = (
  allowedIds: string[] = [],
): {
  'no-restricted-imports': readonly [
    'error',
    { paths: { name: string; message?: string; importNames?: string[] }[] },
  ];
} => ({
  'no-restricted-imports': [
    'error',
    {
      paths: restrictedImports
        .filter(({ id }) => !id || !allowedIds.includes(id))
        .map(stripId),
    },
  ] as const,
});
