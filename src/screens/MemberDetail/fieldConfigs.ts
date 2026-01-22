// Field configurations to reduce code repetition
export const phoneFieldConfigs = [
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

export const addressFieldConfigs = [
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
  { id: 'city', testId: 'inputCity', colSize: 6, key: 'city' },
  { id: 'state', testId: 'inputState', colSize: 6, key: 'state' },
];
