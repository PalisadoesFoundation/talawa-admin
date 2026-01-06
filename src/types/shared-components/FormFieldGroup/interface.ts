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
interface ICommonInputProps {
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
interface IBootstrapTextFieldProps {
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
interface IMuiFieldProps {
  variant?: TextFieldVariants;
  endAdornment?: React.ReactNode;
}

/**
 * Base wrapper component props for form field groups.
 * Manages label, validation error display, help text, and accessibility attributes.
 */
export interface IFormFieldGroupProps {
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
export interface IFormTextFieldProps
  extends IBootstrapTextFieldProps,
    IMuiFieldProps,
    Omit<IFormFieldGroupProps, 'error'>,
    Omit<ICommonInputProps, 'error'> {
  format: 'bootstrap' | 'mui';
  error?: string;
}

/**
 * Multi-line text area component props using Material-UI TextField.
 * Always renders as multiline with configurable row count.
 */
export interface IFormTextAreaProps
  extends Omit<ICommonInputProps, 'error'>,
    IMuiFieldProps {
  name?: string;
  multiline: true;
  rows?: number;
  label?: string;
  error?: string | boolean;
  touched?: boolean;
  helpText?: string;
  required?: boolean;
  ariaLabel?: string;
}

/**
 * Autocomplete/select component props using Material-UI Autocomplete.
 * Supports single/multiple selection with user data (InterfaceUserInfo).
 */
export interface IFormSelectProps
  extends Omit<ICommonInputProps, 'value' | 'onChange' | 'error'> {
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
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
  label?: string;
  name?: string;
  error?: string | boolean;
  touched?: boolean;
  helpText?: string;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

/**
 * Checkbox component props using Bootstrap Form.Check.
 * Provides labeled checkbox with custom container and label attributes.
 */
export interface IFormCheckBoxProps
  extends Omit<FormCheckProps, 'formAction' | 'type'>,
    Omit<
      ICommonInputProps,
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
 * Renders multiple radio options with shared name and validation state.
 */
interface IRadioOption {
  label: string;
  value: string;
}

export interface IFormRadioGroupProps
  extends Omit<FormCheckProps, 'formAction' | 'type'>,
    Omit<
      ICommonInputProps,
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
  options: IRadioOption[];
  groupClass?: string;
  labelClass?: string;
}

/**
 * Date picker field component props using MUI DatePicker with Dayjs.
 * Supports min/max date constraints and custom text field props via slotProps.
 */
export interface IFormDateFieldProps {
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
  touched?: boolean;
  helpText?: string;
}
