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

  describe('OrgUpdate Address Form Fields', () => {
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
    ];

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('loads and displays address fields correctly', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        // Check if address fields are populated with initial data
        expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test State')).toBeInTheDocument();
        expect(screen.getByDisplayValue('123 Test St')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Suite 100')).toBeInTheDocument();
        expect(screen.getByDisplayValue('12345')).toBeInTheDocument();

        // Check if country select is present
        expect(screen.getByTestId('countrycode')).toBeInTheDocument();
      });
    });

    it('handles country selection change', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('countrycode')).toBeInTheDocument();
      });

      const countrySelect = screen.getByTestId('countrycode');
      fireEvent.change(countrySelect, { target: { value: 'CA' } });
      expect(countrySelect).toHaveValue('CA');
    });

    it('handles city input change', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
      });

      const cityInput = screen.getByDisplayValue('Test City');
      fireEvent.change(cityInput, { target: { value: 'New City' } });
      expect(cityInput).toHaveValue('New City');
    });

    it('handles state input change', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test State')).toBeInTheDocument();
      });

      const stateInput = screen.getByDisplayValue('Test State');
      fireEvent.change(stateInput, { target: { value: 'New State' } });
      expect(stateInput).toHaveValue('New State');
    });

    it('handles dependent locality input change', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for the component to load initial data
      await waitFor(() => {
        expect(
          screen.getByPlaceholderText(i18n.t('orgUpdate.dependentLocality')),
        ).toBeInTheDocument();
      });

      // Get and change the dependent locality input
      const dependentLocalityInput = screen.getByPlaceholderText(
        i18n.t('orgUpdate.dependentLocality'),
      );
      fireEvent.change(dependentLocalityInput, {
        target: { value: 'District 1' },
      });

      // Verify the value was updated in the input
      expect(dependentLocalityInput).toHaveValue('District 1');

      // Verify the form state was updated
      await waitFor(() => {
        expect(dependentLocalityInput).toHaveValue('District 1');
      });
    });

    it('handles address line inputs change', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('123 Test St')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Suite 100')).toBeInTheDocument();
      });

      const line1Input = screen.getByDisplayValue('123 Test St');
      const line2Input = screen.getByDisplayValue('Suite 100');

      fireEvent.change(line1Input, { target: { value: '456 New St' } });
      fireEvent.change(line2Input, { target: { value: 'Floor 2' } });

      expect(line1Input).toHaveValue('456 New St');
      expect(line2Input).toHaveValue('Floor 2');
    });

    it('handles postal code and sorting code inputs change', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for component to load with initial data
      await waitFor(() => {
        expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText(i18n.t('orgUpdate.sortingCode')),
        ).toBeInTheDocument();
      });

      // Get input elements using translation keys
      const postalCodeInput = screen.getByDisplayValue('12345');
      const sortingCodeInput = screen.getByPlaceholderText(
        i18n.t('orgUpdate.sortingCode'),
      );

      // Change input values
      fireEvent.change(postalCodeInput, { target: { value: '54321' } });
      fireEvent.change(sortingCodeInput, { target: { value: 'SORT123' } });

      // Verify immediate value changes
      expect(postalCodeInput).toHaveValue('54321');
      expect(sortingCodeInput).toHaveValue('SORT123');

      // Verify the form state was updated
      await waitFor(() => {
        expect(postalCodeInput).toHaveValue('54321');
        expect(sortingCodeInput).toHaveValue('SORT123');
      });
    });
  });
});
