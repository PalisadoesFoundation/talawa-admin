import {
  InterfacePhoneFieldConfig,
  InterfaceAddressFieldConfig,
} from 'types/AdminPortal/MemberDetail/interface';

/**
 * Configuration array for phone input fields.
 * Each object specifies the id, testId, and key of a phone number field.
 */
export const phoneFieldConfigs: InterfacePhoneFieldConfig[] = [
  {
    id: 'mobilePhoneNumber',
    testId: 'inputMobilePhoneNumber',
    key: 'mobilePhoneNumber',
  },
  {
    id: 'workPhoneNumber',
    testId: 'inputWorkPhoneNumber',
    key: 'workPhoneNumber',
  },
  {
    id: 'homePhoneNumber',
    testId: 'inputHomePhoneNumber',
    key: 'homePhoneNumber',
  },
];

/**
 * Configuration array for address input fields.
 * Each object specifies the id, testId, key, and optionally colSize of an address field.
 */
export const addressFieldConfigs: InterfaceAddressFieldConfig[] = [
  {
    id: 'addressLine1',
    testId: 'inputAddressLine1',
    colSize: 12,
    key: 'addressLine1',
  },
  {
    id: 'addressLine2',
    testId: 'inputAddressLine2',
    colSize: 12,
    key: 'addressLine2',
  },
  {
    id: 'postalCode',
    testId: 'inputPostalCode',
    colSize: 12,
    key: 'postalCode',
  },
  {
    id: 'city',
    testId: 'inputCity',
    colSize: 6,
    key: 'city',
  },
  {
    id: 'state',
    testId: 'inputState',
    colSize: 6,
    key: 'state',
  },
];
