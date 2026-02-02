import { restrictImportsExcept } from '../rules/rules.ts';

type WrapperExemptionOptions = {
  componentName: string;
  allowedIds: string[];
  additionalPaths?: string[];
  componentPath?: string;
  typePath?: string | null;
  extensions?: string;
};

const buildWrapperPaths = ({
  componentName,
  additionalPaths = [],
  componentPath,
  typePath,
  extensions = '{ts,tsx}',
}: WrapperExemptionOptions): string[] => {
  const files: string[] = [];
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

export const createWrapperExemption = (options: WrapperExemptionOptions) => ({
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
  createWrapperExemption({
    componentName: 'DropDownButton',
    allowedIds: ['rb-dropdown', 'rb-dropdown-path'],
  }),
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
