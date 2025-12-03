import React from 'react';
import { describe, it, expect, vi, beforeEach, suite } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';

import OrgUpdate from './OrgUpdate';
import {
  GET_ORGANIZATION_BASIC_DATA,
  ORGANIZATIONS_LIST_BASIC,
} from 'GraphQl/Queries/Queries';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        orgUpdate: {
          successfulUpdated: 'Organization updated successfully',
          failedToUpdateOrg: 'Failed to update organization',
          enterNameOrganization: 'Enter organization name',
          enterOrganizationDescription: 'Enter organization description',
          isUserRegistrationRequired: 'User registration required',
          isVisibleInSearch: 'Is visible in search',
          'Is Public': 'Is Public',
        },
      },
      common: {
        name: 'Name',
        description: 'Description',
        address: 'Address',
        saving: 'Saving...',
        saveChanges: 'Save Changes',
        resetChanges: 'Reset Changes',
        displayImage: 'Display Image',
        Location: 'Location',
        'Enter Organization location': 'Enter Organization location',
      },
    },
  },
});

const mockOrgData = {
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
    createdAt: '2024-02-24T00:00:00Z',
    updatedAt: '2024-02-24T00:00:00Z',
    isUserRegistrationRequired: false,
  },
};

describe('OrgUpdate Component', () => {
  const mocks = [
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
            isUserRegistrationRequired: false,
          },
        },
      },
      result: {
        data: {
          updateOrganization: {
            organization: {
              __typename: 'Organization',
              id: '1',
              name: 'Updated Org',
              description: 'Updated Description',
              addressLine1: '123 Test St',
              addressLine2: 'Suite 100',
              city: 'Test City',
              state: 'Test State',
              postalCode: '12345',
              countryCode: 'US',
              avatarMimeType: null,
              avatarURL: null,
              updatedAt: '2023-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and displays organization data', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });
  });

  it('handles form input changes', async () => {
    render(
      <MockedProvider mocks={mocks}>
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
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('Test Org'), {
      target: { value: 'Updated Org' },
    });
    fireEvent.change(screen.getByDisplayValue('Test Description'), {
      target: { value: 'Updated Description' },
    });

    const saveButton = screen.getByTestId('save-org-changes-btn');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        i18n.t('orgUpdate.successfulUpdated'),
      );
    });
  });

  it('displays error when form submission fails', async () => {
    const queryMock = {
      request: {
        query: GET_ORGANIZATION_BASIC_DATA,
        variables: { id: '1' },
      },
      result: {
        data: {
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
            createdAt: '2024-02-24T00:00:00Z',
            updatedAt: '2024-02-24T00:00:00Z',
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
            isUserRegistrationRequired: false,
          },
        },
      },
      error: new Error('Failed to update organization'),
    };

    render(
      <MockedProvider mocks={[queryMock, errorMock]}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByDisplayValue('Test Org'), {
      target: { value: 'Updated Org' },
    });
    fireEvent.change(screen.getByDisplayValue('Test Description'), {
      target: { value: 'Updated Description' },
    });

    const saveButton = screen.getByTestId('save-org-changes-btn');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveButton).toBeDisabled();
      expect(saveButton).toHaveTextContent('Saving...');
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update organization');
    });

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toHaveTextContent('Save Changes');
    });
  });

  vi.mock('utils/convertToBase64', () => ({
    default: vi.fn().mockResolvedValue('base64String'),
  }));

  it('handles file upload', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('organisationImage')).toBeInTheDocument();
    });

    const fileInput = screen.getByTestId(
      'organisationImage',
    ) as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toBe(file);

    await waitFor(() => {
      const saveButton = screen.getByTestId('save-org-changes-btn');
      expect(saveButton).toBeEnabled();
    });
  });

  describe('OrgUpdate Loading and Error States', () => {
    const mockOrgData = {
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
        createdAt: '2024-02-24T00:00:00Z',
        updatedAt: '2024-02-24T00:00:00Z',
        creator: {
          __typename: 'User',
          id: '1',
          name: 'Test Creator',
          emailAddress: 'creator@test.com',
        },
        updater: {
          __typename: 'User',
          id: '1',
          name: 'Test Updater',
          emailAddress: 'updater@test.com',
        },
      },
    };

    it('shows loading state while fetching data', async () => {
      const mockOrgData = {
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
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        result: {
          data: mockOrgData,
        },
        delay: 100,
      };

      render(
        <MockedProvider mocks={[loadingMock]}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('shows error state when data fetch fails', async () => {
      const errorMock = {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        error: new Error('Failed to load organization'),
      };

      render(
        <MockedProvider mocks={[errorMock]}>
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
            query: GET_ORGANIZATION_BASIC_DATA,
            variables: { id: '1' },
          },
          result: {
            data: {
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
                createdAt: '2024-02-24T00:00:00Z',
                updatedAt: '2024-02-24T00:00:00Z',
                isUserRegistrationRequired: false,
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
                isUserRegistrationRequired: false,
              },
            },
          },
          result: {
            data: {
              updateOrganization: {
                organization: {
                  __typename: 'Organization',
                  id: '1',
                  name: 'Updated Org',
                  description: 'Test Description',
                  addressLine1: '123 Test St',
                  addressLine2: 'Suite 100',
                  city: 'Test City',
                  state: 'Test State',
                  postalCode: '12345',
                  countryCode: 'US',
                  avatarMimeType: null,
                  avatarURL: null,
                  updatedAt: '2024-02-24T00:00:00Z',
                },
              },
            },
          },
        },
      ];

      render(
        <MockedProvider mocks={successMocks}>
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

      const saveButton = screen.getByTestId('save-org-changes-btn');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          i18n.t('orgUpdate.successfulUpdated'),
        );
      });
    });
    it('shows error toast when name or description is missing', async () => {
      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByDisplayValue('Test Org'), {
        target: { value: '' },
      });

      const saveButton = screen.getByTestId('save-org-changes-btn');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Name and description are required',
        );
      });

      fireEvent.change(screen.getByDisplayValue('Test Description'), {
        target: { value: '' },
      });

      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Name and description are required',
        );
      });
    });

    it('handles failed organization update', async () => {
      const errorMocks = [
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
                isUserRegistrationRequired: false,
              },
            },
          },
          error: new Error('Failed to update organization'),
        },
      ];

      render(
        <MockedProvider mocks={errorMocks}>
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

      const saveButton = screen.getByTestId('save-org-changes-btn');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Failed to update organization',
        );
      });
    });

    it('shows error toast when organization name already exists', async () => {
      const existingOrgMock = {
        request: {
          query: ORGANIZATIONS_LIST_BASIC,
        },
        result: {
          data: {
            organizations: [
              {
                __typename: 'Organization',
                id: '2',
                name: 'Existing Org',
                description: 'Existing Description',
                addressLine1: '456 Existing St',
                addressLine2: 'Suite 200',
                city: 'Existing City',
                state: 'Existing State',
                postalCode: '67890',
                countryCode: 'US',
                avatarURL: null,
              },
            ],
          },
        },
      };

      render(
        <MockedProvider mocks={[...mocks, existingOrgMock]}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByDisplayValue('Test Org'), {
        target: { value: 'Existing Org' },
      });

      const saveButton = screen.getByTestId('save-org-changes-btn');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Organization name already exists',
        );
      });
    });
  });

  describe('OrgUpdate Form Switch Controls', () => {
    const mockOrgData = {
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
        createdAt: '2024-02-24T00:00:00Z',
        updatedAt: '2024-02-24T00:00:00Z',
        isUserRegistrationRequired: false,
      },
    };

    const mocks = [
      {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
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
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      const userRegLabel = screen.getByText(i18n.t('orgUpdate.isPublic') + ':');
      expect(userRegLabel).toBeInTheDocument();

      const userRegSwitch = userRegLabel
        .closest('.d-flex')
        ?.querySelector('input[type="checkbox"]');
      expect(userRegSwitch).toBeInTheDocument();
      expect(userRegSwitch).toBeChecked();

      if (userRegSwitch) {
        fireEvent.click(userRegSwitch);
        expect(userRegSwitch).not.toBeChecked();
      }

      if (userRegSwitch) {
        fireEvent.click(userRegSwitch);
      }
      expect(userRegSwitch).toBeChecked();
    });

    it('toggles visibility switch correctly', async () => {
      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      const visibilityLabel = screen.getByText(
        i18n.t('orgUpdate.isVisibleInSearch') + ':',
      );
      expect(visibilityLabel).toBeInTheDocument();

      const visibilitySwitch = visibilityLabel
        .closest('.d-flex')
        ?.querySelector('input[type="checkbox"]');
      expect(visibilitySwitch).toBeInTheDocument();
      expect(visibilitySwitch).not.toBeChecked();

      if (visibilitySwitch) {
        fireEvent.click(visibilitySwitch);
        expect(visibilitySwitch).toBeChecked();

        fireEvent.click(visibilitySwitch);
        expect(visibilitySwitch).not.toBeChecked();
      }
    });
  });

  it('OrgUpdate Loading and Error States', () => {
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

    suite('handles empty response from update mutation', async () => {
      const mocks = [
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
                isUserRegistrationRequired: false,
              },
            },
          },
          result: {
            data: null,
          },
        },
      ];

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

      const saveButton = await screen.findByTestId('save-org-changes-btn');
      expect(saveButton).toBeInTheDocument();

      const nameInput = screen.getByDisplayValue('Test Org');
      fireEvent.change(nameInput, { target: { value: 'Updated Org' } });

      fireEvent.click(saveButton);

      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalledWith(
            i18n.t('orgUpdate.failedToUpdateOrg'),
          );
        },
        { timeout: 2000 },
      );
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toHaveTextContent('Save Changes');
    });
  });

  it('updates address line1 when input changes', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('123 Test St')).toBeInTheDocument();
    });

    const addressInput = screen.getByPlaceholderText(
      'Enter Organization location',
    );
    expect(addressInput).toBeInTheDocument();

    expect(addressInput).toHaveValue('123 Test St');

    fireEvent.change(addressInput, { target: { value: 'New Address Line' } });

    expect(addressInput).toHaveValue('New Address Line');
  });
});
