/**
 * Props for the UserAddressFields component.
 * @param t - Translation function for internationalization
 * @param handleFieldChange - Callback function to handle address field changes
 * @param userDetails - Object containing user address information
 */

export interface InterfaceUserAddressFieldsProps {
  t: (key: string) => string;
  handleFieldChange: (field: string, value: string) => void;
  userDetails: {
    addressLine1: string;
    addressLine2: string;
    state: string;
    countryCode: string;
    city: string;
    postalCode: string;
  };
}
