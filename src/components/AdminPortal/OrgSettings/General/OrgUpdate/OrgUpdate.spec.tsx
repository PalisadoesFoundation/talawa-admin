import React from 'react';
import { describe, it, expect, vi, beforeEach, suite } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import OrgUpdate from './OrgUpdate';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
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
          nameDescriptionRequired: 'Name and description are required',
          updateFailed: 'Failed to update organization',
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
    createdAt: dayjs.utc().toISOString(),
    updatedAt: dayjs.utc().toISOString(),
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
              updatedAt: dayjs.utc().toISOString(),
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
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });
  });

  it('handles form input changes', async () => {
    const user = userEvent.setup();

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

    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Org');

    expect(nameInput).toHaveValue('Updated Org');
  });

  it('handles form submission successfully', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });

    // Clear & type inputs
    const nameInput = screen.getByDisplayValue('Test Org');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Org');

    const descInput = screen.getByDisplayValue('Test Description');
    await user.clear(descInput);
    await user.type(descInput, 'Updated Description');

    // Submit form
    const saveButton = screen.getByTestId('save-org-changes-btn');
    await user.click(saveButton);

    // Wait for notification
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        i18n.t('orgUpdate.successfulUpdated'),
      );
    });
  });

  it('displays error when form submission fails', async () => {
    const user = userEvent.setup();
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
            createdAt: dayjs.utc().toISOString(),
            updatedAt: dayjs.utc().toISOString(),
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

    const nameInput = screen.getByLabelText(/name/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Org');

    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated Description');

    const saveButton = screen.getByTestId('save-org-changes-btn');
    await user.click(saveButton);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to update organization',
      );
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
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

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
      });

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
        const errorHeading = screen.getByRole('heading', { level: 6 });

        expect(errorHeading).toHaveTextContent(
          'orgUpdate.errorLoadingOrganizationData',
        );
        expect(errorHeading).toHaveTextContent('Failed to load organization');
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
                createdAt: dayjs.utc().toISOString(),
                updatedAt: dayjs.utc().toISOString(),
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
                  updatedAt: dayjs.utc().toISOString(),
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

      // rest of test...
    });

    it('shows error toast when name or description is missing', async () => {
      const user = userEvent.setup();

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
      const descriptionInput = screen.getByDisplayValue('Test Description');
      const saveButton = screen.getByTestId('save-org-changes-btn');

      await user.clear(nameInput);
      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18n.t('orgUpdate.nameDescriptionRequired'),
        );
      });

      await user.clear(descriptionInput);
      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18n.t('orgUpdate.nameDescriptionRequired'),
        );
      });
    });

    it('handles failed organization update', async () => {
      const user = userEvent.setup();

      const errorMocks = [
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
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Org');

      const saveButton = screen.getByTestId('save-org-changes-btn');
      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
      const user = userEvent.setup();
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
        await user.click(userRegSwitch);
        expect(userRegSwitch).not.toBeChecked();
      }

      if (userRegSwitch) {
        await user.click(userRegSwitch);
      }
      expect(userRegSwitch).toBeChecked();
    });

    it('toggles visibility switch correctly', async () => {
      const user = userEvent.setup();
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
        await user.click(visibilitySwitch);
        expect(visibilitySwitch).toBeChecked();

        await user.click(visibilitySwitch);
        expect(visibilitySwitch).not.toBeChecked();
      }
    });
  });

  it('OrgUpdate Loading and Error States', () => {
    const user = userEvent.setup();
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
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
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
      await user.type(nameInput, 'Updated Org');

      user.click(saveButton);

      await waitFor(
        () => {
          expect(NotificationToast.error).toHaveBeenCalledWith(
            i18n.t('orgUpdate.updateFailed'),
          );
        },
        { timeout: 2000 },
      );
      expect(saveButton).not.toBeDisabled();
      expect(saveButton).toHaveTextContent('Save Changes');
    });
  });

  it('updates address line1 when input changes', async () => {
    const user = userEvent.setup();

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

    expect(addressInput).toHaveValue('123 Test St');

    await user.clear(addressInput);
    await user.type(addressInput, 'New Address Line');

    expect(addressInput).toHaveValue('New Address Line');
  });

  it('displays error message when query fails', async () => {
    const errorMock = {
      request: {
        query: GET_ORGANIZATION_BASIC_DATA,
        variables: { id: '1' },
      },
      error: new Error('Failed to fetch organization data'),
    };

    render(
      <MockedProvider mocks={[errorMock]}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    const errorHeading = await screen.findByRole('heading', { level: 6 });

    expect(errorHeading).toHaveTextContent(
      'orgUpdate.errorLoadingOrganizationData',
    );
    expect(errorHeading).toHaveTextContent('Failed to fetch organization data');
  });

  describe('LoadingState Behavior', () => {
    it('should show LoadingState spinner while organization data is loading', async () => {
      const loadingMocks = [
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
                createdAt: dayjs.utc().toISOString(),
                updatedAt: dayjs.utc().toISOString(),
                isUserRegistrationRequired: false,
              },
            },
            delay: 100,
          },
        },
      ];

      render(
        <MockedProvider mocks={loadingMocks}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      const spinners = screen.getAllByTestId('spinner');
      expect(spinners.length).toBeGreaterThan(0);
    });

    it('should hide spinner and render form after LoadingState completes', async () => {
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
                createdAt: dayjs.utc().toISOString(),
                updatedAt: dayjs.utc().toISOString(),
                isUserRegistrationRequired: false,
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
        expect(screen.getByTestId('save-org-changes-btn')).toBeInTheDocument();
      });

      const spinners = screen.queryAllByTestId('spinner');
      const visibleSpinners = spinners.filter((spinner) => {
        const parent = spinner.closest('[data-testid="loadingContainer"]');
        return parent && !parent.classList.contains('hidden');
      });
      expect(visibleSpinners.length).toBe(0);
    });
  });
});
