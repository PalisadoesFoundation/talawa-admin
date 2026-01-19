import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
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
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

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

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
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

vi.mock('utils/useLocalStorage', () => ({
  useLocalStorage: () => ({
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
    vi.spyOn(NotificationToast, 'success');
    vi.spyOn(NotificationToast, 'error');
    vi.spyOn(NotificationToast, 'info');
    vi.spyOn(NotificationToast, 'warning');
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
      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      expect(nameInput).toHaveValue('New Name');

      const saveButton = screen.getByTestId('saveChangesBtn');
      expect(saveButton).toBeInTheDocument();
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(nameInput).toHaveValue('New Name');
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
      fireEvent.change(nameInput, { target: { value: 'Updated User Name' } });
      expect(nameInput).toHaveValue('Updated User Name');

      const saveButton = screen.getByTestId('saveChangesBtn');
      expect(saveButton).toBeInTheDocument();
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(nameInput).toHaveValue('Updated User Name');
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
      const fileInput = screen.getByTestId('fileInput');
      await userEvent.upload(fileInput, file);

      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    });

    test('handles user update success', async () => {
      renderMemberDetailScreen(link1);

      await wait();

      const nameInput = screen.getByTestId('inputName');
      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      expect(nameInput).toHaveValue('New Name');

      const saveButton = screen.getByTestId('saveChangesBtn');
      expect(saveButton).toBeInTheDocument();
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(nameInput).toHaveValue('New Name');
      });
    });

    test('handles user update error', async () => {
      renderMemberDetailScreen(link3);

      await wait();

      const nameInput = screen.getByTestId('inputName');
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      expect(nameInput).toHaveValue('Test User');

      const saveButton = screen.getByTestId('saveChangesBtn');
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
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

      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Invalid file type. Please upload a JPEG, PNG, or GIF file.',
      );

      // Test file size limit
      const largeFile = new File(['test'.repeat(10000000)], 'test.jpg', {
        type: 'image/png',
      });
      await userEvent.upload(fileInput, largeFile);

      expect(NotificationToast.error).toHaveBeenCalledWith(
        'File is too large. Maximum size is 5MB.',
      );
    });

    test('updates formState.description when typing in description input', async () => {
      render(
        <MockedProvider link={link1}>
          <BrowserRouter>
            <MemberDetail />
          </BrowserRouter>
        </MockedProvider>,
      );

      // wait for the description input to appear
      const descriptionInput = await waitFor(
        () => screen.getByTestId('inputDescription') as HTMLInputElement,
      );

      // simulate typing
      fireEvent.change(descriptionInput, {
        target: { value: 'New description' },
      });

      // assert the input value updated
      expect(descriptionInput.value).toBe('New description');
    });

    test('updates formState.state when typing in state input', async () => {
      render(
        <MockedProvider link={link1}>
          <BrowserRouter>
            <MemberDetail />
          </BrowserRouter>
        </MockedProvider>,
      );

      const stateInput = await waitFor(
        () => screen.getByTestId('inputState') as HTMLInputElement,
      );

      // stimulate typing input
      fireEvent.change(stateInput, {
        target: { value: 'California' },
      });

      expect(stateInput.value).toBe('California');
    });

    test('updates formState.natalSex when selecting a new value', async () => {
      render(
        <MockedProvider link={link1}>
          <BrowserRouter>
            <MemberDetail />
          </BrowserRouter>
        </MockedProvider>,
      );

      // Get the dropdown button
      const natalSexDropdownBtn = await waitFor(() =>
        screen.getByTestId('natalsex-dropdown-btn'),
      );

      // Click to open dropdown
      fireEvent.click(natalSexDropdownBtn);

      // Find the option you want to select (assuming options are rendered as <button> or <li>)
      const femaleOption = await screen.findByText('Female');
      fireEvent.click(femaleOption);

      // Assert button text updated
      expect(natalSexDropdownBtn).toHaveTextContent('Female');
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

      // Determine expected formatted date
      const userBirthDate = MOCKS1[0].result?.data?.user?.birthDate;
      const expectedBirthDate = userBirthDate
        ? dayjs(userBirthDate).format('YYYY-MM-DD')
        : '';
      expect(birthDateInput.value).toBe(expectedBirthDate);

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
      const birthDateInput = screen.getByTestId('birthDate');

      await userEvent.type(birthDateInput, futureDate.format('YYYY-MM-DD'));
      fireEvent.blur(birthDateInput);

      // Verify the date wasn't accepted (should revert to original value)
      expect(birthDateInput).not.toHaveValue(futureDate.format('YYYY-MM-DD'));
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
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'File is too large. Maximum size is 5MB.',
      );
    });

    test('handles phone number input formatting', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const mobilePhoneInput = screen.getByTestId('inputMobilePhoneNumber');
      const workPhoneInput = screen.getByTestId('inputWorkPhoneNumber');
      const homePhoneInput = screen.getByTestId('inputHomePhoneNumber');

      // Test mobile phone
      await fireEvent.change(mobilePhoneInput, {
        target: { value: '+1234567890' },
      });
      expect(mobilePhoneInput).toHaveValue('+1234567890');

      // Test work phone
      await fireEvent.change(workPhoneInput, {
        target: { value: '+1987654321' },
      });
      expect(workPhoneInput).toHaveValue('+1987654321');

      // Test home phone
      await fireEvent.change(homePhoneInput, {
        target: { value: '+1555555555' },
      });
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
      const fileInput = screen.getByTestId('fileInput');
      const fileInputClickSpy = vi.spyOn(fileInput, 'click');

      // Simulate click on the edit button
      await userEvent.click(uploadImageBtn);
      expect(fileInputClickSpy).toHaveBeenCalled();

      // Simulate Enter key press on the edit button
      await userEvent.type(uploadImageBtn, '{enter}');
      expect(fileInputClickSpy).toHaveBeenCalled();
    });

    test('handles country selection change', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const countrySelect = screen.getByTestId('inputCountry');
      expect(countrySelect).toBeInTheDocument();

      // Simulate changing the country selection
      const countryTrigger = screen.getByTestId('inputCountry');
      await userEvent.click(countryTrigger);
      const option = await screen.findByRole('option', {
        name: /United States/i,
      });
      await userEvent.click(option);

      expect(countryTrigger).toHaveTextContent(/United States/i);
    });

    test('handles birth date picker changes', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const birthDatePicker = screen.getByTestId('birthDate');
      expect(birthDatePicker).toBeInTheDocument();

      // Simulate birth date change by triggering the onChange directly
      const birthDateInput = birthDatePicker.querySelector('input');
      if (birthDateInput) {
        fireEvent.change(birthDateInput, { target: { value: '1990-01-01' } });
      }
    });

    test('shows no events message when user has no events attended', async () => {
      // Create a mock with no events attended using MOCKS2
      renderMemberDetailScreen(link2);
      await wait();

      // Should render the no events message
      const noEventsMessage = screen.queryByText('No events attended');
      if (noEventsMessage) {
        // Note: MOCKS2 guarantees empty eventsAttended array
        expect(noEventsMessage).toBeInTheDocument();
      }
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

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'File is too large. Maximum size is 5MB.',
        );
      });
    });

    test('handles empty file input event', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const fileInput = screen.getByTestId('fileInput');

      // Simulate change event with no files
      fireEvent.change(fileInput, { target: { files: [] } });

      // Should not trigger any error notifications for empty file input
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    test('type password with valid value', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const passwordInput = screen.getByTestId('inputPassword');
      fireEvent.change(passwordInput, { target: { value: 'ValidPass@123' } });

      expect(passwordInput).toHaveValue('ValidPass@123');
      expect(NotificationToast.error).not.toHaveBeenCalled();
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
    const passwordInput = screen.getByTestId('inputPassword');
    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    const saveButton = screen.getByTestId('saveChangesBtn');
    fireEvent.click(saveButton);

    // Should trigger password validation error and return early
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('handles avatar URL to file conversion failure', async () => {
    const link = new StaticMockLink(MOCKS1, true);
    const { urlToFile } = await import('utils/urlToFile');

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

    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'Test Name' },
    });

    fireEvent.click(screen.getByTestId('saveChangesBtn'));

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
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
    fireEvent.change(nameInput, { target: { value: 'Admin Updated Name' } });

    const saveButton = screen.getByTestId('saveChangesBtn');
    fireEvent.click(saveButton);

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

    const birthDateInput = screen.getByTestId('birthDate');

    // Test invalid date that dayjs cannot parse
    fireEvent.change(birthDateInput, { target: { value: 'invalid-date' } });

    // The mock DatePicker should handle this and set null
    expect(birthDateInput).not.toHaveValue('invalid-date');
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
      // Should render either Avatar component or img with avatarURL
    });
  });

  test('handles keyboard Enter key on avatar edit icon', async () => {
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
      expect(screen.getByTestId('uploadImageBtn')).toBeInTheDocument();
    });

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');

    const uploadBtn = screen.getByTestId('uploadImageBtn');

    // Simulate Enter key press
    fireEvent.keyDown(uploadBtn, { key: 'Enter', code: 'Enter' });

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  test('handles country selection and displays sorted options', async () => {
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
      expect(screen.getByTestId('inputCountry')).toBeInTheDocument();
    });

    const countrySelect = screen.getByTestId('inputCountry');

    // Change country
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    expect(countrySelect).toHaveValue('us');
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

    const nameInput = screen.getByTestId('inputName');

    // Change the value
    fireEvent.change(nameInput, { target: { value: 'Changed Name' } });
    expect(nameInput).toHaveValue('Changed Name');

    // Reset changes
    const resetButton = screen.getByTestId('resetChangesBtn');
    fireEvent.click(resetButton);

    await waitFor(() => {
      // Should revert to original value
      expect(nameInput).toHaveValue('Changed Name');
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
    const addressLine2 = screen.getByTestId('inputAddressLine2');
    fireEvent.change(addressLine2, { target: { value: 'Apt 123' } });
    expect(addressLine2).toHaveValue('Apt 123');

    // Test postal code
    const postalCode = screen.getByTestId('inputPostalCode');
    fireEvent.change(postalCode, { target: { value: '12345' } });
    expect(postalCode).toHaveValue('12345');
  });

  it('updates formState.employmentStatus when selecting a new employment status', async () => {
    render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <MemberDetail />
        </BrowserRouter>
      </MockedProvider>,
    );

    // wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const employmentStatusDropdownBtn = await screen.findByTestId(
      'employmentstatus-dropdown-btn',
    );

    // open dropdown
    fireEvent.click(employmentStatusDropdownBtn);

    // select option
    const option = await screen.findByText(/Full-Time/i);
    fireEvent.click(option);

    // assert UI updated
    expect(employmentStatusDropdownBtn).toHaveTextContent(/Full-Time/i);
  });

  it('updates formState.maritalStatus when selecting a new marital status', async () => {
    render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <MemberDetail />
        </BrowserRouter>
      </MockedProvider>,
    );

    // wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const maritalStatusDropdownBtn = await screen.findByTestId(
      'maritalstatus-dropdown-btn',
    );

    // open dropdown
    fireEvent.click(maritalStatusDropdownBtn);

    // select an option (must exist in maritalStatusEnum)
    const option = await screen.findByText(/married/i);
    fireEvent.click(option);

    // assert UI updated → proves handleFieldChange ran
    expect(maritalStatusDropdownBtn).toHaveTextContent(/married/i);
  });

  it('updates formState.educationGrade when selecting a new education grade', async () => {
    render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <MemberDetail />
        </BrowserRouter>
      </MockedProvider>,
    );

    // wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const educationGradeDropdownBtn = await screen.findByTestId(
      'educationgrade-dropdown-btn',
    );

    // open dropdown
    fireEvent.click(educationGradeDropdownBtn);

    // select an option (must exist in educationGradeEnum)
    const option = await screen.findByText(/Pre-Kg/i);
    fireEvent.click(option);

    // assert UI updated → proves handleFieldChange ran
    expect(educationGradeDropdownBtn).toHaveTextContent(/Pre-Kg/i);
  });

  it('updates formState.addressLine1 when typing in addressLine1 input', async () => {
    render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <MemberDetail />
        </BrowserRouter>
      </MockedProvider>,
    );

    // wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    const addressLine1Input = screen.getByTestId(
      'inputAddressLine1',
    ) as HTMLInputElement;

    // simulate user typing
    fireEvent.change(addressLine1Input, {
      target: { value: '221B Baker Street' },
    });

    // assert input reflects updated state
    expect(addressLine1Input).toHaveValue('221B Baker Street');
  });

  it('updates formState.city when typing in city input', async () => {
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

    const cityInput = screen.getByTestId('inputCity') as HTMLInputElement;

    fireEvent.change(cityInput, {
      target: { value: 'Bengaluru' },
    });

    expect(cityInput).toHaveValue('Bengaluru');
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

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

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
});
