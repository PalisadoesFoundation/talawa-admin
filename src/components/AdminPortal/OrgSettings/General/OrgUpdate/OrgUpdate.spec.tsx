import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

import OrgUpdate from './OrgUpdate';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
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
          invalidImageType: 'Please upload a valid image file',
          imageSizeTooLarge: 'Image size must be less than 5MB',
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
            isVisibleInSearch: false,
          },
        },
      },
      result: {
        data: {
          updateOrganization: {
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays organization data', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    const nameInput = await screen.findByDisplayValue('Test Org');
    const descriptionInput =
      await screen.findByDisplayValue('Test Description');

    expect(nameInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
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

    const nameInput = await screen.findByDisplayValue('Test Org');

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

    const nameInput = await screen.findByDisplayValue('Test Org');
    const descriptionInput =
      await screen.findByDisplayValue('Test Description');

    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Org');

    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated Description');

    const saveButton = screen.getByTestId('save-org-changes-btn');
    await user.click(saveButton);

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
            isUserRegistrationRequired: false,
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
            isVisibleInSearch: false,
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

    const nameInput = await screen.findByDisplayValue('Test Org');
    const descriptionInput =
      await screen.findByDisplayValue('Test Description');

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

    await waitFor(() => {
      expect(saveButton).toBeEnabled();
      expect(saveButton).toHaveTextContent('Save Changes');
    });
  });

  it('handles file upload', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const fileInput = screen.getByTestId(
      'organisationImage',
    ) as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toBe(file);

    const saveButton = screen.getByTestId('save-org-changes-btn');
    expect(saveButton).toBeEnabled();
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

      await screen.findByDisplayValue('Test Org');

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

      const errorTitle = await screen.findByText(
        /orgUpdate\.errorLoadingOrganizationData/i,
      );
      const errorMessage = await screen.findByText(
        /Failed to load organization/i,
      );

      expect(errorTitle).toHaveTextContent(
        i18n.t('orgUpdate.errorLoadingOrganizationData'),
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it('handles successful organization update', async () => {
      const user = userEvent.setup();

      const successMocks = [
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
                description: 'Updated Description',
                addressLine1: '123 Test St',
                addressLine2: 'Suite 100',
                city: 'Test City',
                state: 'Test State',
                postalCode: '12345',
                countryCode: 'US',
                isUserRegistrationRequired: false,
                isVisibleInSearch: false,
              },
            },
          },
          result: {
            data: {
              updateOrganization: {
                __typename: 'Organization',
                id: '1',
              },
            },
          },
        },
        {
          request: {
            query: GET_ORGANIZATION_BASIC_DATA,
            variables: { id: '1' },
          },
          result: { data: mockOrgData },
        },
      ];

      render(
        <MockedProvider mocks={successMocks}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      const nameInput = await screen.findByDisplayValue('Test Org');
      const descInput = await screen.findByDisplayValue('Test Description');

      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Org');

      await user.clear(descInput);
      await user.type(descInput, 'Updated Description');

      await user.click(screen.getByTestId('save-org-changes-btn'));

      await waitFor(() => {
        expect(NotificationToast.success).toHaveBeenCalledWith(
          i18n.t('orgUpdate.successfulUpdated'),
        );
      });
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

      const nameInput = await screen.findByDisplayValue('Test Org');
      const saveButton = screen.getByTestId('save-org-changes-btn');

      await user.clear(nameInput);
      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18n.t('orgUpdate.nameDescriptionRequired'),
        );
      });

      const descriptionInput =
        await screen.findByDisplayValue('Test Description');
      await user.type(nameInput, 'Test Org');
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
                isVisibleInSearch: false,
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

      const nameInput = await screen.findByDisplayValue('Test Org');
      const saveButton = screen.getByTestId('save-org-changes-btn');

      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Org');

      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Failed to update organization',
        );
      });

      expect(saveButton).toBeEnabled();
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

    it('toggles user registration and visibility switches correctly', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={mocks}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await screen.findByDisplayValue('Test Org');
      const userRegSwitch = screen.getByTestId('user-reg-switch');
      const visibilitySwitch = screen.getByTestId('visibility-switch');

      expect(userRegSwitch).toBeChecked();
      await user.click(userRegSwitch);
      expect(userRegSwitch).not.toBeChecked();

      await user.click(userRegSwitch);
      expect(userRegSwitch).toBeChecked();

      expect(visibilitySwitch).not.toBeChecked();
      await user.click(visibilitySwitch);
      expect(visibilitySwitch).toBeChecked();
      await user.click(visibilitySwitch);
      expect(visibilitySwitch).not.toBeChecked();
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

      await screen.findByDisplayValue('Test Org');

      const visibilitySwitch = screen.getByTestId('visibility-switch');

      expect(visibilitySwitch).not.toBeChecked();

      await user.click(visibilitySwitch);
      expect(visibilitySwitch).toBeChecked();

      await user.click(visibilitySwitch);
      expect(visibilitySwitch).not.toBeChecked();
    });
  });

  describe('OrgUpdate Empty Response Handling', () => {
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

    const emptyResponseMocks = [
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
              isVisibleInSearch: false,
            },
          },
        },
        result: {
          data: null,
        },
      },
    ];

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('handles empty response from update mutation', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={emptyResponseMocks} addTypename={false}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      const nameInput = await screen.findByDisplayValue('Test Org');
      const saveButton = screen.getByTestId('save-org-changes-btn');

      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Org');
      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18n.t('orgUpdate.updateFailed'),
        );
      });

      expect(saveButton).toBeEnabled();
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

    const addressInput = await screen.findByDisplayValue('123 Test St');

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
      i18n.t('orgUpdate.errorLoadingOrganizationData'),
    );

    expect(
      screen.getByText(/Failed to fetch organization data/i),
    ).toBeInTheDocument();
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
          },
          delay: 100,
        },
      ];

      render(
        <MockedProvider mocks={loadingMocks}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      await screen.findByDisplayValue('Test Org');
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('renders form after loading completes', async () => {
      const successMocks = [
        {
          request: {
            query: GET_ORGANIZATION_BASIC_DATA,
            variables: { id: '1' },
          },
          result: { data: mockOrgData },
          delay: 50,
        },
      ];

      render(
        <MockedProvider mocks={successMocks}>
          <I18nextProvider i18n={i18n}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      const saveButton = await screen.findByTestId('save-org-changes-btn');
      expect(saveButton).toBeEnabled();
    });
  });

  it('handles file upload with mutation and clears file input after success', async () => {
    const user = userEvent.setup();
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    const fileUploadMocks = [
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
              name: 'Test Org',
              description: 'Test Description',
              addressLine1: '123 Test St',
              addressLine2: 'Suite 100',
              city: 'Test City',
              state: 'Test State',
              postalCode: '12345',
              countryCode: 'US',
              avatar: file,
              isUserRegistrationRequired: false,
              isVisibleInSearch: false,
            },
          },
        },
        result: {
          data: {
            updateOrganization: {
              organization: {
                __typename: 'Organization',
                id: '1',
                name: 'Test Org',
              },
            },
          },
        },
      },
      {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        result: { data: mockOrgData },
      },
    ];

    render(
      <MockedProvider mocks={fileUploadMocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const fileInput = screen.getByTestId(
      'organisationImage',
    ) as HTMLInputElement;
    await user.upload(fileInput, file);

    expect(fileInput.files?.[0]).toBe(file);

    const saveButton = screen.getByTestId('save-org-changes-btn');
    await user.click(saveButton);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        i18n.t('orgUpdate.successfulUpdated'),
      );
    });

    expect(fileInput.value).toBe('');
  });

  it('filters out empty address fields from mutation payload', async () => {
    const user = userEvent.setup();

    const mockWithEmptyFields = {
      organization: {
        __typename: 'Organization',
        id: '1',
        name: 'Test Org',
        description: 'Test Description',
        addressLine1: '123 Test St',
        addressLine2: '',
        city: '',
        state: 'Test State',
        postalCode: '',
        countryCode: 'US',
        avatarURL: null,
        createdAt: dayjs.utc().toISOString(),
        updatedAt: dayjs.utc().toISOString(),
        isUserRegistrationRequired: false,
      },
    };

    const mocksWithEmptyFields = [
      {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        result: { data: mockWithEmptyFields },
      },
      {
        request: {
          query: UPDATE_ORGANIZATION_MUTATION,
          variables: {
            input: {
              id: '1',
              name: 'Test Org',
              description: 'Test Description',
              addressLine1: '123 Test St',
              state: 'Test State',
              countryCode: 'US',
              isUserRegistrationRequired: false,
              isVisibleInSearch: false,
            },
          },
        },
        result: {
          data: {
            updateOrganization: {
              organization: {
                __typename: 'Organization',
                id: '1',
              },
            },
          },
        },
      },
      {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        result: { data: mockWithEmptyFields },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithEmptyFields}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const saveButton = screen.getByTestId('save-org-changes-btn');
    await user.click(saveButton);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        i18n.t('orgUpdate.successfulUpdated'),
      );
    });
  });

  it('handles empty file selection (user cancels file picker)', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const fileInput = screen.getByTestId(
      'organisationImage',
    ) as HTMLInputElement;

    await user.upload(fileInput, []);

    expect(fileInput.files).toHaveLength(0);

    const saveButton = screen.getByTestId('save-org-changes-btn');
    expect(saveButton).toBeEnabled();
  });

  it('handles organization with null isUserRegistrationRequired value', async () => {
    const mockOrgWithNull = {
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
        isUserRegistrationRequired: null,
      },
    };

    const mocksWithNull = [
      {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        result: { data: mockOrgWithNull },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithNull}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const userRegSwitch = screen.getByTestId('user-reg-switch');
    expect(userRegSwitch).toBeChecked();
  });

  it('shows error toast when uploaded file is not an image', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const fileInput = screen.getByTestId(
      'organisationImage',
    ) as HTMLInputElement;

    // userEvent respects the `accept` attribute; remove it to test JS validation
    fileInput.removeAttribute('accept');

    const invalidFile = new File(['hello'], 'test.txt', {
      type: 'text/plain',
    });

    await user.upload(fileInput, invalidFile);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        i18n.t('orgUpdate.invalidImageType'),
      );
    });
  });

  it('shows error toast when uploaded image exceeds 5MB', async () => {
    const user = userEvent.setup();

    const largeImage = new File(
      [new Uint8Array(6 * 1024 * 1024)],
      'large.png',
      { type: 'image/png' },
    );

    render(
      <MockedProvider mocks={mocks}>
        <I18nextProvider i18n={i18n}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const fileInput = screen.getByTestId(
      'organisationImage',
    ) as HTMLInputElement;

    await user.upload(fileInput, largeImage);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        i18n.t('orgUpdate.imageSizeTooLarge'),
      );
    });
  });
});
