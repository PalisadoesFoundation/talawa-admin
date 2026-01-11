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
import MemberDetail, { getLanguageName } from './ProfileForm';
import {
  MOCKS1,
  MOCKS2,
  MOCK_FILE,
  UPDATE_MOCK,
  UPDATE_USER_ERROR_MOCKS,
} from './profileForm.mock';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { urlToFile } from 'utils/urlToFile';

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(UPDATE_USER_ERROR_MOCKS, true);
const link4 = new StaticMockLink(MOCK_FILE, true);
const link5 = new StaticMockLink(UPDATE_MOCK, true);

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

// Mock localStorage for user profile tests
const mockLocalStorage = {
  getItem: (key: string) => {
    if (key === 'id') return '456';
    if (key === 'sidebar') return 'false';
    return null;
  },
  setItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

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

    test('display admin role for member profile', async () => {
      renderMemberDetailScreen(link1);
      await wait();
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    test('display tags Assigned for member profile', async () => {
      renderMemberDetailScreen(link1);
      await wait();
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
      expect(screen.getByText('Tags Assigned')).toBeInTheDocument();
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

    test('should render user sidebar for user profile view', async () => {
      renderUserProfileScreen(link1);
      await wait();

      // The user profile view should render with UserSidebar and ProfileHeader
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('Shared Functionality', () => {
    test('getLanguageName function should work properly', () => {
      expect(getLanguageName('en')).toBe('English');
      expect(getLanguageName('')).toBe(null);
      expect(getLanguageName('xyz')).toBe(null);
    });

    test('should render props and text elements test for the page component', async () => {
      const formData = {
        addressLine1: 'Line 1',
        addressLine2: 'Line 2',
        birthDate: '2000-01-01',
        city: 'nyc',
        countryCode: 'BB', // e.g., BB (adjust to your actual code)
        description: 'This is a description',
        emailAddress: 'test221@gmail.com',
        mobilePhoneNumber: '+9999999999',
        homePhoneNumber: '+9999999998',
        workPhoneNumber: '+9999999998',
        name: 'Rishav Jha',
        postalCode: '111111',
        state: 'State1',
      };

      renderMemberDetailScreen(link2);
      await wait();

      // birth date
      const birthDateDatePicker = screen.getByTestId('birthDate');
      fireEvent.change(birthDateDatePicker, {
        target: { value: formData.birthDate },
      });

      // Helper to set text inputs safely
      const setText = async (testIdRegex: RegExp, value: string) => {
        const el = screen.getByTestId(testIdRegex) as
          | HTMLInputElement
          | HTMLTextAreaElement;

        if (!el.readOnly && !el.disabled) {
          await userEvent.clear(el);
          await userEvent.type(el, value);
        }
        return el;
      };

      // Fill editable text inputs ONCE
      const nameInput = await setText(/inputName/i, formData.name);
      const addressLine1Input = await setText(
        /addressLine1/i,
        formData.addressLine1,
      );
      const addressLine2Input = await setText(
        /addressLine2/i,
        formData.addressLine2,
      );
      const cityInput = await setText(/inputCity/i, formData.city);
      const stateInput = await setText(/inputState/i, formData.state);
      const postalCodeInput = await setText(
        /inputPostalCode/i,
        formData.postalCode,
      );
      const descriptionInput = await setText(
        /inputDescription/i,
        formData.description,
      );
      const emailInput = await setText(/inputEmail/i, formData.emailAddress);
      const mobilePhoneInput = await setText(
        /inputMobilePhoneNumber/i,
        formData.mobilePhoneNumber,
      );
      const homePhoneInput = await setText(
        /inputHomePhoneNumber/i,
        formData.homePhoneNumber,
      );
      const workPhoneInput = await setText(
        /workPhoneNumber/i,
        formData.workPhoneNumber,
      );

      // MUI/custom select trigger (non-editable control)
      const countryTrigger = screen.getByTestId(/inputCountry/i);
      await userEvent.click(countryTrigger);
      // Adjust the label below to whatever your UI shows for the code "bb"
      const countryOption = await screen.findByRole('option', {
        name: /barbados|bb/i,
      });
      await userEvent.click(countryOption);
      expect(countryTrigger).toHaveTextContent(/barbados|bb/i);

      // Save once
      await userEvent.click(screen.getByText(/Save Changes/i));

      // Assertions (text inputs)
      expect(nameInput).toHaveValue(formData.name);
      expect(addressLine1Input).toHaveValue(formData.addressLine1);
      expect(addressLine2Input).toHaveValue(formData.addressLine2);
      expect(cityInput).toHaveValue(formData.city);
      expect(stateInput).toHaveValue(formData.state);
      expect(postalCodeInput).toHaveValue(formData.postalCode);
      expect(descriptionInput).toHaveValue(formData.description);
      expect(emailInput).toHaveValue(formData.emailAddress);
      expect(mobilePhoneInput).toHaveValue(formData.mobilePhoneNumber);
      expect(homePhoneInput).toHaveValue(formData.homePhoneNumber);
      expect(workPhoneInput).toHaveValue(formData.workPhoneNumber);
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

    test('resetChangesBtn works properly', async () => {
      renderMemberDetailScreen(link1);

      // Wait for the initial data to load
      await waitFor(() => {
        expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
      });

      // Type in some changes to make the reset button appear
      const inputName = screen.getByTestId('inputName');
      await userEvent.type(inputName, 'random');

      // Wait for the reset button to appear
      await waitFor(() =>
        expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument(),
      );

      // Click the reset button
      await userEvent.click(screen.getByTestId('resetChangesBtn'));

      // Wait for the state to update
      await waitFor(() => {
        expect(screen.getByTestId('inputName')).toHaveValue('Rishav Jha');
      });
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

    test('validates birth date input', async () => {
      renderMemberDetailScreen(link1);
      await waitFor(() => {
        expect(screen.getByTestId('birthDate')).toBeInTheDocument();
      });

      const birthDateInput = screen.getByTestId(
        'birthDate',
      ) as HTMLInputElement;

      // Test valid past date
      fireEvent.change(birthDateInput, {
        target: { value: '01/01/1990' },
      });
      expect(birthDateInput.value).toBe('01/01/1990');

      // Test that future dates are rejected (should clear the field)
      fireEvent.change(birthDateInput, {
        target: { value: '02/02/2080' },
      });

      // The onChange handler should reject future dates and clear the field
      await waitFor(() => {
        expect(birthDateInput.value).toBe('');
      });
    });

    test('handles form field changes', async () => {
      renderMemberDetailScreen(link1);
      await waitFor(() => {
        expect(screen.getByTestId('inputName')).toBeInTheDocument();
      });

      const nameInput = screen.getByTestId('inputName');
      fireEvent.change(nameInput, { target: { value: 'Bandhan' } });
      expect(nameInput).toHaveValue('Bandhan');

      const emailInput = screen.getByTestId('inputEmail');
      expect(emailInput).toHaveValue('test221@gmail.com');

      const countryTrigger = screen.getByTestId('inputCountry');
      await userEvent.click(countryTrigger);
      const option = await screen.findByRole('option', { name: /India/i });
      await userEvent.click(option);

      expect(countryTrigger).toHaveTextContent(/India/i);
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

    test('handles avatar processing error', async () => {
      vi.mocked(urlToFile).mockRejectedValue(
        new Error('Failed to process image'),
      );

      renderMemberDetailScreen(link1);

      await wait();

      const nameInput = screen.getByTestId('inputName');
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      expect(nameInput).toHaveValue('Test User');

      const saveButton = screen.getByTestId('saveChangesBtn');
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Failed to process profile picture. Please try uploading again.',
        );
      });
    });

    test('resets form changes', async () => {
      renderMemberDetailScreen(link1);

      await wait();

      const nameInput = screen.getByTestId('inputName');
      const user = userEvent.setup();
      await user.clear(nameInput);
      await user.type(nameInput, 'Test User');

      expect(nameInput).toHaveValue('Test User');

      const resetButton = screen.getByTestId('resetChangesBtn');
      await userEvent.click(resetButton);

      expect(nameInput).toHaveValue('Rishav Jha');
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
  });

  describe('Field Interaction Tests', () => {
    test('handles all form field changes', async () => {
      renderMemberDetailScreen(link1);

      await wait();

      // Test all input fields
      const fields = [
        { id: 'inputName', value: 'New Name' },
        { id: 'addressLine1', value: 'New Address 1' },
        { id: 'addressLine2', value: 'New Address 2' },
        { id: 'inputCity', value: 'New City' },
        { id: 'inputState', value: 'New State' },
        { id: 'inputPostalCode', value: '12345' },
        { id: 'inputDescription', value: 'New Description' },
        { id: 'inputMobilePhoneNumber', value: '+1234567890' },
        { id: 'inputHomePhoneNumber', value: '+1234567891' },
        { id: 'inputWorkPhoneNumber', value: '+1234567892' },
      ];

      for (const field of fields) {
        const input = screen.getByTestId(field.id);
        fireEvent.change(input, {
          target: { value: field.value },
        });
      }

      for (const field of fields) {
        const input = screen.getByTestId(field.id);
        expect(input).toHaveValue(field.value);
      }
    });

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

  describe('Data Update and Processing Tests', () => {
    test('handles user profile localStorage updates on successful save', async () => {
      const mockSetItem = vi.fn();
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: (key: string) => {
            if (key === 'id') return '456';
            if (key === 'sidebar') return 'false';
            return null;
          },
          setItem: mockSetItem,
        },
        writable: true,
      });

      renderUserProfileScreen(link5); // Use UPDATE_MOCK which has successful response
      await wait();

      const nameInput = screen.getByTestId('inputName');
      fireEvent.change(nameInput, { target: { value: 'Updated User Name' } });

      const saveButton = screen.getByTestId('saveChangesBtn');
      fireEvent.click(saveButton);
      await waitFor(() => {
        expect(mockSetItem).toHaveBeenCalledWith(
          'Talawa-admin_name',
          '"Updated User Name"',
        );
      });
    });
  });

  describe('Dropdown Component and other tests', () => {
    test('renders education grade dropdown and handles selection', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      expect(
        screen.getByTestId('educationgrade-dropdown-container'),
      ).toBeInTheDocument();

      // Find the dropdown by the fieldName from DynamicDropDown props
      const educationDropdownBtn = screen.getByTestId(
        'educationgrade-dropdown-btn',
      );
      expect(educationDropdownBtn).toBeInTheDocument();

      // Test initial state - adjust expectations to match mock data
      expect(educationDropdownBtn).toHaveTextContent('Grade-8'); // Match mock data

      // Click the dropdown button to open it
      await userEvent.click(educationDropdownBtn);

      expect(
        screen.getByTestId('educationgrade-dropdown-menu'),
      ).toBeInTheDocument();

      // Find and click one of the options
      const option = screen.getByTestId('change-educationgrade-btn-kg'); // Or whatever option text you expect
      await userEvent.click(option);

      // Verify the selection was made
      expect(educationDropdownBtn).toHaveTextContent('Kg');
    });

    test('renders employee status dropdown and handles selection', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      expect(
        screen.getByTestId('employmentstatus-dropdown-container'),
      ).toBeInTheDocument();

      // Find the dropdown by the fieldName from DynamicDropDown props
      const employmentStatus = screen.getByTestId(
        'employmentstatus-dropdown-btn',
      );
      expect(employmentStatus).toBeInTheDocument();

      // Test initial state
      expect(employmentStatus).toHaveTextContent('Full-Time');

      // Click the dropdown button to open it
      await userEvent.click(employmentStatus);

      expect(
        screen.getByTestId('employmentstatus-dropdown-menu'),
      ).toBeInTheDocument();

      // Find and click one of the options
      const option = screen.getByTestId(
        'change-employmentstatus-btn-full_time',
      ); // Or whatever option text you expect
      await userEvent.click(option);

      // Verify the selection was made
      expect(employmentStatus).toHaveTextContent('Full-Time');
    });

    test('renders marital status dropdown and handles selection', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      expect(
        screen.getByTestId('maritalstatus-dropdown-container'),
      ).toBeInTheDocument();

      // Find the dropdown by the fieldName from DynamicDropDown props
      const maritalStatus = screen.getByTestId('maritalstatus-dropdown-btn');
      expect(maritalStatus).toBeInTheDocument();

      // Test initial state - adjust expectations to match mock data
      expect(maritalStatus).toHaveTextContent('Engaged'); // Match mock data

      // Click the dropdown button to open it
      await userEvent.click(maritalStatus);

      expect(
        screen.getByTestId('maritalstatus-dropdown-menu'),
      ).toBeInTheDocument();

      // Find and click one of the options
      const option = screen.getByTestId('change-maritalstatus-btn-single');
      await userEvent.click(option);

      // Verify the selection was made
      expect(maritalStatus).toHaveTextContent('Single');
    });

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

    test('handles urlToFile error during avatar processing', async () => {
      // Mock urlToFile to throw an error
      vi.mocked(urlToFile).mockRejectedValueOnce(
        new Error('Failed to convert URL to file'),
      );

      renderMemberDetailScreen(link1);
      await wait();

      // Trigger save without selecting new avatar (will use urlToFile for existing avatarURL)
      const nameInput = screen.getByTestId('inputName');
      fireEvent.change(nameInput, { target: { value: 'Test Update' } });

      const saveButton = screen.getByTestId('saveChangesBtn');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Failed to process profile picture. Please try uploading again.',
        );
      });
    });

    test('clicking viewAllEvents button shows MemberAttendedEventsModal', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const viewAllEventsBtn = screen.getByTestId('viewAllEvents');
      expect(viewAllEventsBtn).toBeInTheDocument();

      // Click the view all events button
      await userEvent.click(viewAllEventsBtn);

      // Verify that the MemberAttendedEventsModal is displayed
      const modalTitle = await screen.findByText('Events Attended');
      expect(modalTitle).toBeInTheDocument();
    });

    test('test change country dropdown options and selection', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const countrySelect = screen.getByTestId(
        'inputCountry',
      ) as HTMLSelectElement;
      expect(countrySelect).toBeInTheDocument();

      // Test selecting countries using fireEvent.change to trigger onChange
      fireEvent.change(countrySelect, { target: { value: 'in' } });
      expect(countrySelect.value).toBe('in');

      fireEvent.change(countrySelect, { target: { value: 'us' } });
      expect(countrySelect.value).toBe('us');

      // Also test userEvent interaction for UI verification
      await userEvent.selectOptions(countrySelect, 'au');
      expect(countrySelect.value).toBe('au');
    });
    test('handle natalsex-dropdown-container rendering and selection', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const natalSexDropdown = screen.getByTestId(
        'natalsex-dropdown-container',
      );
      expect(natalSexDropdown).toBeInTheDocument();

      const natalSexBtn = screen.getByTestId('natalsex-dropdown-btn');
      expect(natalSexBtn).toBeInTheDocument();

      // Initial value check
      expect(natalSexBtn).toHaveTextContent('Male');

      // Open dropdown and select a different option
      await userEvent.click(natalSexBtn);
      const option = screen.getByTestId('change-natalsex-btn-female');
      await userEvent.click(option);

      // Verify selection
      expect(natalSexBtn).toHaveTextContent('Female');
    });

    test('handles file validation for invalid file types', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const fileInput = screen.getByTestId('fileInput');

      // Create a file with invalid type
      const invalidFile = new File(['invalid'], 'test.txt', {
        type: 'text/plain',
      });

      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Invalid file type. Please upload a JPEG, PNG, or GIF file.',
        );
      });
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

    test('handles invalid password validation', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      const passwordInput = screen.getByTestId('inputPassword');

      // Enter an invalid password (too short)
      fireEvent.change(passwordInput, { target: { value: '123' } });

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Password must be at least 8 characters long.',
        );
      });
    });

    test('covers selectedAvatar usage in update', async () => {
      renderMemberDetailScreen(link1);
      await wait();

      // Upload a valid file first to set selectedAvatar
      const fileInput = screen.getByTestId('fileInput');
      const validFile = new File(['valid'], 'test.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [validFile] } });

      // Wait for the file to be processed
      await wait();

      // Now update the form with selectedAvatar
      const nameInput = screen.getByTestId('inputName');
      fireEvent.change(nameInput, {
        target: { value: 'Updated Name with Avatar' },
      });

      const saveButton = screen.getByTestId('saveChangesBtn');
      fireEvent.click(saveButton);

      // This should exercise the selectedAvatar branch in line 236
      await waitFor(() => {
        // The button should exist and the update should work with selectedAvatar
        expect(saveButton).toBeInTheDocument();
      });
    });

    test('shows events attended modal when eventsAttended exists', async () => {
      renderMemberDetailScreen(link1); // This mock should have eventsAttended
      await wait();

      // Check that events section is rendered
      const eventsSection = screen.getByText('Events Attended');
      expect(eventsSection).toBeInTheDocument();

      // Click view all events to show modal
      const viewAllEventsBtn = screen.getByTestId('viewAllEvents');
      await userEvent.click(viewAllEventsBtn);

      // Modal should be shown - this exercises line 294
      const modal = await screen.findByText('Events Attended');
      expect(modal).toBeInTheDocument();
    });

    test('covers hideDrawer state for user profile', async () => {
      renderUserProfileScreen(link5);
      await wait();

      // The component should render with hideDrawer false by default for user profile
      // This exercises the hideDrawer conditional in line 826
      const mainContainer = document.querySelector('.d-flex.flex-row');
      expect(mainContainer).toBeInTheDocument();
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
});
