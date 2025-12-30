import {
  AutocompleteRenderInputParams,
  TextFieldVariants,
} from '@mui/material';
import React from 'react';
import { FormCheckProps } from 'react-bootstrap';
import { InterfaceUserInfo } from 'utils/interfaces';
import { Dayjs } from 'dayjs';

/**
 * Common properties shared across all form input components.
 * Provides standard value, onChange, error, and state management props.
 */
interface CommonInputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

/**
 * Bootstrap-specific text field properties.
 * Supports standard HTML input attributes and data-* attributes for testing.
 */
interface BootstrapTextFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  placeholder?: string;
  maxLength?: number;
  showCharCount?: boolean;
  autoComplete?: string;
  controlClass?: string;
  [key: `data-${string}`]: string | number | undefined;
}

/**
 * Material-UI field properties for enhanced form controls.
 * Includes variant and endAdornment for icon/action buttons.
 */
interface MuiFieldProps {
  variant?: TextFieldVariants;
  endAdornment?: React.ReactNode;
}

/**
 * Base wrapper component props for form field groups.
 * Manages label, validation error display, help text, and accessibility attributes.
 */
export interface FormFieldGroupProps {
  name?: string;
  label?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  groupClass?: string;
  labelClass?: string;
  error?: string | boolean;
  touched?: boolean;
  helpText?: string;
  required?: boolean;
}

/**
 * Text field component props supporting both Bootstrap and MUI formats.
 * Combines common input, Bootstrap-specific, and MUI properties.
 */
export interface FormTextFieldProps
  extends BootstrapTextFieldProps,
    MuiFieldProps,
    Omit<FormFieldGroupProps, 'error'>,
    Omit<CommonInputProps, 'error'> {
  format: 'bootstrap' | 'mui';
  error?: string;
}

/**
 * Multi-line text area component props using Material-UI TextField.
 * Always renders as multiline with configurable row count.
 */
export interface FormTextAreaProps
  extends Omit<CommonInputProps, 'error'>,
    MuiFieldProps {
  name?: string;
  multiline: true;
  rows?: number;
  label?: string;
  error?: string | boolean;
  touched?: boolean;
  helpText?: string;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

/**
 * Autocomplete/select component props using Material-UI Autocomplete.
 * Supports single/multiple selection with user data (InterfaceUserInfo).
 */
export interface FormSelectProps
  extends Omit<CommonInputProps, 'value' | 'onChange' | 'error'> {
  options?: InterfaceUserInfo[];
  value?: InterfaceUserInfo | InterfaceUserInfo[];
  multiple?: boolean;
  limitTags?: number;
  isOptionEqualToValue?: (
    option: InterfaceUserInfo,
    value: InterfaceUserInfo,
  ) => boolean;
  filterSelectedOptions?: boolean;
  getOptionLabel?: (option: InterfaceUserInfo) => string;
  onChange?: (
    event: React.SyntheticEvent,
    value: InterfaceUserInfo | InterfaceUserInfo[] | null,
  ) => void;
  renderInput: (params: AutocompleteRenderInputParams) => React.ReactNode;
  label?: string;
  name?: string;
  error?: string | boolean;
  touched?: boolean;
  helpText?: string;
  required?: boolean;
}

/**
 * Checkbox component props using Bootstrap Form.Check.
 * Provides labeled checkbox with custom container and label attributes.
 */
export interface FormCheckBoxProps
  extends Omit<FormCheckProps, 'formAction' | 'type'>,
    Omit<
      CommonInputProps,
      'onBlur' | 'onFocus' | 'onChange' | 'value' | 'error'
    > {
  type?: 'checkbox';
  labelText?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  containerClass?: string;
  containerProps?: Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'onBlur' | 'onFocus' | 'formAction'
  >;
  touched?: boolean;
  error?: string;
}

/**
 * Radio button group component props using Bootstrap Form.Check.
 * Renders individual radio buttons within a named group.
 */
export interface FormRadioGroupProps
  extends Omit<FormCheckProps, 'formAction' | 'type'>,
    Omit<
      CommonInputProps,
      'onBlur' | 'onFocus' | 'onChange' | 'value' | 'error'
    > {
  type?: 'radio';
  name?: string;
  id?: string;
  label?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  touched?: boolean;
  error?: string;
  options: Array<{ label: string; value: string }>;
  groupClass?: string;
  labelClass?: string;
}

/**
 * Date picker field component props using MUI DatePicker with Dayjs.
 * Supports min/max date constraints and custom text field props via slotProps.
 */
export interface FormDateFieldProps {
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  format?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  slotProps?: {
    textField?: {
      inputProps?: {
        'data-testid'?: string;
        'aria-label'?: string;
        max?: string;
        min?: string;
        [key: `data-${string}`]: string | number | undefined;
      };
      error?: boolean;
      helperText?: string;
      required?: boolean;
      label?: string;
    };
  };
  label?: string;
  name?: string;
  error?: boolean;
  required?: boolean;
}
