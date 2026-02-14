import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import i18nForTest from 'utils/i18nForTest';

import OrgUpdate from './OrgUpdate';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  mockOrgData,
  mockOrgDataWithEmptyFields,
  mockOrgDataWithNullUserReg,
  mockUpdateOrgResponse,
  FIXED_UTC_TIMESTAMP,
  MOCKS,
  MOCKS_QUERY_ERROR,
  MOCKS_QUERY_ERROR_FETCH,
  MOCKS_UPDATE_ERROR,
} from './OrgUpdateMocks';

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe('OrgUpdate Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.useRealTimers(); // Safety net for fake timer tests (e.g. unmount cleanup test)
  });

  it('loads and displays organization data', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
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
      <MockedProvider mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
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
      <MockedProvider mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
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
        i18nForTest.t('orgUpdate.successfulUpdated'),
      );
    });
  });

  it('displays error when form submission fails', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={MOCKS_UPDATE_ERROR}>
        <I18nextProvider i18n={i18nForTest}>
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
      <MockedProvider mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
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
    it('shows loading state while fetching data', async () => {
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
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      await screen.findByDisplayValue('Test Org');

      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('shows error state when data fetch fails', async () => {
      render(
        <MockedProvider mocks={MOCKS_QUERY_ERROR}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      const errorTitleText = i18nForTest.t(
        'orgUpdate.errorLoadingOrganizationData',
      );
      const errorTitle = await screen.findByText(
        (content, el) =>
          el?.tagName === 'H6' && content.includes(errorTitleText),
      );
      const errorMessage = await screen.findByText(
        /Failed to load organization/i,
      );

      expect(errorTitle).toHaveTextContent(errorTitleText);
      expect(errorMessage).toBeInTheDocument();
    });

    it('handles successful organization update', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={MOCKS}>
          <I18nextProvider i18n={i18nForTest}>
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
          i18nForTest.t('orgUpdate.successfulUpdated'),
        );
      });
    });

    it('shows error toast when name or description is missing', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={MOCKS}>
          <I18nextProvider i18n={i18nForTest}>
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
          i18nForTest.t('orgUpdate.nameDescriptionRequired'),
        );
      });

      const descriptionInput =
        await screen.findByDisplayValue('Test Description');
      await user.type(nameInput, 'Test Org');
      await user.clear(descriptionInput);
      await user.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          i18nForTest.t('orgUpdate.nameDescriptionRequired'),
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
          <I18nextProvider i18n={i18nForTest}>
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
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('toggles user registration switches correctly', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={MOCKS}>
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      await screen.findByDisplayValue('Test Org');
      const userRegSwitch = screen.getByTestId('user-reg-switch');

      expect(userRegSwitch).toBeChecked();
      await user.click(userRegSwitch);
      expect(userRegSwitch).not.toBeChecked();

      await user.click(userRegSwitch);
      expect(userRegSwitch).toBeChecked();
    });
  });

  describe('OrgUpdate Empty Response Handling', () => {
    const emptyResponseMocks = [
      MOCKS[0],
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
        result: { data: null },
      },
    ];

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('handles empty response from update mutation', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={emptyResponseMocks} addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
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
          i18nForTest.t('orgUpdate.updateFailed'),
        );
      });

      expect(saveButton).toBeEnabled();
      expect(saveButton).toHaveTextContent('Save Changes');
    });
  });

  it('updates address line1 when input changes', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
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
    render(
      <MockedProvider mocks={MOCKS_QUERY_ERROR_FETCH}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    const errorHeading = await screen.findByRole('heading', { level: 6 });
    expect(errorHeading).toHaveTextContent(
      i18nForTest.t('orgUpdate.errorLoadingOrganizationData'),
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
          result: { data: mockOrgData },
          delay: 100,
        },
      ];

      render(
        <MockedProvider mocks={loadingMocks}>
          <I18nextProvider i18n={i18nForTest}>
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
          <I18nextProvider i18n={i18nForTest}>
            <OrgUpdate orgId="1" />
          </I18nextProvider>
        </MockedProvider>,
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      const saveButton = await screen.findByTestId('save-org-changes-btn');
      expect(saveButton).toBeEnabled();
    });
  });

  it('filters out empty address fields from mutation payload', async () => {
    const user = userEvent.setup();

    const mocksWithEmptyFields = [
      {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        result: { data: mockOrgDataWithEmptyFields },
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
            },
          },
        },
        result: {
          data: {
            updateOrganization: { ...mockUpdateOrgResponse },
          },
        },
      },
      {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        result: { data: mockOrgDataWithEmptyFields },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithEmptyFields}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const saveButton = screen.getByTestId('save-org-changes-btn');
    await user.click(saveButton);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        i18nForTest.t('orgUpdate.successfulUpdated'),
      );
    });
  });

  it('handles empty file selection (user cancels file picker)', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
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
    const mocksWithNull = [
      {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        result: { data: mockOrgDataWithNullUserReg },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithNull}>
        <I18nextProvider i18n={i18nForTest}>
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
      <MockedProvider mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
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
        i18nForTest.t('orgUpdate.invalidImageType'),
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
      <MockedProvider mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
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
        i18nForTest.t('orgUpdate.imageSizeTooLarge'),
      );
    });
  });

  it('cleans up effect on unmount before data loads', async () => {
    vi.useFakeTimers();
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const delayedMock = [
      {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: '1' },
        },
        result: { data: mockOrgData },
        delay: 500,
      },
    ];

    const { unmount } = render(
      <MockedProvider mocks={delayedMock}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    unmount();

    expect(
      screen.queryByTestId('save-org-changes-btn'),
    ).not.toBeInTheDocument();

    vi.advanceTimersByTime(500);
    await vi.runAllTimersAsync();

    const stateUpdateWarning = consoleErrorSpy.mock.calls.find(
      (call) =>
        typeof call[0] === 'string' &&
        /state update on an unmounted component|Can't perform a React state update on an unmounted component/i.test(
          call[0],
        ),
    );
    expect(stateUpdateWarning).toBeUndefined();

    vi.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  it('file input onChange with no file selected does not update state', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const fileInput = screen.getByTestId('organisationImage');
    await user.upload(fileInput, []);

    await waitFor(() => {
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });

  it('clears file input value after successful save with avatar', async () => {
    const user = userEvent.setup();
    const file = new File(['x'], 'image.png', { type: 'image/png' });

    const mocksWithAvatar = [
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
            },
          },
        },
        result: {
          data: {
            updateOrganization: { ...mockUpdateOrgResponse },
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
      <MockedProvider mocks={mocksWithAvatar}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgUpdate orgId="1" />
        </I18nextProvider>
      </MockedProvider>,
    );

    await screen.findByDisplayValue('Test Org');

    const fileInput = screen.getByTestId(
      'organisationImage',
    ) as HTMLInputElement;
    await user.upload(fileInput, file);

    const saveButton = screen.getByTestId('save-org-changes-btn');
    await user.click(saveButton);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        i18nForTest.t('orgUpdate.successfulUpdated'),
      );
      expect(fileInput.value).toBe('');
    });
  });
});
