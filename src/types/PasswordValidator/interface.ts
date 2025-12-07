/**
 * Props for the PasswordValidator component
 */
export interface InterfacePasswordValidatorProps {
  password: string;
  isInputFocused: boolean;
  validation: {
    lowercaseChar: boolean;
    uppercaseChar: boolean;
    numericValue: boolean;
    specialChar: boolean;
  };
}

export interface InterfaceValidationItemProps {
  isValid: boolean;
  text: string;
  className?: string;
}
