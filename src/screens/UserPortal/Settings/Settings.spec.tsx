import React from 'react';
import { describe, expect, beforeAll, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Settings from './Settings';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import { errorMock, MOCKS1, MOCKS2 } from './SettingsMocks';
import { urlToFile } from 'utils/urlToFile';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('utils/errorHandler', () => ({ errorHandler: vi.fn() }));

vi.mock('utils/urlToFile', () => ({ urlToFile: vi.fn() }));

const link = new StaticMockLink(MOCKS1, true);
const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
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

    const closeMenubtn = screen.getByTestId('closeMenu');
    expect(closeMenubtn).toBeInTheDocument();
    act(() => closeMenubtn.click());
    const openMenuBtn = screen.getByTestId('openMenu');
    expect(openMenuBtn).toBeInTheDocument();
    act(() => openMenuBtn.click());
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

    const openMenuBtn = screen.queryByTestId('openMenu');
    console.log('Open Menu Button:', openMenuBtn);
    expect(openMenuBtn).toBeInTheDocument();

    if (openMenuBtn) {
      act(() => openMenuBtn.click());
    }

    const closeMenuBtn = screen.queryByTestId('closeMenu');
    console.log('Close Menu Button:', closeMenuBtn);
    expect(closeMenuBtn).toBeInTheDocument();

    if (closeMenuBtn) {
      act(() => closeMenuBtn.click());
    }
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

    // Test valid date
    fireEvent.change(screen.getByLabelText('Birth Date'), {
      target: { value: '2000-01-01' },
    });
    await wait();
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2000-01-01');
  });

  // it('handles update user mutation error', async () => {
  //   const mockedErrorHandler = vi.mocked(errorHandler);
  //   const errorLink = new StaticMockLink(errorMock, true);

  //   await act(async () => {
  //     render(
  //       <MockedProvider addTypename={false} link={errorLink}>
  //         <BrowserRouter>
  //           <Provider store={store}>
  //             <I18nextProvider i18n={i18nForTest}>
  //               <Settings />
  //             </I18nextProvider>
  //           </Provider>
  //         </BrowserRouter>
  //       </MockedProvider>,
  //     );
  //   });

  //   // Wait for the component to fully load
  //   await wait();
  //   // Make changes that will trigger error
  //   fireEvent.change(screen.getByTestId('inputName'), {
  //     target: { value: 'Bandhan' },
  //   });
  //   fireEvent.change(screen.getByTestId('inputPhoneNumber'), {
  //     target: { value: '1200' },
  //   });
  //   console.log('both phone number and name is changed');
  //   await act(async () => {
  //     fireEvent.click(screen.getByTestId('updateUserBtn'));
  //   });
  //   await wait();
  //   expect(mockedErrorHandler).toHaveBeenCalled();
  // });

  it('handles file upload correctly', async () => {
    vi.clearAllMocks();
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

    // Valid file upload
    const validFile = new File(['valid'], 'test.jpg', { type: 'image/jpeg' });
    await act(async () => {
      userEvent.upload(fileInput, validFile);
    });
    await wait();

    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'Bandhan' },
    });

    // Check if states are updated
    const updateBtn = screen.getByTestId('fileInput');
    expect(updateBtn).toBeEnabled();
    expect(toastSpy).not.toHaveBeenCalled();
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
