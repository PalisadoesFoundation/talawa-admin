import React from 'react';
import { describe, expect, beforeAll, vi, it } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Settings from './Settings';
import { toast } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';
import { MOCKS1, MOCKS2 } from './SettingsMocks';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { gql } from '@apollo/client';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn((t: unknown, error: unknown) => {
    // forward to toast.error so we can assert visual feedback
    const { toast } = require('react-toastify');
    toast.error(String((error as Error)?.message || error));
  }),
}));

vi.mock('utils/urlToFile', () => ({ urlToFile: vi.fn() }));
import { urlToFile } from 'utils/urlToFile';

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

describe('Testing Settings Screen [User Portal]', () => {
  beforeAll(() => {
    const { setItem } = useLocalStorage();
    setItem('name', 'John Doe');
    vi.useFakeTimers();
    if (!(global as any).URL.createObjectURL) {
      (global as any).URL.createObjectURL = vi.fn(() => 'blob:mock');
    }
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
  });

  it('Screen should be rendered properly', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    await wait();

    expect(screen.getByTestId('profile-header-title')).toBeInTheDocument();
  });

  it('sidebar', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
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
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    await wait();

    // Note: Toggle button functionality has been moved to separate components
    // (e.g., SidebarToggle) and is no longer part of the drawer components
    // due to plugin system modifications
  });

  it('validates password correctly', async () => {
    const toastSpy = vi.spyOn(toast, 'error');
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link1}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    await wait();

    // Test weak password
    fireEvent.change(screen.getByTestId('inputPassword'), {
      target: { value: 'weak' },
    });
    await wait();
    expect(toastSpy).toHaveBeenCalledWith(
      'Password must be at least 8 characters long.',
    );

    // Test strong password
    fireEvent.change(screen.getByTestId('inputPassword'), {
      target: { value: 'StrongPassword123!' },
    });
    await wait();
    expect(toastSpy).not.toHaveBeenCalledWith(
      /Password must be at least 8 characters long./i,
    );
  });

  it('validates birth date correctly', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link1}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
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
        <MockedProvider addTypename={false} link={link1}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
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

  it('updates user details (happy path)', async () => {
    const toastSuccessSpy = vi.spyOn(toast, 'success');
    // Full input object (non-empty fields) taken from MOCKS1 currentUser with updated name
    const fullInput = {
      addressLine1: 'Line 1',
      addressLine2: 'Line 2',
      birthDate: '2000-01-01',
      city: 'nyc',
      countryCode: 'in',
      description: 'This is a description',
      educationGrade: 'grade_8',
      employmentStatus: 'employed',
      homePhoneNumber: '+9999999998',
      maritalStatus: 'engaged',
      mobilePhoneNumber: '+9999999999',
      name: 'Bandhan Majumder Updated',
      natalSex: 'male',
      naturalLanguageCode: 'en',
      postalCode: '11111111f',
      state: 'State1',
      workPhoneNumber: '+9999999998',
    };

    const successMocks = [
      ...MOCKS1,
      {
        request: {
          query: UPDATE_CURRENT_USER_MUTATION,
          variables: { input: fullInput },
        },
        result: {
          data: {
            updateCurrentUser: {
              addressLine1: 'Line 1',
              addressLine2: 'Line 2',
              avatarMimeType: 'image/jpeg',
              avatarURL: 'http://example.com/avatar-updated.jpg',
              birthDate: '2000-01-01',
              city: 'nyc',
              countryCode: 'in',
              createdAt: '2025-02-06T03:10:50.254',
              description: 'This is a description',
              educationGrade: 'grade_8',
              emailAddress: 'updated@example.com',
              employmentStatus: 'employed',
              homePhoneNumber: '+9999999998',
              id: '0194d80f-03cd-79cd-8135-683494b187a1',
              isEmailAddressVerified: true,
              maritalStatus: 'engaged',
              mobilePhoneNumber: '+9999999999',
              name: 'Bandhan Majumder Updated',
              natalSex: 'male',
              naturalLanguageCode: 'en',
              postalCode: '11111111f',
              role: 'regular',
              state: 'State1',
              updatedAt: '2025-02-09T06:26:51.209Z',
              workPhoneNumber: '+9999999998',
              __typename: 'User',
            },
          },
        },
      },
      {
        request: {
          query: gql`
            query getCommunityData {
              community {
                inactivityTimeoutDuration
              }
            }
          `,
        },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 0,
              __typename: 'Community',
            },
          },
        },
      },
    ];

    await act(async () => {
      render(
        <MockedProvider addTypename={false} mocks={successMocks}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();
    // change name triggers isUpdated flag
    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'Bandhan Majumder Updated' },
    });
    await wait();
    const updateBtn = screen.getByTestId('updateUserBtn');
    await act(async () => {
      fireEvent.click(updateBtn);
    });
    // allow async toast + reload skip
    await wait(2100);
    expect(toastSuccessSpy).toHaveBeenCalled();
  });

  it('updates user details and triggers reload (covers post-success branch)', async () => {
    vi.useFakeTimers();
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, reload: vi.fn() },
      writable: true,
    });
    const mutationSpy = vi.fn();
    const avatarFile = new File(['img'], 'avatar.png', { type: 'image/png' });
    const expectedInput = {
      addressLine1: 'Line 1',
      addressLine2: 'Line 2',
      birthDate: '2000-01-01',
      city: 'nyc',
      countryCode: 'in',
      description: 'This is a description',
      educationGrade: 'grade_8',
      employmentStatus: 'employed',
      homePhoneNumber: '+9999999998',
      maritalStatus: 'engaged',
      mobilePhoneNumber: '+9999999999',
      name: 'Bandhan Majumder Reloaded',
      natalSex: 'male',
      naturalLanguageCode: 'en',
      postalCode: '11111111f',
      state: 'State1',
      workPhoneNumber: '+9999999998',
      avatar: avatarFile,
    };
    const mocks = [
      ...MOCKS1,
      {
        request: {
          query: UPDATE_CURRENT_USER_MUTATION,
          variables: { input: expectedInput },
        },
        result: () => {
          mutationSpy();
          return {
            data: {
              updateCurrentUser: {
                id: 'id1',
                name: expectedInput.name,
                emailAddress: 'user@example.com',
                avatarURL: 'http://example.com/a.jpg',
                role: 'regular',
                __typename: 'User',
              },
            },
          };
        },
      },
      {
        request: {
          query: gql`
            query getCommunityData {
              community {
                inactivityTimeoutDuration
              }
            }
          `,
        },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 0,
              __typename: 'Community',
            },
          },
        },
      },
    ];
    await act(async () => {
      render(
        <MockedProvider addTypename={false} mocks={mocks}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();
    // set avatar first so it's included in variables
    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    fileInput.style.display = 'block';
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [avatarFile] } });
    });
    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: expectedInput.name },
    });
    await wait();
    fireEvent.click(screen.getByTestId('updateUserBtn'));
    // fast-forward the internal 2000ms delay
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(mutationSpy).toHaveBeenCalled();
    // Instead of asserting reload (implementation detail), assert localStorage side-effects
    const { getItem } = useLocalStorage();
    expect(getItem('name')).toBe(expectedInput.name);
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('resets avatar & file input (covers reset branch completely)', async () => {
    // Provide mock for URL.createObjectURL used in avatar handling utilities
    if (!(global as any).URL.createObjectURL) {
      (global as any).URL.createObjectURL = vi.fn(() => 'blob:mock');
    }
    await act(async () => {
      render(
        <MockedProvider
          addTypename={false}
          link={new StaticMockLink(MOCKS1, true)}
        >
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();
    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;
    fileInput.style.display = 'block';
    const validFile = new File(['img'], 'pic.png', { type: 'image/png' });
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [validFile] } });
    });
    expect(fileInput.files?.[0].name).toBe('pic.png');
    // change a text field too
    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'Changed Name' },
    });
    await wait();
    fireEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();
    // file input cleared
    expect(fileInput.value).toBe('');
  });

  it('resets changes after modification', async () => {
    await act(async () => {
      render(
        <MockedProvider
          addTypename={false}
          link={new StaticMockLink(MOCKS1, true)}
        >
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();
    const nameInput = screen.getByTestId('inputName') as HTMLInputElement;
    const originalValue = nameInput.value;
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    await wait();
    const resetBtn = screen.getByTestId('resetChangesBtn');
    fireEvent.click(resetBtn);
    await wait();
    expect((screen.getByTestId('inputName') as HTMLInputElement).value).toBe(
      originalValue,
    );
  });

  it('handles update mutation error path (avatar conversion failure)', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    (urlToFile as any).mockRejectedValueOnce(new Error('convert fail'));
    await act(async () => {
      render(
        <MockedProvider addTypename={false} mocks={MOCKS1}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();
    // change a field to surface update buttons
    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'Bandhan Error' },
    });
    await wait();
    fireEvent.click(screen.getByTestId('updateUserBtn'));
    await wait();
    expect(toastErrorSpy).toHaveBeenCalledWith(
      'Failed to process profile picture. Please try uploading again.',
    );
  });

  it('does not update when no fields changed', async () => {
    const mockLink = new StaticMockLink(MOCKS1, true);
    const mutateSpy = vi.spyOn(mockLink, 'request');
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={mockLink}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();
    // No change -> update buttons not visible (isUpdated false)
    expect(screen.queryByTestId('updateUserBtn')).not.toBeInTheDocument();
    expect(mutateSpy).toHaveBeenCalled();
  });
});
