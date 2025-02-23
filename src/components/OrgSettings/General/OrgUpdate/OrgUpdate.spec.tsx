import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';

import OrgUpdate from './OrgUpdate';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

// Mock modules
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Initialize i18n for testing
i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        orgUpdate: {
          successfulUpdated: 'Organization updated successfully',
          enterNameOrganization: 'Enter organization name',
        },
      },
      common: {
        name: 'Name',
        description: 'Description',
        address: 'Address',
        saving: 'Saving...',
        saveChanges: 'Save Changes',
      },
    },
  },
});

const mockOrgData = {
  organization: {
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
  },
};

describe('OrgUpdate Component', () => {
  const mocks = [
    {
      request: {
        query: ORGANIZATIONS_LIST,
        variables: { input: { id: '1' } },
      },
      result: {
        data: mockOrgData,
      },
    },
    {
      request: {
        query: UPDATE_ORGANIZATION_MUTATION,
        variables: {
          input: {
            id: '1',
            name: 'Updated Org',
            description: 'Updated Description',
            addressLine1: '123 Test St',
            addressLine2: 'Suite 100',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            countryCode: 'US',
            avatar: null,
          },
        },
      },
      result: {
        data: {
          updateOrganization: {
            organization: {
              ...mockOrgData.organization,
              name: 'Updated Org',
              description: 'Updated Description',
            },
          },
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays organization data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });
  });

  it('handles form input changes', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue('Test Org');
    fireEvent.change(nameInput, { target: { value: 'Updated Org' } });
    expect(nameInput).toHaveValue('Updated Org');
  });

  it('handles form submission successfully', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });

    // Update form fields
    fireEvent.change(screen.getByDisplayValue('Test Org'), {
      target: { value: 'Updated Org' },
    });
    fireEvent.change(screen.getByDisplayValue('Test Description'), {
      target: { value: 'Updated Description' },
    });

    // Submit form
    const saveButton = screen.getByTestId('save-org-changes-btn');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Organization updated successfully',
      );
    });
  });

  it('displays error when form submission fails', async () => {
    const errorMock = {
      request: {
        query: UPDATE_ORGANIZATION_MUTATION,
        variables: {
          input: {
            id: '1',
            name: '',
            description: '',
            addressLine1: '123 Test St',
            addressLine2: 'Suite 100',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            countryCode: 'US',
            avatar: null,
          },
        },
      },
      error: new Error('Failed to update organization'),
    };

    render(
      <MockedProvider mocks={[...mocks, errorMock]} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });

    // Clear required fields
    fireEvent.change(screen.getByDisplayValue('Test Org'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByDisplayValue('Test Description'), {
      target: { value: '' },
    });

    // Submit form
    const saveButton = screen.getByTestId('save-org-changes-btn');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Name and description are required',
      );
    });
  });

  it('handles file upload', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('organisationImage')).toBeInTheDocument();
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('organisationImage');

    await userEvent.upload(fileInput, file);
  });
});
