import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

/** Fixed UTC timestamp for deterministic tests. */
export const FIXED_UTC_TIMESTAMP = '2025-01-01T10:00:00.000Z';

export const mockOrgData = {
  organization: {
    __typename: 'Organization',
    id: '1',
    name: 'Test Org',
    description: 'Test Description',
    addressLine1: '123 Test St',
    addressLine2: 'Suite 100',
    city: 'Test City',
    state: 'Test State',
    postalCode: '12345',
    countryCode: 'US',
    avatarURL: null,
    createdAt: FIXED_UTC_TIMESTAMP,
    updatedAt: FIXED_UTC_TIMESTAMP,
    isUserRegistrationRequired: false,
    isVisibleInSearch: false,
  },
};

/** Variant with empty address fields for mutation payload tests. */
export const mockOrgDataWithEmptyFields = {
  organization: {
    ...mockOrgData.organization,
    addressLine2: '',
    city: '',
    postalCode: '',
  },
};

/** Variant with null isUserRegistrationRequired for switch default tests. */
export const mockOrgDataWithNullUserReg = {
  organization: {
    ...mockOrgData.organization,
    isUserRegistrationRequired: null,
  },
};

/** Shared updateOrganization mutation response for test mocks; spread and override as needed. */
export const mockUpdateOrgResponse = {
  __typename: 'Organization' as const,
  id: '1',
  name: 'Test Org',
  description: 'Test Description',
  addressLine1: '123 Test St',
  addressLine2: 'Suite 100',
  city: 'Test City',
  state: 'Test State',
  postalCode: '12345',
  countryCode: 'US',
  avatarMimeType: null,
  avatarURL: null,
  updatedAt: FIXED_UTC_TIMESTAMP,
  isUserRegistrationRequired: false,
};

const defaultUpdateInput = {
  id: '1',
  name: 'Updated Org',
  description: 'Updated Description',
  addressLine1: '123 Test St',
  addressLine2: 'Suite 100',
  city: 'Test City',
  state: 'Test State',
  postalCode: '12345',
  countryCode: 'US',
  isUserRegistrationRequired: false,
};

export const MOCKS = [
  {
    request: {
      query: GET_ORGANIZATION_BASIC_DATA,
      variables: { id: '1' },
    },
    result: {
      data: mockOrgData,
    },
  },
  {
    request: {
      query: UPDATE_ORGANIZATION_MUTATION,
      variables: {
        input: defaultUpdateInput,
      },
    },
    result: {
      data: {
        updateOrganization: {
          ...mockUpdateOrgResponse,
          name: 'Updated Org',
          description: 'Updated Description',
        },
      },
    },
  },
];

export const MOCKS_QUERY_ERROR = [
  {
    request: {
      query: GET_ORGANIZATION_BASIC_DATA,
      variables: { id: '1' },
    },
    error: new Error('Failed to load organization'),
  },
];

/** Query error with alternate message for "displays error message when query fails" test. */
export const MOCKS_QUERY_ERROR_FETCH = [
  {
    request: {
      query: GET_ORGANIZATION_BASIC_DATA,
      variables: { id: '1' },
    },
    error: new Error('Failed to fetch organization data'),
  },
];

export const MOCKS_UPDATE_ERROR = [
  {
    request: {
      query: GET_ORGANIZATION_BASIC_DATA,
      variables: { id: '1' },
    },
    result: { data: mockOrgData },
  },
  {
    request: {
      query: UPDATE_ORGANIZATION_MUTATION,
      variables: {
        input: defaultUpdateInput,
      },
    },
    error: new Error('Failed to update organization'),
  },
];
