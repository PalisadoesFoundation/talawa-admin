/**
 * Type definitions for UserAddressFields component.
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
