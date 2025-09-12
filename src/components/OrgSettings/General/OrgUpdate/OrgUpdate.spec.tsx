import React from 'react';
import { describe, it, expect, vi, beforeEach, suite } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';

import OrgUpdate from './OrgUpdate';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

const uploadFileToMinioMock = vi.fn();

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: () => ({
    uploadFileToMinio: uploadFileToMinioMock,
  }),
}));

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
          enterNameOrganization: 'Enter organization name',
          enterOrganizationDescription: 'Enter organization description',
          userRegistrationRequired: 'User registration required',
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

  it('loads and displays organization data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={true}>
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
      <MockedProvider mocks={mocks} addTypename={true}>
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
      <MockedProvider mocks={mocks} addTypename={true}>
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
        'Organization updated successfully',
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
          },
        },
      },
      error: new Error('Failed to update organization'),
    };

    render(
      <MockedProvider mocks={[queryMock, errorMock]} addTypename={true}>
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

  it('handles file upload with MinIO and shows success toast', async () => {
    const file = new File(['hello'], 'logo.png', { type: 'image/png' });
    uploadFileToMinioMock.mockResolvedValue({
      objectName: 'uploaded-logo.png',
    });

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
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

    expect(uploadFileToMinioMock).toHaveBeenCalledWith(file, '1');
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Image uploaded successfully');
    });
  });

  it('handles failed file upload with MinIO', async () => {
    const file = new File(['oops'], 'logo.png', { type: 'image/png' });
    uploadFileToMinioMock.mockRejectedValue(new Error('Upload failed'));

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
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

    expect(uploadFileToMinioMock).toHaveBeenCalledWith(file, '1');
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Image upload failed');
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
        <MockedProvider mocks={[loadingMock]} addTypename={true}>
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
        <MockedProvider mocks={[errorMock]} addTypename={true}>
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
        <MockedProvider mocks={successMocks} addTypename={true}>
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
        <MockedProvider mocks={mocks} addTypename={true}>
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
              },
            },
          },
          error: new Error('Failed to update organization'),
        },
      ];

      render(
        <MockedProvider mocks={errorMocks} addTypename={true}>
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
        <MockedProvider mocks={mocks} addTypename={true}>
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
      expect(userRegSwitch).not.toBeChecked();

      if (userRegSwitch) {
        fireEvent.click(userRegSwitch);
        expect(userRegSwitch).toBeChecked();
      }

      if (userRegSwitch) {
        fireEvent.click(userRegSwitch);
      }
      expect(userRegSwitch).not.toBeChecked();
    });

    it('toggles visibility switch correctly', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={true}>
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
              },
            },
          },
          result: {
            data: null,
          },
        },
      ];

      render(
        <MockedProvider mocks={mocks} addTypename={true}>
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
            'Failed to update organization',
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
      <MockedProvider mocks={mocks} addTypename={true}>
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
