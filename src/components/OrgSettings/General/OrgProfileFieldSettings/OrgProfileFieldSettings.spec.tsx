import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import i18next from 'i18next';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import OrgProfileFieldSettings from './OrgProfileFieldSettings';
import {
  ADD_CUSTOM_FIELD,
  REMOVE_CUSTOM_FIELD,
} from 'GraphQl/Mutations/mutations';

// Mock external dependencies
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `orgProfileField:${key}`,
    i18n: {
      on: vi.fn(),
      off: vi.fn(),
    },
  }),
}));

vi.mock('@apollo/client', async (importOriginal) => {
  const actual: object = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  };
});

// Mock data
const mockAddField = {
  request: {
    query: ADD_CUSTOM_FIELD,
    variables: {
      organizationId: '1',
      name: 'Test Field',
      type: 'STRING',
    },
  },
  result: { data: { addCustomField: { id: '1' } } },
};

const mockRemoveField = {
  request: {
    query: REMOVE_CUSTOM_FIELD,
    variables: { id: '1' },
  },
  result: { data: { removeCustomField: { success: true } } },
};

const mockError = {
  request: {
    query: ADD_CUSTOM_FIELD,
    variables: {
      organizationId: '1',
      name: 'Test Field',
      type: 'STRING',
    },
  },
  error: new Error('API Error'),
};

describe('OrgProfileFieldSettings', () => {
  beforeEach(() => {
    (useMutation as unknown as jest.Mock).mockImplementation(() => [
      vi.fn(),
      { loading: false },
    ]);

    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: {
        organization: {
          customFields: [
            { id: '1', name: 'Field 1', type: 'STRING' },
            { id: '2', name: 'Field 2', type: 'NUMBER' },
          ],
        },
      },
      loading: false,
      refetch: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders component with custom fields', () => {
    render(
      <MockedProvider addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByTestId('removeCustomFieldBtn')).toHaveLength(2);
  });

  test('shows validation error for empty fields', async () => {
    render(
      <MockedProvider mocks={[mockAddField]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'orgProfileField:pleaseFillAllRequiredFields',
      );
    });
  });

  test('handles add field error', async () => {
    (useMutation as unknown as jest.Mock).mockImplementation(() => [
      vi.fn().mockRejectedValue(new Error('API Error')),
    ]);

    render(
      <MockedProvider mocks={[mockError]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    fireEvent.change(screen.getByTestId('customFieldInput'), {
      target: { value: 'Test Field' },
    });
    fireEvent.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('removes custom field successfully', async () => {
    const removeMock = vi.fn();
    (useMutation as unknown as jest.Mock).mockImplementation(() => [
      removeMock,
    ]);

    render(
      <MockedProvider mocks={[mockRemoveField]} addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    fireEvent.click(screen.getAllByTestId('removeCustomFieldBtn')[0]);

    await waitFor(() => {
      expect(removeMock).toHaveBeenCalledWith({
        variables: { id: '1' },
      });
      expect(toast.success).toHaveBeenCalledWith(
        'orgProfileField:customFieldRemoved',
      );
    });
  });

  test('handles language change refetch', async () => {
    const refetchMock = vi.fn();
    (useQuery as unknown as jest.Mock).mockReturnValue({
      refetch: refetchMock,
      loading: false,
      data: { organization: { customFields: [] } },
    });

    render(
      <MockedProvider addTypename={false}>
        <OrgProfileFieldSettings />
      </MockedProvider>,
    );

    i18next.emit('languageChanged');
    expect(refetchMock).toHaveBeenCalled();
  });
});
