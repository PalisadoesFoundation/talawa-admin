import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import OrgProfileFieldSettings from './OrgProfileFieldSettings';
import {
  ADD_CUSTOM_FIELD,
  REMOVE_CUSTOM_FIELD,
} from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_CUSTOM_FIELDS } from 'GraphQl/Queries/Queries';

// Mock external dependencies
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    tCommon: (key: string) => key,
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockCurrentOrgId = 'org123';

const mockCustomFields = [
  { id: '1', name: 'Age', type: 'NUMBER' },
  { id: '2', name: 'Membership', type: 'BOOLEAN' },
];

const successQueryMock = {
  request: {
    query: ORGANIZATION_CUSTOM_FIELDS,
    variables: { organizationId: mockCurrentOrgId },
  },
  result: {
    data: {
      organization: {
        customFields: mockCustomFields,
      },
    },
  },
};

const addFieldMock = {
  request: {
    query: ADD_CUSTOM_FIELD,
    variables: {
      organizationId: mockCurrentOrgId,
      name: 'New Field',
      type: 'STRING',
    },
  },
  result: { data: { addCustomField: { id: '3' } } },
};

const removeFieldMock = {
  request: {
    query: REMOVE_CUSTOM_FIELD,
    variables: { id: '1' },
  },
  result: { data: { removeCustomField: { success: true } } },
};

describe('OrgProfileFieldSettings', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ orgId: mockCurrentOrgId });
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: false,
      data: { organization: { customFields: mockCustomFields } },
      refetch: jest.fn(),
    });
    (useMutation as jest.Mock).mockImplementation(() => [
      jest.fn(),
      { loading: false, error: undefined },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders component with custom fields', async () => {
    render(
      <MockedProvider mocks={[successQueryMock]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    expect(await screen.findByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Membership')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({ loading: true });
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  test('shows error state', () => {
    (useQuery as jest.Mock).mockReturnValue({ error: true });
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );
    expect(screen.getByText('pleaseFillAllRequiredFields')).toBeInTheDocument();
  });

  test('handles custom field addition', async () => {
    const mockRefetch = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      ...successQueryMock,
      refetch: mockRefetch,
    });
    const mockAdd = jest
      .fn()
      .mockResolvedValue({ data: { addCustomField: {} } });
    (useMutation as jest.Mock).mockImplementation(() => [mockAdd]);

    render(
      <MockedProvider mocks={[addFieldMock]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    fireEvent.change(screen.getByTestId('customFieldInput'), {
      target: { value: 'New Field' },
    });
    fireEvent.change(screen.getByTestId('type-select'), {
      target: { value: 'STRING' },
    });
    fireEvent.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith({
        variables: {
          organizationId: mockCurrentOrgId,
          name: 'New Field',
          type: 'STRING',
        },
      });
      expect(toast.success).toHaveBeenCalledWith(
        'orgProfileField.customFieldAdded',
      );
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  test('handles custom field removal', async () => {
    const mockRemove = jest
      .fn()
      .mockResolvedValue({ data: { removeCustomField: {} } });
    (useMutation as jest.Mock).mockImplementation(() => [mockRemove]);

    render(
      <MockedProvider mocks={[removeFieldMock]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    const removeButtons = await screen.findAllByTestId('removeCustomFieldBtn');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith({ variables: { id: '1' } });
      expect(toast.success).toHaveBeenCalledWith(
        'orgProfileField.customFieldRemoved',
      );
    });
  });

  test('shows error when adding field fails', async () => {
    const errorMessage = 'Mutation failed';
    (useMutation as jest.Mock).mockImplementation(() => [
      jest.fn().mockRejectedValue(new Error(errorMessage)),
    ]);

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'orgProfileField.pleaseFillAllRequiredFields',
        { error: errorMessage },
      );
    });
  });

  test('validates form fields before submission', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'orgProfileField.pleaseFillAllRequiredFields',
      );
    });
  });
});
