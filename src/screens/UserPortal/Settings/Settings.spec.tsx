import React from 'react';
import { describe, expect, vi, it, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Settings from './Settings';
import { toast } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';
import { MOCKS1, MOCKS2 } from './SettingsMocks';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';

const sharedMocks = vi.hoisted(() => ({
  toast: { success: vi.fn(), warn: vi.fn(), error: vi.fn() },
  errorHandler: vi.fn(),
  urlToFile: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: sharedMocks.toast,
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: sharedMocks.errorHandler,
}));

vi.mock('utils/urlToFile', () => ({ urlToFile: sharedMocks.urlToFile }));

// Mock SignOut component to prevent useNavigate() error from Router context
vi.mock('components/SignOut/SignOut', () => ({
  default: vi.fn(() => (
    <button data-testid="signOutBtn" type="button">
      Sign Out
    </button>
  )),
}));

// Mock useSession to prevent router hook errors
vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    endSession: vi.fn(),
    startSession: vi.fn(),
    handleLogout: vi.fn(),
    extendSession: vi.fn(),
  })),
}));

// Mock ProfileCard component to prevent useNavigate() error from Router context
vi.mock('components/ProfileCard/ProfileCard', () => ({
  default: vi.fn(() => (
    <div data-testid="profile-dropdown">
      <div data-testid="display-name">Test User</div>
      <div data-testid="display-type">User</div>
      <button data-testid="profileBtn" type="button">
        Profile Button
      </button>
    </div>
  )),
}));

const link = new StaticMockLink(MOCKS1, true);
const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new window.Event('resize'));
};

async function wait(ms = 100): Promise<void> {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

const originalMatchMedia = window.matchMedia;
const originalLocation = window.location;

describe('Testing Settings Screen [User Portal]', () => {
  beforeEach(() => {
    localStorage.clear();
    const { setItem } = useLocalStorage();
    setItem('name', 'John Doe');
    vi.useFakeTimers();

    // Clear all hoisted mocks to ensure test isolation
    sharedMocks.toast.success.mockClear();
    sharedMocks.toast.warn.mockClear();
    sharedMocks.toast.error.mockClear();
    sharedMocks.errorHandler.mockClear();
    sharedMocks.urlToFile.mockClear();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...originalLocation, reload: vi.fn() },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('Screen should be rendered properly', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    expect(screen.getByTestId('profile-header-title')).toBeInTheDocument();
  });

  it('displays error message when query fails', async () => {
    const errorMock = {
      request: {
        query: CURRENT_USER,
      },
      error: new Error('Query failed'),
    };

    const errorLink = new StaticMockLink([errorMock], true);

    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={errorLink}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    expect(screen.getByText(/Error:/)).toBeInTheDocument();
  });

  it('sidebar', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link2}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    // Note: Toggle button functionality has been moved to separate components
    // (e.g., SidebarToggle) and is no longer part of the drawer components
    // due to plugin system modifications
  });

  it('Testing sidebar when the screen size is less than or equal to 820px', async () => {
    resizeWindow(800);
    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link2}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    // Note: Toggle button functionality has been moved to separate components
    // (e.g., SidebarToggle) and is no longer part of the drawer components
    // due to plugin system modifications
  });

  it('validates password only on save button click', async () => {
    // Clear the hoisted mock before test
    sharedMocks.toast.warn.mockClear();
    const toastSpy = vi.spyOn(toast, 'warn');

    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link1}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    const passwordInput = screen.getByTestId('inputPassword');

    // Type weak password - NO toast should appear during typing
    fireEvent.change(passwordInput, {
      target: { value: 'weak' },
    });
    await wait();

    // Verify NO toast was called during typing
    expect(toastSpy).not.toHaveBeenCalled();

    // Click update button - NOW validation should trigger
    const updateButton = screen.getByTestId('updateUserBtn');
    fireEvent.click(updateButton);
    await wait();

    // Verify toast.warn (not toast.error) was called with correct message
    expect(toastSpy).toHaveBeenCalledWith(
      'Password should contain atleast one lowercase letter, one uppercase letter, one numeric value and one special character',
    );
  });

  it('validates birth date correctly', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link1}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    // Test valid date
    fireEvent.change(screen.getByLabelText('Birth Date'), {
      target: { value: '2000-01-01' },
    });
    await wait();
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2000-01-01');
  });

  it('rejects invalid file types', async () => {
    const toastSpy = vi.spyOn(toast, 'error');

    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link1}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    const fileInput = screen.getByTestId('fileInput');
    fileInput.style.display = 'block';

    // Invalid file type
    const invalidFile = new File(['invalid'], 'test.txt', {
      type: 'text/plain',
    });
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    });

    expect(toastSpy).toHaveBeenCalledWith(
      'Invalid file type. Please upload a JPEG, PNG, or GIF.',
    );
  });
  it('validates file size correctly', async () => {
    const toastSpy = vi.spyOn(toast, 'error');
    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link1}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    const fileInput = screen.getByTestId('fileInput');

    // Test large file
    const largeFile = new File(['a'.repeat(5 * 1024 * 1024 + 1)], 'large.png', {
      type: 'image/png',
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
    });

    expect(toastSpy).toHaveBeenCalledWith(
      'File is too large. Maximum size is 5MB.',
    );
  });

  it('handles file change with no file selected', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link1}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    const fileInput = screen.getByTestId('fileInput');

    // Trigger change event with no files (empty file list)
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [] } });
    });

    // No error should be thrown, component should handle gracefully
    expect(screen.getByTestId('inputName')).toBeInTheDocument();
    // Verify no error toast was triggered - confirms no-file case is a no-op
    expect(sharedMocks.toast.error).not.toHaveBeenCalled();
  });

  it('resetUserDetails helper is a no-op when currentUser is missing', async () => {
    // import helper directly from component file
    const { resetUserDetails } = await import('./Settings');

    const setIsUpdated = vi.fn();
    const setSelectedAvatar = vi.fn();
    const setUserDetails = vi.fn();

    const fakeInput = { value: 'file' } as HTMLInputElement;

    const result = resetUserDetails(
      undefined,
      fakeInput,
      setSelectedAvatar,
      setIsUpdated,
      setUserDetails,
      'orig.png',
    );

    expect(result).toBe(false);
    expect(setIsUpdated).toHaveBeenCalledWith(false);
    expect(setSelectedAvatar).toHaveBeenCalledWith(null);
    expect(setUserDetails).not.toHaveBeenCalled();
    // file input should remain unchanged since helper returns early
    expect(fakeInput.value).toBe('file');
  });

  it('resetUserDetails helper resets values when currentUser is present', async () => {
    const { resetUserDetails } = await import('./Settings');

    const setIsUpdated = vi.fn();
    const setSelectedAvatar = vi.fn();
    const setUserDetails = vi.fn();

    const fakeInput = { value: 'file' } as unknown as HTMLInputElement;
    const currentUser: Record<string, unknown> = {
      id: '1',
      name: 'a',
      avatar: 'old',
    };

    const result = resetUserDetails(
      currentUser,
      fakeInput,
      setSelectedAvatar,
      setIsUpdated,
      setUserDetails,
      'orig.png',
    );

    expect(result).toBe(true);
    expect(setUserDetails).toHaveBeenCalledWith({
      ...currentUser,
      avatar: 'orig.png',
    });
    expect(fakeInput.value).toBe('');
  });

  it('updates user with newly uploaded avatar (selectedAvatar path)', async () => {
    const newAvatarFile = new File(['avatar'], 'newAvatar.png', {
      type: 'image/png',
    });

    const updateWithAvatarMock = {
      request: {
        query: UPDATE_CURRENT_USER_MUTATION,
        variables: {
          input: {
            name: 'Updated With Avatar',
            avatar: newAvatarFile,
          },
        },
      },
      result: {
        data: {
          updateCurrentUser: {
            id: '0194d80f-03cd-79cd-8135-683494b187a1',
            name: 'Updated With Avatar',
            emailAddress: 'test@example.com',
            avatarURL: 'http://new.avatar.url',
            role: 'user',
          },
        },
      },
    };

    const avatarUpdateLink = new StaticMockLink(
      [MOCKS2[0], updateWithAvatarMock],
      true,
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={avatarUpdateLink}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    // Upload a new avatar file
    const fileInput = screen.getByTestId('fileInput');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [newAvatarFile] } });
    });

    await wait();

    // Change the name
    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'Updated With Avatar' } });

    const updateButton = screen.getByTestId('updateUserBtn');
    await act(async () => {
      fireEvent.click(updateButton);
    });

    await wait(2500);

    expect(toast.success).toHaveBeenCalled();
  });

  it('resets changes correctly', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link1}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    const nameInput = screen.getByTestId('inputName');
    const originalName = nameInput.getAttribute('value');

    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput).toHaveValue('New Name');

    const resetButton = screen.getByTestId('resetChangesBtn');
    fireEvent.click(resetButton);

    expect(nameInput).toHaveValue(originalName);
  });

  it('updates user details successfully', async () => {
    const updateMock = {
      request: {
        query: UPDATE_CURRENT_USER_MUTATION,
        variables: {
          input: {
            name: 'Updated Name',
          },
        },
      },
      result: {
        data: {
          updateCurrentUser: {
            id: '0194d80f-03cd-79cd-8135-683494b187a1',
            name: 'Updated Name',
            emailAddress: 'test@example.com',
            avatarURL: 'http://avatar.url',
            role: 'user',
          },
        },
      },
    };

    // Create a link that includes MOCKS2 and the updateMock
    const updateLink = new StaticMockLink([MOCKS2[0], updateMock], true);

    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={updateLink}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const updateButton = screen.getByTestId('updateUserBtn');
    await act(async () => {
      fireEvent.click(updateButton);
    });

    // Wait for mutation to complete
    await wait();

    // Wait for the 2000ms setTimeout in the code to complete
    await wait(2500);

    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining('Profile updated Successfully'),
    );

    // Verify window.location.reload was called
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('handles update mutation returning null data', async () => {
    const nullDataMock = {
      request: {
        query: UPDATE_CURRENT_USER_MUTATION,
        variables: {
          input: {
            name: 'Null Data Test',
          },
        },
      },
      result: {
        data: null,
      },
    };

    const nullDataLink = new StaticMockLink([MOCKS2[0], nullDataMock], true);

    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={nullDataLink}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'Null Data Test' } });

    const updateButton = screen.getByTestId('updateUserBtn');
    await act(async () => {
      fireEvent.click(updateButton);
    });

    await wait(500);

    // When data is null, success toast should NOT be called
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('shows error toast when urlToFile fails during update', async () => {
    // Mock urlToFile to throw an error
    sharedMocks.urlToFile.mockRejectedValue(new Error('Failed to convert URL'));

    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link1}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    // Change name to trigger isUpdated without uploading a new avatar
    // The user has an avatarURL so urlToFile will be called
    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    const updateButton = screen.getByTestId('updateUserBtn');
    await act(async () => {
      fireEvent.click(updateButton);
    });

    await wait();

    expect(sharedMocks.toast.error).toHaveBeenCalledWith(
      'Failed to process profile picture. Please try uploading again.',
    );
  });

  it('handles update mutation error correctly', async () => {
    // Mock urlToFile to return a file successfully so we can reach the mutation
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    sharedMocks.urlToFile.mockResolvedValue(mockFile);

    // Create a mock that returns an error for the mutation
    const errorMock = {
      request: {
        query: UPDATE_CURRENT_USER_MUTATION,
        variables: {
          input: {
            name: 'Error Name',
            avatar: mockFile,
          },
        },
      },
      error: new Error('Update failed'),
    };

    const errorLink = new StaticMockLink([MOCKS1[0], errorMock], true);

    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={errorLink}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    // Change only the name field
    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'Error Name' } });

    const updateButton = screen.getByTestId('updateUserBtn');
    await act(async () => {
      fireEvent.click(updateButton);
    });

    await wait(500);

    // The errorHandler should be called when mutation fails
    expect(sharedMocks.errorHandler).toHaveBeenCalled();
  });

  it('resets file input value when reset button is clicked after file upload', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider link={link1}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </MockedProvider>
        </BrowserRouter>,
      );
    });

    await wait();

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;

    // Upload a valid file first
    const validFile = new File(['test'], 'test.png', { type: 'image/png' });
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [validFile] } });
    });

    await wait();

    // Now click reset button
    const resetButton = screen.getByTestId('resetChangesBtn');
    fireEvent.click(resetButton);

    await wait();

    // The file input should be reset (value should be empty)
    expect(fileInput.value).toBe('');
  });
  describe('Password Validation in Settings', () => {
    it('should show password validation UI when password field is focused in user details', async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <MockedProvider link={link1}>
              <Provider store={store}>
                <I18nextProvider i18n={i18nForTest}>
                  <Settings />
                </I18nextProvider>
              </Provider>
            </MockedProvider>
          </BrowserRouter>,
        );
      });

      await wait();

      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);

      await wait();

      // Validation messages should appear
      expect(
        screen.getByText(i18nForTest.t('settings.atleast_8_char_long')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('settings.lowercase_check')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('settings.uppercase_check')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('settings.numeric_value_check')),
      ).toBeInTheDocument();
      expect(
        screen.getByText(i18nForTest.t('settings.special_char_check')),
      ).toBeInTheDocument();
    });

    it('should validate password only on save, not on every keystroke', async () => {
      sharedMocks.toast.warn.mockClear(); // Use hoisted mock
      const toastSpy = vi.spyOn(toast, 'warn');

      await act(async () => {
        render(
          <BrowserRouter>
            <MockedProvider link={link1}>
              <Provider store={store}>
                <I18nextProvider i18n={i18nForTest}>
                  <Settings />
                </I18nextProvider>
              </Provider>
            </MockedProvider>
          </BrowserRouter>,
        );
      });

      await wait();

      const passwordInput = screen.getByTestId('inputPassword');

      // Type weak password - should NOT show toast immediately
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      await wait();

      expect(toastSpy).not.toHaveBeenCalled(); // Changed

      // Only when clicking update button
      const updateButton = screen.getByTestId('updateUserBtn');
      fireEvent.click(updateButton);

      await wait();

      expect(toastSpy).toHaveBeenCalledWith(
        // Changed
        expect.stringContaining(
          'Password should contain atleast one lowercase letter, one uppercase letter, one numeric value and one special character',
        ),
      );
    });

    it('should allow update with valid password meeting all requirements', async () => {
      sharedMocks.toast.warn.mockClear(); // Add this

      await act(async () => {
        render(
          <BrowserRouter>
            <MockedProvider link={link1}>
              <Provider store={store}>
                <I18nextProvider i18n={i18nForTest}>
                  <Settings />
                </I18nextProvider>
              </Provider>
            </MockedProvider>
          </BrowserRouter>,
        );
      });

      await wait();

      const passwordInput = screen.getByTestId('inputPassword');

      // Type valid password
      fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
      await wait();

      // Click update
      const updateButton = screen.getByTestId('updateUserBtn');
      fireEvent.click(updateButton);
      await wait();

      // Should not show any validation errors
      expect(sharedMocks.toast.warn).not.toHaveBeenCalled(); // Changed
    });

    it('should show real-time visual feedback for password requirements', async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <MockedProvider link={link1}>
              <Provider store={store}>
                <I18nextProvider i18n={i18nForTest}>
                  <Settings />
                </I18nextProvider>
              </Provider>
            </MockedProvider>
          </BrowserRouter>,
        );
      });

      await wait();

      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      await wait();

      // Type progressively to see visual feedback change
      fireEvent.change(passwordInput, { target: { value: 'test' } });
      await wait();

      // Should see checks being satisfied/unsatisfied in real-time
      const lengthCheck = screen
        .getByText(i18nForTest.t('settings.atleast_8_char_long'))
        .closest('p');
      expect(lengthCheck).toHaveClass('text-danger'); // Less than 8 chars

      fireEvent.change(passwordInput, { target: { value: 'TestPass123!' } });
      await wait();

      const lengthCheckAfter = screen
        .getByText(i18nForTest.t('settings.atleast_8_char_long'))
        .closest('p');
      expect(lengthCheckAfter).toHaveClass('text-success'); // 8+ chars now
    });
  });
});
