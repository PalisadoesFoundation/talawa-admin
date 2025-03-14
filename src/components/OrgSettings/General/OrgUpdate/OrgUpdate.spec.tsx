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

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockUploadFileToMinio = vi.fn().mockResolvedValue({
  objectName: 'https://minio-test.com/test-image.jpg',
});

vi.mock('utils/MinioUpload', () => ({
  useMinioUpload: vi.fn(() => ({
    uploadFileToMinio: mockUploadFileToMinio,
  })),
}));

function mockFileInputRef() {
  const mockRef = { current: { click: vi.fn() } };
  const originalUseRef = React.useRef;

  vi.spyOn(React, 'useRef').mockImplementation((initialValue) => {
    if (initialValue === null) {
      return mockRef;
    }
    return originalUseRef(initialValue);
  });

  return { mockRef, cleanup: () => vi.restoreAllMocks() };
}

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

    const testFile = new File(['test image content'], 'test-image.jpg', {
      type: 'image/jpeg',
    });

    const fileInput = screen.getByTestId('organisationImage');
    await userEvent.upload(fileInput, testFile);

    await waitFor(() => {
      expect(mockUploadFileToMinio).toHaveBeenCalledTimes(1);
      expect(mockUploadFileToMinio).toHaveBeenCalledWith(testFile, '1');
    });

    await waitFor(() => {
      const updatedImage = screen.getByAltText('orgImage');
      expect(updatedImage).toHaveAttribute(
        'src',
        'https://minio-test.com/test-image.jpg',
      );
    });
  });
  it('handles case when no file is selected', async () => {
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

    const fileInput = screen.getByTestId('organisationImage');
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(mockUploadFileToMinio).not.toHaveBeenCalled();
  });

  it('displays error toast when name or description is missing', async () => {
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
    const descriptionInput = screen.getByDisplayValue('Test Description');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(descriptionInput, { target: { value: '' } });

    const saveButton = screen.getByTestId('save-org-changes-btn');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Name and description are required',
      );
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
      },
    };

    it('shows loading state while fetching data', async () => {
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
        delay: 100,
      };

      render(
        <MockedProvider mocks={[loadingMock]} addTypename={false}>
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
        <MockedProvider mocks={mocks} addTypename={false}>
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
      <MockedProvider mocks={mocks} addTypename={false}>
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

  it('handles file upload error', async () => {
    mockUploadFileToMinio.mockRejectedValueOnce(new Error('Upload failed'));

    const consoleErrorSpy = vi.spyOn(console, 'error');

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

    const testFile = new File(['test image content'], 'test-image.jpg', {
      type: 'image/jpeg',
    });

    const fileInput = screen.getByTestId('organisationImage');
    await userEvent.upload(fileInput, testFile);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading file image to Minio',
        expect.any(Error),
      );
      expect(toast.error).toHaveBeenCalledWith('Failed to upload image');
    });

    consoleErrorSpy.mockRestore();
  });

  it('triggers file input click when "Change Image" button is clicked', async () => {
    const mocksWithImage = [
      {
        request: {
          query: ORGANIZATIONS_LIST,
          variables: { input: { id: '1' } },
        },
        result: {
          data: {
            organization: {
              ...mockOrgData.organization,
              avatarURL: 'https://example.com/test-image.jpg',
            },
          },
        },
      },
    ];

    const { mockRef, cleanup } = mockFileInputRef();

    render(
      <MockedProvider mocks={mocksWithImage} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByAltText('orgImage')).toBeInTheDocument();
    });

    const changeButton = screen.getByText('Change Image');
    fireEvent.click(changeButton);

    expect(mockRef.current.click).toHaveBeenCalled();

    cleanup();
  });

  it('triggers file input click when "Upload Image" button is clicked', async () => {
    const { mockRef, cleanup } = mockFileInputRef();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Upload Image')).toBeInTheDocument();
    });

    const uploadButton = screen.getByText('Upload Image');
    fireEvent.click(uploadButton);

    expect(mockRef.current.click).toHaveBeenCalled();

    cleanup();
  });
});
