import React from 'react';
import { describe, expect, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Settings from './Settings';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import '../../../style/app.module.css';
import { errorMock, MOCKS1, MOCKS2 } from './SettingsMocks';
import { urlToFile } from 'utils/urlToFile';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

vi.mock('utils/urlToFile', () => ({
  urlToFile: vi.fn(),
}));

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

  it('input works properly', async () => {
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

    userEvent.type(screen.getByTestId('inputName'), 'Noble Mittal');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputGender'), 'Male');
    await wait();
    userEvent.type(screen.getByTestId('inputPhoneNumber'), '1234567890');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputGrade'), 'Grade-1');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputEmpStatus'), 'Unemployed');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputMaritalStatus'), 'Single');
    await wait();
    userEvent.type(screen.getByTestId('inputAddress1'), 'random');
    await wait();
    userEvent.type(screen.getByTestId('inputAddress2'), 'random');
    await wait();
    userEvent.type(screen.getByTestId('inputState'), 'random');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputCountry'), 'in');
    await wait();
    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    await wait();
    fireEvent.change(screen.getByLabelText('Birth Date'), {
      target: { value: '2024-03-01' },
    });
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2024-03-01');
    await wait();
    const fileInp = screen.getByTestId('fileInput');
    fileInp.style.display = 'block';
    userEvent.click(screen.getByTestId('uploadImageBtn'));
    await wait();
    const imageFile = new File(['(⌐□_□)'], 'profile-image.jpg', {
      type: 'image/jpeg',
    });
    const files = [imageFile];
    userEvent.upload(fileInp, files);
    await wait();
    expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
  });

  it('resetChangesBtn works properly', async () => {
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

    fireEvent.change(screen.getByTestId('inputAddress1'), {
      target: { value: 'random' },
    });
    fireEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();
    expect(screen.getByTestId('inputName')).toHaveValue('Bandhan Majumder');
    expect(screen.getByTestId('inputGender')).toHaveValue('male');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('+9999999999');
    expect(screen.getByTestId('inputGrade')).toHaveValue('grade_8');
    expect(screen.getByTestId('inputEmpStatus')).toHaveValue('full_time');
    expect(screen.getByTestId('inputMaritalStatus')).toHaveValue('engaged');
    expect(screen.getByTestId('inputAddress1')).toHaveValue('Line 1');
    expect(screen.getByTestId('inputAddress2')).toHaveValue('Line 2');
    expect(screen.getByTestId('inputState')).toHaveValue('State1');
    expect(screen.getByTestId('inputCountry')).toHaveValue('in');
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2000-01-01');
  });

  it('resetChangesBtn works properly when the details are empty', async () => {
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
    fireEvent.change(screen.getByTestId('inputAddress1'), {
      target: { value: 'random' },
    });
    await wait();
    fireEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();
    expect(screen.getByTestId('inputName')).toHaveValue('');
    expect(screen.getByTestId('inputGender')).toHaveValue('');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('');
    expect(screen.getByTestId('inputGrade')).toHaveValue('');
    expect(screen.getByTestId('inputEmpStatus')).toHaveValue('');
    expect(screen.getByTestId('inputMaritalStatus')).toHaveValue('');
    expect(screen.getByTestId('inputAddress1')).toHaveValue('');
    expect(screen.getByTestId('inputAddress2')).toHaveValue('');
    expect(screen.getByTestId('inputState')).toHaveValue('');
    expect(screen.getByTestId('inputCountry')).toHaveValue('');
    expect(screen.getByLabelText('Birth Date')).toHaveValue('');
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

    // Test future date
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    fireEvent.change(screen.getByLabelText('Birth Date'), {
      target: { value: futureDate.toISOString().split('T')[0] },
    });
    await wait();
    expect(toastSpy).toHaveBeenCalledWith(
      'Future dates are not allowed for birth date.',
    );

    // Test valid date
    fireEvent.change(screen.getByLabelText('Birth Date'), {
      target: { value: '2000-01-01' },
    });
    await wait();
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2000-01-01');
  });

  it('handles update user mutation error', async () => {
    const errorLink = new StaticMockLink(errorMock, true);

    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={errorLink}>
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

    // Make changes that will trigger error
    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'Bandhan' },
    });
    fireEvent.change(screen.getByTestId('inputPhoneNumber'), {
      target: { value: '1200' },
    });

    // Trigger update
    fireEvent.click(screen.getByTestId('updateUserBtn'));
    await wait();

    expect(errorHandler).toHaveBeenCalled();
  });

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
    const updateBtn = screen.getByTestId('updateUserBtn');
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

  it('rejects files larger than 5MB', async () => {
    const toastSpy = vi.spyOn(toast, 'error');
    global.URL.createObjectURL = vi.fn(() => 'mockURL');
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

    // Create a large file (6MB)
    const largeFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      'large.jpg',
      { type: 'image/jpeg' },
    );
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
    });

    expect(toastSpy).toHaveBeenCalledWith(
      'File is too large. Maximum size is 5MB.',
    );

    const fileInput2 = screen.getByTestId('fileInput');
    fileInput.style.display = 'block';

    // Create a valid image file
    const imageFile = new File(['text'], 'profile.jpg', { type: 'image/jpeg' });

    // Trigger file upload
    await act(async () => {
      fireEvent.change(fileInput2, { target: { files: [imageFile] } });
    });

    // After file upload:
    // 1. Update button should be enabled (isUpdated should be true)
    expect(screen.getByTestId('updateUserBtn')).toBeEnabled();

    // 2. Profile picture should be displayed
    expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
  });

  it('handles profile picture processing error', async () => {
    const toastSpy = vi.spyOn(toast, 'error');
    vi.mocked(urlToFile).mockRejectedValue(
      new Error('Failed to process image'),
    );
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

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'Bandhan' },
    });

    // Trigger update with existing avatar URL
    const updateButton = screen.getByTestId('updateUserBtn');
    await act(async () => {
      fireEvent.click(updateButton);
    });

    expect(toastSpy).toHaveBeenCalledWith(
      'Failed to process profile picture. Please try uploading again.',
    );
  });
});
