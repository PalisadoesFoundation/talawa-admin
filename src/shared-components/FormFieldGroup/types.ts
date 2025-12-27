import {
  AutocompleteRenderInputParams,
  TextFieldVariants,
} from '@mui/material';
import React from 'react';
import { FormCheckProps } from 'react-bootstrap';
import { InterfaceUserInfo } from 'utils/interfaces';
import { Dayjs } from 'dayjs';

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

interface BootstrapTextFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel';
  placeholder?: string;
  maxLength?: number;
  showCharCount?: boolean;
  autoComplete?: string;
  controlClass?: string;
  [key: `data-${string}`]: string | number | undefined;
}

interface MuiFieldProps {
  variant?: TextFieldVariants;
  endAdornment?: React.ReactNode;
}

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

export interface FormTextFieldProps
  extends CommonInputProps,
    BootstrapTextFieldProps,
    MuiFieldProps,
    Omit<FormFieldGroupProps, 'error'> {
  format: 'bootstrap' | 'mui';
}

export interface FormTextAreaProps
  extends CommonInputProps,
    MuiFieldProps,
    Omit<FormFieldGroupProps, 'error'> {
  multiline: true;
  rows?: number;
}

export interface FormSelectProps
  extends Omit<FormFieldGroupProps, 'error'>,
    Omit<CommonInputProps, 'value' | 'onChange'> {
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
}

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
}

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
        [key: string]: any;
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
