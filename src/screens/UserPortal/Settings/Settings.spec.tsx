import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
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
import { MOCKS, Mocks1, Mocks2, updateMock, errorMock } from './SettingsMocks';

// Mock dependencies
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// Create mock links
const link = new StaticMockLink(MOCKS, true);
const link1 = new StaticMockLink(Mocks1, true);
const link2 = new StaticMockLink(Mocks2, true);
const link3 = new StaticMockLink(updateMock, true);
const link4 = new StaticMockLink(errorMock, true);

async function wait(ms = 100): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

const renderComponent = (mockLink = link): ReturnType<typeof render> => {
  return render(
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
};

describe('Settings Component', () => {
  beforeEach(() => {
    const { setItem } = useLocalStorage();
    setItem('name', 'Test User');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component successfully', async () => {
    renderComponent();
    await wait();

    expect(screen.getByText('settings')).toBeInTheDocument();
    expect(screen.getByText('profileSettings')).toBeInTheDocument();
  });

  it('handles field changes correctly', async () => {
    renderComponent();
    await wait();

    const nameInput = screen.getByTestId('inputName');
    await userEvent.type(nameInput, 'New Name');
    expect(nameInput).toHaveValue('New Name');

    const genderSelect = screen.getByTestId('inputGender');
    await userEvent.selectOptions(genderSelect, 'male');
    expect(genderSelect).toHaveValue('male');
  });

  it('validates birth date field', async () => {
    renderComponent();
    await wait();

    const birthDateInput = screen.getByLabelText('birthDate');
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    fireEvent.change(birthDateInput, {
      target: { value: futureDate.toISOString().split('T')[0] },
    });

    expect(toast.error).toHaveBeenCalledWith(
      'Future dates are not allowed for birth date.',
    );
  });

  it('validates password field', async () => {
    renderComponent();
    await wait();

    const passwordInput = screen.getByTestId('inputPassword');
    await userEvent.type(passwordInput, 'weak');

    expect(toast.error).toHaveBeenCalledWith(
      'Password must be at least 8 characters long.',
    );
  });

  it('handles file upload correctly', async () => {
    renderComponent();
    await wait();

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('fileInput');
    await userEvent.upload(fileInput as HTMLInputElement, file);
    expect((fileInput as HTMLInputElement).files?.[0]).toStrictEqual(file);
  });

  it('validates file upload restrictions', async () => {
    renderComponent();
    await wait();

    // Test invalid file type
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByTestId('fileInput');
    await userEvent.upload(fileInput, invalidFile);

    expect(toast.error).toHaveBeenCalledWith(
      'Invalid file type. Please upload a JPEG, PNG, or GIF.',
    );

    // Test file size limit
    const largeFile = new File(['test'.repeat(1000000)], 'large.png', {
      type: 'image/png',
    });
    await userEvent.upload(fileInput, largeFile);

    expect(toast.error).toHaveBeenCalledWith(
      'File is too large. Maximum size is 5MB.',
    );
  });

  it('handles reset changes correctly', async () => {
    renderComponent(link1);
    await wait();

    const nameInput = screen.getByTestId('inputName');
    await userEvent.type(nameInput, 'Changed Name');

    const resetButton = screen.getByTestId('resetChangesBtn');
    await userEvent.click(resetButton);

    expect(nameInput).toHaveValue('Bandhan Majumder');
  });

  it('handles successful profile update', async () => {
    renderComponent(link3);
    await wait();

    const nameInput = screen.getByTestId('inputName');
    await userEvent.type(nameInput, 'Updated Name');

    const updateButton = screen.getByTestId('updateUserBtn');
    await userEvent.click(updateButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Profile updated Successfully',
      );
    });
  });

  it('handles profile update error', async () => {
    renderComponent(link4);
    await wait();

    const updateButton = screen.getByTestId('updateUserBtn');
    await userEvent.click(updateButton);

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  it('handles sidebar toggle on different screen sizes', async () => {
    renderComponent();
    await wait();

    // Test initial state
    const toggleButton = screen.getByTestId('closeMenu');
    expect(toggleButton).toBeInTheDocument();

    // Test toggle
    await userEvent.click(toggleButton);
    expect(screen.getByTestId('openMenu')).toBeInTheDocument();

    // Test responsive behavior
    global.innerWidth = 800;
    fireEvent(window, new Event('resize'));
    await wait();

    expect(screen.getByTestId('openMenu')).toBeInTheDocument();
  });

  it('handles empty user details correctly', async () => {
    renderComponent(link2);
    await wait();

    const nameInput = screen.getByTestId('inputName');
    const emailInput = screen.getByTestId('inputEmail');
    const phoneInput = screen.getByTestId('inputPhoneNumber');

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(phoneInput).toHaveValue('');
  });
});
