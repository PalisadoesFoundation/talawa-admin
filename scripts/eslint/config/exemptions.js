import { restrictImportsExcept } from '../rules/rules.js';

/**
 * @typedef {Object} WrapperExemptionOptions
 * @property {string} componentName
 * @property {string[]} allowedIds
 * @property {string[]} [additionalPaths]
 * @property {string} [componentPath]
 * @property {string|null} [typePath]
 * @property {string} [extensions]
 */

/**
 * @param {WrapperExemptionOptions} options
 * @returns {string[]}
 */
const buildWrapperPaths = ({
  componentName,
  additionalPaths = [],
  componentPath,
  typePath,
  extensions = '{ts,tsx}',
}) => {
  const files = [];
  const resolvedComponentPath =
    componentPath ?? `src/shared-components/${componentName}`;
  const resolvedTypePath =
    typePath === undefined
      ? `src/types/shared-components/${componentName}`
      : typePath;

  if (resolvedComponentPath) {
    files.push(`${resolvedComponentPath}/**/*.${extensions}`);
  }
  if (resolvedTypePath) {
    files.push(`${resolvedTypePath}/**/*.${extensions}`);
  }

  return [...files, ...additionalPaths];
};

/**
 * @param {WrapperExemptionOptions} options
 */
export const createWrapperExemption = (options) => ({
  files: buildWrapperPaths(options),
  rules: restrictImportsExcept(options.allowedIds),
});

export const wrapperExemptions = [
  createWrapperExemption({
    componentName: 'DataGridWrapper',
    allowedIds: ['mui-data-grid', 'mui-data-grid-pro'],
    typePath: 'src/types/DataGridWrapper',
  }),
  createWrapperExemption({
    componentName: 'LoadingState',
    allowedIds: ['rb-spinner'],
    additionalPaths: ['src/components/Loader/**/*.{ts,tsx}'],
  }),
  createWrapperExemption({
    componentName: 'FormFieldGroup',
    allowedIds: ['rb-form', 'rb-form-path'],
    additionalPaths: [
      'src/shared-components/Auth/FormField/**/*.{ts,tsx}',
      'src/types/shared-components/Auth/FormField/**/*.{ts,tsx}',
    ],
  }),
  createWrapperExemption({
    componentName: 'BaseModal',
    allowedIds: ['rb-modal', 'rb-modal-path'],
  }),
  createWrapperExemption({
    componentName: 'NotificationToast',
    allowedIds: ['react-toastify'],
  }),
  createWrapperExemption({
    componentName: 'DropDownButton',
    allowedIds: ['rb-dropdown', 'rb-dropdown-path'],
  }),
  {
    files: [
      'src/shared-components/DateRangePicker/**/*.{ts,tsx}',
      'src/types/shared-components/DateRangePicker/**/*.{ts,tsx}',
      'src/shared-components/DatePicker/**/*.{ts,tsx}',
      'src/types/shared-components/DatePicker/**/*.{ts,tsx}',
      'src/shared-components/TimePicker/**/*.{ts,tsx}',
      'src/types/shared-components/TimePicker/**/*.{ts,tsx}',
      'src/index.tsx',
    ],
    rules: restrictImportsExcept(['mui-date-pickers']),
  },
  createWrapperExemption({
    componentName: 'DataTable',
    allowedIds: ['rb-table', 'rb-table-path'],
  }),
  createWrapperExemption({
    componentName: 'Button',
    allowedIds: ['rb-button', 'rb-button-path'],
  }),
  {
    files: [
      'src/components/AdminPortal/EventRegistrantsModal/Modal/EventRegistrantsModal.tsx',
    ],
    rules: restrictImportsExcept(['mui-autocomplete', 'mui-autocomplete-path']),
  },
];

export const avatarExemption = createWrapperExemption({
  componentName: 'Avatar',
  allowedIds: ['dicebear-core'],
  extensions: '{ts,tsx,d.ts}',
  additionalPaths: [
    'src/shared-components/createAvatar/**/*.{ts,tsx}',
    'src/types/shared-components/createAvatar/**/*.{ts,tsx}',
  ],
});
