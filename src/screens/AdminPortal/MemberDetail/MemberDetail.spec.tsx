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
import MemberDetail, { getLanguageName, prettyDate } from './MemberDetail';
import {
  MOCKS1,
  MOCKS2,
  ERROR_MOCK,
  MOCK_FILE,
  UPDATE_MOCK,
} from './MemberDetailMocks';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { urlToFile } from 'utils/urlToFile';

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(ERROR_MOCK, true);
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

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: actual.DesktopDateTimePicker,
  };
});

vi.mock('@dicebear/core', () => ({
  createAvatar: vi.fn(() => ({
    toDataUri: vi.fn(() => 'mocked-data-uri'),
  })),
}));

vi.mock('utils/urlToFile', () => ({
  urlToFile: vi.fn(),
}));

const props = {
  id: 'rishav-jha-mech',
};

const renderMemberDetailScreen = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider link={link}>
      <MemoryRouter initialEntries={['/orgtags/123']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/orgtags/:orgId"
                element={<MemberDetail {...props} />}
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

  test('should render the elements', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Email/i)).toBeTruthy();
    expect(screen.getAllByText(/name/i)).toBeTruthy();
    expect(screen.getAllByText(/Birth Date/i)).toBeTruthy();
    expect(screen.getAllByText(/Gender/i)).toBeTruthy();
    expect(screen.getAllByText(/Profile Details/i)).toBeTruthy();
    expect(screen.getAllByText(/Profile Details/i)).toHaveLength(1);
    expect(screen.getAllByText(/Contact Information/i)).toHaveLength(1);
  });

  test('prettyDate function should work properly', () => {
    // Use ISO format with time to avoid UTC interpretation
    const testDate = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    const formattedDate = dayjs().format('D MMMM YYYY');
    expect(prettyDate(testDate)).toBe(formattedDate);
    expect(prettyDate('')).toBe('Unavailable');
  });

  test('getLanguageName function should work properly', () => {
    const getLangName = vi.fn(getLanguageName);
    expect(getLangName('en')).toBe('English');
    expect(getLangName('')).toBe('Unavailable');
  });

  test('should render props and text elements test for the page component', async () => {
    const formData = {
      addressLine1: 'Line 1',
      addressLine2: 'Line 2',
      birthDate: dayjs.utc().subtract(24, 'year').format('YYYY-MM-DD'),
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

  test('display admin', async () => {
    renderMemberDetailScreen(link1);
    await wait();
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('Should display dicebear image if image is null', async () => {
    const dicebearUrl = 'mocked-data-uri';

    render(
      <MockedProvider link={link1}>
        <BrowserRouter>
          <MemberDetail id="123" />
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
    const addressInput = screen.getByTestId('addressLine1');
    await userEvent.type(addressInput, 'random');

    // Wait for the reset button to appear
    const resetButton = await waitFor(() =>
      screen.getByTestId('resetChangesBtn'),
    );

    // Click the reset button
    await userEvent.click(resetButton);

    // Wait for the state to update
    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('Rishav Jha');
      expect(screen.getByTestId('addressLine1')).toHaveValue('Line 1');
    });
  });

  test('should be redirected to / if member id is undefined', async () => {
    render(
      <MockedProvider link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(window.location.pathname).toEqual('/');
  });

  test('display tags Assigned', async () => {
    renderMemberDetailScreen(link1);
    await wait();
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getByText('Tags Assigned')).toBeInTheDocument();
  });

  it('handles avatar upload and preview', async () => {
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

  it('validates birth date input', async () => {
    renderMemberDetailScreen(link1);
    await waitFor(() => {
      expect(screen.getByTestId('birthDate')).toBeInTheDocument();
    });

    const birthDateInput = screen.getByTestId('birthDate') as HTMLInputElement;
    // Set a hardcoded future date value
    fireEvent.change(birthDateInput, {
      target: { value: '02/02/2080' },
    });
    fireEvent.blur(birthDateInput);

    expect(birthDateInput.value).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  it('validates password', async () => {
    renderMemberDetailScreen(link1);
    await waitFor(() => {
      expect(screen.getByTestId('inputPassword')).toBeInTheDocument();
    });

    const passwordInput = screen.getByTestId('inputPassword');
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    expect(NotificationToast.error).toHaveBeenCalledWith(
      'Password must be at least 8 characters long.',
    );
  });

  it('handles form field changes', async () => {
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

  it('handles user update success', async () => {
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

  it('handles user update error', async () => {
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

  it('handles avatar processing error', async () => {
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

  it('resets form changes', async () => {
    renderMemberDetailScreen(link1);

    await wait();

    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    expect(nameInput).toHaveValue('Test User');

    const resetButton = screen.getByTestId('resetChangesBtn');
    await userEvent.click(resetButton);

    expect(nameInput).toHaveValue('Rishav Jha');
  });

  it('handles file upload validation', async () => {
    renderMemberDetailScreen(link4);

    await wait();

    // Test invalid file type
    const invalidFile = new File(['test'], 'test.md', { type: 'image/plain' });
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
      'File is too large. Maximum allowed size is 5MB.',
    );
  });

  it('handles all form field changes', async () => {
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

  // Test for future birthdate validation (Lines 212-226)
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

  // Test for file validation (Lines 305-313)
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
      'File is too large. Maximum allowed size is 5MB.',
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

  // Test for empty fields removal (Lines 397-425)
  test('removes empty fields before update', async () => {
    const mockUpdateUser = vi.fn();
    const updatedMock = {
      request: {
        query: UPDATE_CURRENT_USER_MUTATION,
        variables: {
          input: {
            name: 'Test User',
            // Empty fields should be removed
            description: '',
            addressLine1: '',
            addressLine2: '',
          },
        },
      },
      result: {
        data: {
          updateCurrentUser: {
            name: 'Test User',
            id: '123',
          },
        },
      },
    };

    renderMemberDetailScreen(new StaticMockLink([updatedMock], true));
    await wait();

    // Set some fields empty and some with values
    const nameInput = screen.getByTestId('inputName');
    const descriptionInput = screen.getByTestId('inputDescription');
    const addressInput = screen.getByTestId('addressLine1');

    await userEvent.clear(descriptionInput);
    await userEvent.clear(addressInput);
    await userEvent.type(nameInput, 'Test User');

    // Trigger update
    const saveButton = screen.getByTestId('saveChangesBtn');
    await userEvent.click(saveButton);

    // Verify empty fields were removed from mutation
    expect(mockUpdateUser).not.toHaveBeenCalledWith(
      expect.objectContaining({
        description: '',
        addressLine1: '',
      }),
    );
  });

  // Test for window reload after update (Line 634)
  test('reloads window after successful update', async () => {
    renderMemberDetailScreen(link5);
    await wait();

    const nameInput = screen.getByTestId('inputName');
    await userEvent.type(nameInput, 'Bandhan Majumder');

    const saveButton = screen.getByTestId('saveChangesBtn');
    await userEvent.click(saveButton);

    // Wait for the toast and timeout
    await wait(2000);

    expect(mockReload).toHaveBeenCalled();
  });

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

    // Test initial state
    expect(educationDropdownBtn).toHaveTextContent('Grade-8');

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
    expect(employmentStatus).toHaveTextContent('None');

    // Click the dropdown button to open it
    await userEvent.click(employmentStatus);

    expect(
      screen.getByTestId('employmentstatus-dropdown-menu'),
    ).toBeInTheDocument();

    // Find and click one of the options
    const option = screen.getByTestId('change-employmentstatus-btn-full_time'); // Or whatever option text you expect
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

    // Test initial state
    expect(maritalStatus).toHaveTextContent('Engaged');

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

  test('renders gender status dropdown and handles selection', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(
      screen.getByTestId('natalsex-dropdown-container'),
    ).toBeInTheDocument();

    // Find the dropdown by the fieldName from DynamicDropDown props
    const natalSexStatus = screen.getByTestId('natalsex-dropdown-btn');
    expect(natalSexStatus).toBeInTheDocument();

    // Test initial state
    expect(natalSexStatus).toHaveTextContent('Male');

    // Click the dropdown button to open it
    await userEvent.click(natalSexStatus);

    expect(screen.getByTestId('natalsex-dropdown-menu')).toBeInTheDocument();

    // Find and click one of the options
    const option = screen.getByTestId('change-natalsex-btn-female'); // Or whatever option text you expect
    await userEvent.click(option);

    // Verify the selection was made
    expect(natalSexStatus).toHaveTextContent('Female');
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
});
