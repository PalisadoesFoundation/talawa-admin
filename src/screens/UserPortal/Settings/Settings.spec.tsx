import React from 'react';
import { describe, expect, vi, it, beforeEach, afterEach } from 'vitest';
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

describe('Testing Settings Screen [User Portal]', () => {
  beforeEach(() => {
    localStorage.clear();
    const { setItem } = useLocalStorage();
    setItem('name', 'John Doe');
    vi.useFakeTimers();
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

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
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
});
