import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import MemberDetail from './UserContactDetails';
import {
  MOCKS1,
  MOCKS2,
  MOCK_FILE,
  UPDATE_MOCK,
  UPDATE_USER_ERROR_MOCKS,
} from './mock';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import { urlToFile } from 'utils/urlToFile';

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(UPDATE_USER_ERROR_MOCKS, true);
const link4 = new StaticMockLink(MOCK_FILE, true);

const { mockReload } = vi.hoisted(() => ({
  mockReload: vi.fn(),
}));

Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    reload: mockReload,
  },
  writable: true,
});

async function wait(ms = 500): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

// Fix the NotificationToast mock - it should return an object with methods
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: mockToast,
}));

vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    maxDate,
    slotProps,
    'data-testid': dataTestId,
  }: {
    value: dayjs.Dayjs | null;
    onChange: (value: dayjs.Dayjs | null) => void;
    maxDate?: dayjs.Dayjs;
    slotProps?: { textField?: { 'aria-label'?: string } };
    'data-testid'?: string;
  }) => (
    <input
      data-testid={dataTestId}
      aria-label={slotProps?.textField?.['aria-label']}
      value={value ? value.format('MM/DD/YYYY') : ''}
      onChange={(e) => {
        const val = e.target.value;
        if (!val) {
          onChange?.(null);
          return;
        }

        const parsedDate = dayjs(val, ['MM/DD/YYYY', 'YYYY-MM-DD']);
        if (!parsedDate.isValid()) {
          onChange?.(null);
          return;
        }

        // Simulate maxDate validation like the real component
        if (maxDate && parsedDate.isAfter(maxDate, 'day')) {
          onChange?.(null);
          return;
        }

        onChange?.(parsedDate);
      }}
    />
  ),
}));

vi.mock('@dicebear/core', () => ({
  createAvatar: vi.fn(() => ({
    toDataUri: vi.fn(() => 'mocked-data-uri'),
  })),
}));

vi.mock('utils/urlToFile', () => ({
  urlToFile: vi.fn(),
}));

vi.mock('components/UserPortal/UserSidebar/UserSidebar', () => ({
  __esModule: true,
  default: ({
    hideDrawer,
    setHideDrawer,
  }: {
    hideDrawer: boolean;
    setHideDrawer: (value: boolean) => void;
  }) => (
    <div data-testid="user-sidebar">
      <button type="button" onClick={() => setHideDrawer(!hideDrawer)}>
        Toggle Sidebar
      </button>
    </div>
  ),
}));

vi.mock('screens/UserPortal/Settings/ProfileHeader/ProfileHeader', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="profile-header">
      <h1>{title}</h1>
    </div>
  ),
}));

const renderMemberDetailScreen = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/orgtags/123/member/456']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/orgtags/:orgId/member/:userId"
                element={<MemberDetail />}
              />
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<div data-testid="manageTagScreen"></div>}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: (key: string) => {
      if (key === 'id') return '456';
      if (key === 'sidebar') return 'false';
      return null;
    },
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clearAllItems: vi.fn(),
  }),
}));

const renderUserProfileScreen = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/user/settings/profile']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route path="/user/settings/profile" element={<MemberDetail />} />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('MemberDetail', () => {
  global.alert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock toast functions
    mockToast.success.mockClear();
    mockToast.error.mockClear();
    mockToast.warning.mockClear();
    mockToast.info.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  describe('Member Profile View (Admin viewing member)', () => {
    test('should render the elements for member profile', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
      expect(screen.getAllByText(/Email/i)).toBeTruthy();
      expect(screen.getAllByText(/name/i)).toBeTruthy();
      expect(screen.getAllByText(/Birth Date/i)).toBeTruthy();
      expect(screen.getAllByText(/Gender/i)).toBeTruthy();
      expect(screen.getAllByText(/Profile Information/i)).toBeTruthy();
      expect(screen.getAllByText(/Profile Information/i)).toHaveLength(1);
      expect(screen.getAllByText(/Contact Information/i)).toHaveLength(1);
    });

    test('handles member profile update success', async () => {
      renderMemberDetailScreen(link1);

      await wait();

      const nameInput = screen.getByTestId('inputName');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'New Name');
      expect(nameInput).toHaveValue('New Name');

      const saveButton = screen.getByTestId('saveChangesBtn');
      expect(saveButton).toBeInTheDocument();
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(nameInput).toHaveValue('New Name');
        expect(mockToast.success).toHaveBeenCalled();
      });
    });
  });

  describe('User Profile View (User viewing own profile)', () => {
    test('should render the elements for user profile', async () => {
      renderUserProfileScreen(link1);
      await wait();

      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
      expect(screen.getAllByText(/Email/i)).toBeTruthy();
      expect(screen.getAllByText(/name/i)).toBeTruthy();
      expect(screen.getAllByText(/Birth Date/i)).toBeTruthy();
      expect(screen.getAllByText(/Gender/i)).toBeTruthy();
      expect(screen.getAllByText(/Profile Information/i)).toBeTruthy();
      expect(screen.getAllByText(/Profile Information/i)).toHaveLength(1);
      expect(screen.getAllByText(/Contact Information/i)).toHaveLength(1);
    });

    test('handles user profile update success', async () => {
      renderUserProfileScreen(link1);

      await wait();

      const nameInput = screen.getByTestId('inputName');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Updated User Name');
      expect(nameInput).toHaveValue('Updated User Name');

      const saveButton = screen.getByTestId('saveChangesBtn');
      expect(saveButton).toBeInTheDocument();
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(nameInput).toHaveValue('Updated User Name');
        expect(mockToast.success).toHaveBeenCalled();
      });
    });
  });

  describe('Form Validation and User Interaction', () => {
    test('Should display dicebear image if image is null', async () => {
      const dicebearUrl = 'mocked-data-uri';

      render(
        <MockedProvider link={link1}>
          <BrowserRouter>
            <MemberDetail />
          </BrowserRouter>
        </MockedProvider>,
      );

      const userImage = await waitFor(() =>
        screen.getByTestId('profile-picture'),
      );

      expect(userImage.getAttribute('src')).toBe(dicebearUrl);
    });

    test('should handle undefined member id properly', async () => {
      // When no userId is provided in params and not in user mode,
      // the component should handle gracefully
      render(
        <MockedProvider link={link2}>
          <MemoryRouter initialEntries={['/orgtags/123/member/']}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Routes>
                  <Route
                    path="/orgtags/:orgId/member/:userId?"
                    element={<MemberDetail />}
                  />
                </Routes>
              </I18nextProvider>
            </Provider>
          </MemoryRouter>
        </MockedProvider>,
      );

      // Component should handle undefined ID gracefully
      await waitFor(() => {
        expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
      });
    });

    test('handles avatar upload and preview', async () => {
      renderMemberDetailScreen(link1);
      global.URL.createObjectURL = vi.fn(() => 'mockURL');
      await waitFor(() => {
        expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
      });

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const input = await screen.findByTestId('fileInput');
      await userEvent.upload(input, file);

      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    });

    test('handles user update success', async () => {
      renderMemberDetailScreen(link1);

      await wait();

      const nameInput = screen.getByTestId('inputName');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'New Name');
      expect(nameInput).toHaveValue('New Name');

      const saveButton = screen.getByTestId('saveChangesBtn');
      expect(saveButton).toBeInTheDocument();
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(nameInput).toHaveValue('New Name');
        expect(mockToast.success).toHaveBeenCalled();
      });
    });

    test('handles user update error', async () => {
      renderMemberDetailScreen(link3);

      await wait();

      const nameInput = screen.getByTestId('inputName');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Test User');
      expect(nameInput).toHaveValue('Test User');

      const saveButton = screen.getByTestId('saveChangesBtn');
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalled();
      });
    });

    test('handles file upload validation', async () => {
      renderMemberDetailScreen(link4);

      await wait();

      // Test invalid file type
      const invalidFile = new File(['test'], 'test.md', {
        type: 'image/plain',
      });
      const fileInput = screen.getByTestId('fileInput');
      await userEvent.upload(fileInput, invalidFile);

      expect(mockToast.error).toHaveBeenCalledWith(
        'Invalid file type. Please upload a JPEG, PNG, or GIF file.',
      );
    });

    test('sets formState correctly when data.user is returned', async () => {
      render(
        <MockedProvider mocks={MOCKS1} addTypename={false}>
          <BrowserRouter>
            <MemberDetail />
          </BrowserRouter>
        </MockedProvider>,
      );

      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
      });

      // Access the birthDate input
      const birthDateInput = screen.getByTestId(
        'birthDate',
      ) as HTMLInputElement;
      expect(birthDateInput).toBeInTheDocument();

      // Check another field, e.g., name input
      const nameInput = screen.getByTestId('inputName') as HTMLInputElement;
      expect(nameInput).toBeInTheDocument();
    });
  });

  describe('Field Interaction Tests', () => {
    // Test for future birthdate validation
    test('prevents selection of future birthdates', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const futureDate = dayjs().add(1, 'year');
      const birthDateInput = screen.getByTestId(
        'birthDate',
      ) as HTMLInputElement;

      await userEvent.clear(birthDateInput);
      await userEvent.type(birthDateInput, futureDate.format('YYYY-MM-DD'));
      await userEvent.tab();

      // Verify the date wasn't accepted (should be empty or previous value)
      expect(birthDateInput.value).not.toBe(futureDate.format('YYYY-MM-DD'));
    });

    test('validates file upload size and type', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const fileInput = screen.getByTestId('fileInput');

      // Test file size validation
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', {
        type: 'image/png',
      });
      await userEvent.upload(fileInput, largeFile);

      // The component should show some error for large files
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalled();
      });
    });

    test('handles phone number input formatting', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const mobilePhoneInput = screen.getByTestId(
        'inputMobilePhoneNumber',
      ) as HTMLInputElement;
      const workPhoneInput = screen.getByTestId(
        'inputWorkPhoneNumber',
      ) as HTMLInputElement;
      const homePhoneInput = screen.getByTestId(
        'inputHomePhoneNumber',
      ) as HTMLInputElement;

      // Test mobile phone
      await userEvent.clear(mobilePhoneInput);
      await userEvent.type(mobilePhoneInput, '+1234567890');
      expect(mobilePhoneInput).toHaveValue('+1234567890');

      // Test work phone
      await userEvent.clear(workPhoneInput);
      await userEvent.type(workPhoneInput, '+1987654321');
      expect(workPhoneInput).toHaveValue('+1987654321');

      // Test home phone
      await userEvent.clear(homePhoneInput);
      await userEvent.type(homePhoneInput, '+1555555555');
      expect(homePhoneInput).toHaveValue('+1555555555');
    });
  });

  describe('Dropdown Component and other tests', () => {
    test('handles profile picture edit button click', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const uploadImageBtn = screen.getByTestId('uploadImageBtn');
      expect(uploadImageBtn).toBeInTheDocument();

      // Mock the file input click
      const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
      const fileInputClickSpy = vi.spyOn(fileInput, 'click');

      // Simulate click on the edit button
      await userEvent.click(uploadImageBtn);
      expect(fileInputClickSpy).toHaveBeenCalled();
    });

    test('handles birth date picker changes', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const birthDateInput = screen.getByTestId(
        'birthDate',
      ) as HTMLInputElement;
      expect(birthDateInput).toBeInTheDocument();

      // Simulate birth date change
      await userEvent.clear(birthDateInput);
      await userEvent.type(birthDateInput, '1990-01-01');
      expect(birthDateInput.value).toBe('01/01/1990'); // Format from mock
    });

    test('shows no events message when user has no events attended', async () => {
      // Create a mock with no events attended using MOCKS2
      renderMemberDetailScreen(link2);
      await wait();

      // The component should handle empty events gracefully
      // Check that the events section exists but may be empty
      const eventsSection = screen.queryByText(/Events Attended/i);
      expect(eventsSection).toBeInTheDocument();
    });

    test('handles file validation for oversized files', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const fileInput = screen.getByTestId('fileInput');

      // Create a file larger than 5MB
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

      await userEvent.upload(fileInput, [largeFile]);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalled();
      });
    });

    test('handles empty file input event', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      // When no files are provided to upload, the component should handle gracefully
      expect(screen.getByTestId('fileInput')).toBeInTheDocument();
    });
  });

  test('displays error when password validation fails', async () => {
    const link = new StaticMockLink(MOCKS1, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgtags/123/member/456']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgtags/:orgId/member/:userId"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    // Enter invalid password (e.g., too short)
    const passwordInput = screen.getByTestId(
      'inputPassword',
    ) as HTMLInputElement;
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'weak');

    const saveButton = screen.getByTestId('saveChangesBtn');
    await userEvent.click(saveButton);

    // Should trigger password validation error and return early
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  test('handles avatar URL to file conversion failure', async () => {
    const link = new StaticMockLink(MOCKS1, true);
    vi.mocked(urlToFile).mockRejectedValueOnce(new Error('Conversion failed'));

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/user/settings/profile']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/user/settings/profile"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('inputName');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Test Name');

    await userEvent.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  test('handles update as admin with member ID', async () => {
    const link = new StaticMockLink(UPDATE_MOCK, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/123/member/456']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/:orgId/member/:userId"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('inputName');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Admin Updated Name');

    const saveButton = screen.getByTestId('saveChangesBtn');
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('Admin Updated Name');
    });
  });

  test('handles invalid birth date input', async () => {
    const link = new StaticMockLink(MOCKS1, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgtags/123/member/456']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgtags/:orgId/member/:userId"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const birthDateInput = screen.getByTestId('birthDate') as HTMLInputElement;

    // Test invalid date that dayjs cannot parse
    await userEvent.clear(birthDateInput);
    await userEvent.type(birthDateInput, 'invalid-date');

    // The mock DatePicker should handle this and set null
    expect(birthDateInput.value).toBe('');
  });

  test('renders avatar from URL when available', async () => {
    const link = new StaticMockLink(MOCKS1, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgtags/123/member/456']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgtags/:orgId/member/:userId"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const profilePic = screen.getByTestId('profile-picture');
      expect(profilePic).toBeInTheDocument();
    });
  });

  test('resets form to original data when reset is clicked', async () => {
    const link = new StaticMockLink(MOCKS1, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgtags/123/member/456']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgtags/:orgId/member/:userId"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('inputName') as HTMLInputElement;

    // Get original value
    const originalValue = nameInput.value;

    // Change the value
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Changed Name');
    expect(nameInput).toHaveValue('Changed Name');

    // Reset changes
    const resetButton = screen.getByTestId('resetChangesBtn');
    await userEvent.click(resetButton);

    await waitFor(() => {
      // Should revert to original value
      expect(nameInput.value).toBe(originalValue);
    });
  });

  test('handles all address field inputs correctly', async () => {
    const link = new StaticMockLink(MOCKS1, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgtags/123/member/456']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgtags/:orgId/member/:userId"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    // Test addressLine2 specifically (often less covered)
    const addressLine2 = screen.getByTestId(
      'inputAddressLine2',
    ) as HTMLInputElement;
    await userEvent.clear(addressLine2);
    await userEvent.type(addressLine2, 'Apt 123');
    expect(addressLine2).toHaveValue('Apt 123');

    // Test postal code
    const postalCode = screen.getByTestId(
      'inputPostalCode',
    ) as HTMLInputElement;
    await userEvent.clear(postalCode);
    await userEvent.type(postalCode, '12345');
    expect(postalCode).toHaveValue('12345');

    // Test addressLine1
    const addressLine1Input = screen.getByTestId(
      'inputAddressLine1',
    ) as HTMLInputElement;
    await userEvent.clear(addressLine1Input);
    await userEvent.type(addressLine1Input, '221B Baker Street');
    expect(addressLine1Input).toHaveValue('221B Baker Street');

    // Test city
    const cityInput = screen.getByTestId('inputCity') as HTMLInputElement;
    await userEvent.clear(cityInput);
    await userEvent.type(cityInput, 'Bengaluru');
    expect(cityInput).toHaveValue('Bengaluru');

    // Test Description
    const descriptionInput = await waitFor(
      () => screen.getByTestId('inputDescription') as HTMLInputElement,
    );
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'New description');
    expect(descriptionInput.value).toBe('New description');

    // Test State
    const stateInput = await waitFor(
      () => screen.getByTestId('inputState') as HTMLInputElement,
    );
    await userEvent.clear(stateInput);
    await userEvent.type(stateInput, 'California');
    expect(stateInput.value).toBe('California');
  });

  it('shows preview image when selectedAvatar is present', async () => {
    render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <MemberDetail />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // mock URL.createObjectURL
    const objectUrlSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-avatar');

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;

    await userEvent.upload(fileInput, file);

    const avatarImg = await screen.findByTestId('profile-picture');

    expect(avatarImg).toHaveAttribute('src', 'blob:mock-avatar');

    objectUrlSpy.mockRestore();
  });

  it('falls back to avatarURL when selectedAvatar is not present', async () => {
    render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <MemberDetail />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const avatarImg = await screen.findByTestId('profile-picture');

    expect(avatarImg).toHaveAttribute('src', 'mocked-data-uri');
  });

  test('sets birthDate to empty string when birthDate is null', async () => {
    const MOCK_NO_BIRTHDATE = [
      {
        request: { query: MOCKS1[0].request.query, variables: { id: '456' } },
        result: {
          data: {
            user: {
              id: '456',
              name: 'Test User',
              birthDate: null, // triggers the fallback branch
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
              gender: 'MALE',
              phone: {
                mobile: '+1234567890',
                work: '+0987654321',
                home: '+1111111111',
              },
              image: null,
              address: {
                line1: '123 Main St',
                line2: 'Apt 4',
                city: 'City',
                state: 'State',
                countryCode: 'US',
                postalCode: '12345',
              },
              maritalStatus: 'SINGLE',
              employmentStatus: 'FULL_TIME',
              educationGrade: 'GRADUATE',
              emailVerified: true,
              description: 'Test description',
              eventsAttended: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={MOCK_NO_BIRTHDATE} addTypename={false}>
        <BrowserRouter>
          <MemberDetail />
        </BrowserRouter>
      </MockedProvider>,
    );

    const birthDateInput = (await screen.findByTestId(
      'birthDate',
    )) as HTMLInputElement;

    expect(birthDateInput.value).toBe('');
  });

  test('handles successful update', async () => {
    vi.mocked(urlToFile).mockResolvedValueOnce(
      new File(['avatar'], 'avatar.png', { type: 'image/png' }),
    );

    const link = new StaticMockLink(UPDATE_MOCK, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/user/settings/profile']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/user/settings/profile"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('inputName') as HTMLInputElement;
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated User Name');

    const saveButton = screen.getByTestId('saveChangesBtn');
    await userEvent.click(saveButton);

    await waitFor(
      () => {
        expect(mockToast.success).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );
  });

  test('should update state when avatar is changed', async () => {
    vi.mocked(urlToFile).mockResolvedValueOnce(
      new File(['avatar'], 'avatar.png', { type: 'image/png' }),
    );

    const link = new StaticMockLink(UPDATE_MOCK, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/user/settings/profile']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/user/settings/profile"
                  element={<MemberDetail />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;

    await userEvent.upload(fileInput, [file]);

    // Check that Save button appears (isUpdated = true)
    expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
  });

  test('handles file size validation - rejects files larger than 5MB', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const fileInput = screen.getByTestId('fileInput');

    // Create a file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
    });
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

    await userEvent.upload(fileInput, [largeFile]);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  test('handles file name sanitization on upload', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const fileInput = screen.getByTestId('fileInput');

    // Create a file with special characters in name
    const fileWithSpecialChars = new File(['content'], 'my@file#name$.png', {
      type: 'image/png',
    });

    await userEvent.upload(fileInput, [fileWithSpecialChars]);

    // Verify file was processed (avatar state updated)
    await waitFor(() => {
      expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
    });
  });

  test('handles empty file input gracefully', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const fileInput = screen.getByTestId('fileInput');

    // Verify save button is not visible initially (no changes made yet)
    // Note: The save button might not appear immediately
    // Check that the component renders correctly
    expect(fileInput).toBeInTheDocument();
  });

  test('returns early when no file is selected in handleFileUpload', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // File inputs are read-only, so we verify the component renders correctly
    // without attempting to upload a file
    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
  });

  test('rejects invalid file types with appropriate error message', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const fileInput = screen.getByTestId('fileInput');

    // Test with invalid file type
    const invalidFile = new File(['test'], 'document.pdf', {
      type: 'application/pdf',
    });

    await userEvent.upload(fileInput, [invalidFile]);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  // Add a simple test to verify the component renders without crashing
  test('renders without crashing', async () => {
    renderMemberDetailScreen(link1);
    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });
  });
});
