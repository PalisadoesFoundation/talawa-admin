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
    const queryMock = {
      request: {
        query: ORGANIZATIONS_LIST,
        variables: { input: { id: '1' } },
      },
      result: {
        data: {
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
        },
      },
    };

    const errorMock = {
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
      error: new Error('Failed to update organization'),
    };

    render(
      <MockedProvider mocks={[queryMock, errorMock]} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });

    // Update form with valid data
    fireEvent.change(screen.getByDisplayValue('Test Org'), {
      target: { value: 'Updated Org' },
    });
    fireEvent.change(screen.getByDisplayValue('Test Description'), {
      target: { value: 'Updated Description' },
    });

    // Submit form
    const saveButton = screen.getByTestId('save-org-changes-btn');
    fireEvent.click(saveButton);

    // Verify loading state
    await waitFor(() => {
      expect(saveButton).toBeDisabled();
      expect(saveButton).toHaveTextContent('Saving...');
    });

    // Verify error message from failed mutation
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update organization');
    });

    // Verify button state after error
    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toHaveTextContent('Save Changes');
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

  describe('OrgUpdate Loading and Error States', () => {
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

    it('shows loading state while fetching data', async () => {
      // Create mock data with consistent structure
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
          createdAt: '2024-02-24T00:00:00Z',
          updatedAt: '2024-02-24T00:00:00Z',
          creator: {
            id: '1',
            name: 'Test Creator',
            emailAddress: 'creator@test.com',
          },
          updater: {
            id: '1',
            name: 'Test Updater',
            emailAddress: 'updater@test.com',
          },
        },
      };

      const loadingMock = {
        request: {
          query: ORGANIZATIONS_LIST,
          variables: { input: { id: '1' } },
        },
        result: {
          data: mockOrgData,
        },
        delay: 100, // Add delay to ensure loading state is visible
      };

      render(
        <MockedProvider mocks={[loadingMock]} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Verify loading state is shown
      expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      // Wait for loading to complete and verify data is loaded
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      // Verify loading state is removed
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('shows error state when data fetch fails', async () => {
      const errorMock = {
        request: {
          query: ORGANIZATIONS_LIST,
          variables: { input: { id: '1' } },
        },
        error: new Error('Failed to load organization'),
      };

      render(
        <MockedProvider mocks={[errorMock]} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Error occured while loading Organization Data/),
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Failed to load organization/),
        ).toBeInTheDocument();
      });
    });

    it('handles successful organization update', async () => {
      const successMocks = [
        {
          request: {
            query: ORGANIZATIONS_LIST,
            variables: { input: { id: '1' } },
          },
          result: {
            data: {
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
                createdAt: '2024-02-24T00:00:00Z',
                updatedAt: '2024-02-24T00:00:00Z',
                creator: {
                  id: '1',
                  name: 'Test Creator',
                  emailAddress: 'creator@test.com',
                },
                updater: {
                  id: '1',
                  name: 'Test Updater',
                  emailAddress: 'updater@test.com',
                },
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_ORGANIZATION_MUTATION,
            variables: {
              input: {
                id: '1',
                name: 'Updated Org',
                description: 'Test Description',
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
                  id: '1',
                  name: 'Updated Org',
                  description: 'Test Description',
                  addressLine1: '123 Test St',
                  addressLine2: 'Suite 100',
                  city: 'Test City',
                  state: 'Test State',
                  postalCode: '12345',
                  countryCode: 'US',
                  avatarURL: null,
                  createdAt: '2024-02-24T00:00:00Z',
                  updatedAt: '2024-02-24T00:00:00Z',
                  creator: {
                    id: '1',
                    name: 'Test Creator',
                    emailAddress: 'creator@test.com',
                  },
                  updater: {
                    id: '1',
                    name: 'Test Updater',
                    emailAddress: 'updater@test.com',
                  },
                },
              },
            },
          },
        },
      ];

      render(
        <MockedProvider mocks={successMocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for initial data to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      // Update organization name
      const nameInput = screen.getByDisplayValue('Test Org');
      fireEvent.change(nameInput, { target: { value: 'Updated Org' } });

      // Click save button
      const saveButton = screen.getByTestId('save-org-changes-btn');
      fireEvent.click(saveButton);

      // Check for success message using the correct translation key
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          i18n.t('orgUpdate.successfulUpdated'),
        );
      });
    });

    it('handles failed organization update', async () => {
      const errorMocks = [
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
                description: 'Test Description',
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
        },
      ];

      render(
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      // Update organization name
      const nameInput = screen.getByDisplayValue('Test Org');
      fireEvent.change(nameInput, { target: { value: 'Updated Org' } });

      // Click save button
      const saveButton = screen.getByTestId('save-org-changes-btn');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to update organization',
        );
      });
    });
  });

  describe('OrgUpdate Form Switch Controls', () => {
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

    it('toggles user registration switch correctly', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      // Find the user registration switch
      const userRegSwitch = screen.getByPlaceholderText(
        i18n.t('orgUpdate.userRegistrationRequired'),
      );
      expect(userRegSwitch).toBeInTheDocument();
      expect(userRegSwitch).not.toBeChecked();

      // Toggle the switch
      fireEvent.click(userRegSwitch);
      expect(userRegSwitch).toBeChecked();

      // Toggle back
      fireEvent.click(userRegSwitch);
      expect(userRegSwitch).not.toBeChecked();
    });

    it('toggles visibility switch correctly', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      // Find the visibility switch
      const visibilitySwitch = screen.getByPlaceholderText(
        i18n.t('orgUpdate.isVisibleInSearch'),
      );
      expect(visibilitySwitch).toBeInTheDocument();
      expect(visibilitySwitch).not.toBeChecked();

      // Toggle the switch
      fireEvent.click(visibilitySwitch);
      expect(visibilitySwitch).toBeChecked();

      // Toggle back
      fireEvent.click(visibilitySwitch);
      expect(visibilitySwitch).not.toBeChecked();
    });
  });

  describe('OrgUpdate Loading and Error States', () => {
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
        createdAt: '2024-02-24T00:00:00Z',
        updatedAt: '2024-02-24T00:00:00Z',
        creator: {
          id: '1',
          name: 'Test Creator',
          emailAddress: 'creator@test.com',
        },
        updater: {
          id: '1',
          name: 'Test Updater',
          emailAddress: 'updater@test.com',
        },
      },
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('handles empty response from update mutation', async () => {
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
                description: 'Test Description',
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
            data: null,
          },
        },
      ];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      // Wait for initial data to load and component to be ready
      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      // Find and verify the save button is present
      const saveButton = await screen.findByTestId('save-org-changes-btn');
      expect(saveButton).toBeInTheDocument();

      // Update organization name
      const nameInput = screen.getByDisplayValue('Test Org');
      fireEvent.change(nameInput, { target: { value: 'Updated Org' } });

      // Click save button and wait for the mutation to complete
      fireEvent.click(saveButton);

      // Wait for the error toast with a more specific timeout
      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalledWith(
            'Failed to update organization',
          );
        },
        { timeout: 2000 },
      );

      // Verify button state after mutation
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toHaveTextContent('Save Changes');
    });
  });
});
