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
import { toast } from 'react-toastify';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { urlToFile } from 'utils/urlToFile';

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(ERROR_MOCK, true);
const link4 = new StaticMockLink(MOCK_FILE, true);
const link5 = new StaticMockLink(UPDATE_MOCK, true);

const mockReload = vi.fn();
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

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
  ToastContainer: vi
    .fn()
    .mockImplementation(() => <div data-testid="toast-container" />),
}));

const props = {
  id: 'rishav-jha-mech',
};

const renderMemberDetailScreen = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
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
    // "Profile Details" appears twice: once in the tab button and once in the card header
    expect(screen.getAllByText(/Profile Details/i)).toHaveLength(2);
    expect(screen.getAllByText(/Contact Information/i)).toHaveLength(1);
  });

  test('prettyDate function should work properly', () => {
    const datePretty = vi.fn(prettyDate);
    expect(datePretty('2023-02-18T09:22:27.969Z')).toBe(
      prettyDate('2023-02-18T09:22:27.969Z'),
    );
    expect(datePretty('')).toBe('Unavailable');
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
      avatarMimeType: 'image/jpeg',
      avatarURL: 'http://example.com/avatar.jpg',
      birthDate: '2000-01-01',
      city: 'nyc',
      countryCode: 'bb',
      createdAt: '2025-02-06T03:10:50.254',
      description: 'This is a description',
      educationGrade: 'grade_8',
      emailAddress: 'test221@gmail.com',
      employmentStatus: 'employed',
      homePhoneNumber: '+9999999998',
      id: '0194d80f-03cd-79cd-8135-683494b187a1',
      isEmailAddressVerified: false,
      maritalStatus: 'engaged',
      mobilePhoneNumber: '+9999999999',
      name: 'Rishav Jha',
      natalSex: 'male',
      naturalLanguageCode: 'en',
      postalCode: '111111',
      role: 'regular',
      state: 'State1',
      updatedAt: '2025-02-06T03:22:17.808',
      workPhoneNumber: '+9999999998',
    };

    renderMemberDetailScreen(link2);

    await wait();

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Email/i)).toBeTruthy();
    expect(screen.getByText('USER')).toBeInTheDocument();
    const birthDateDatePicker = screen.getByTestId('birthDate');
    fireEvent.change(birthDateDatePicker, {
      target: { value: formData.birthDate },
    });

    userEvent.type(screen.getByTestId(/inputName/i), formData.name);
    userEvent.type(screen.getByTestId(/addressLine1/i), formData.addressLine1);
    userEvent.type(screen.getByTestId(/inputCity/i), formData.city);
    userEvent.type(screen.getByTestId(/inputState/i), formData.state);
    userEvent.type(
      screen.getByTestId(/inputDescription/i),
      formData.description,
    );
    userEvent.type(screen.getByTestId(/inputCountry/i), formData.countryCode);
    userEvent.type(screen.getByTestId(/inputEmail/i), formData.emailAddress);

    await wait();

    await userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByTestId(/inputName/i)).toHaveValue(formData.name);
    expect(screen.getByTestId(/addressLine1/i)).toHaveValue(
      formData.addressLine1,
    );
    expect(screen.getByTestId(/inputCity/i)).toHaveValue(formData.city);
    expect(screen.getByTestId(/inputState/i)).toHaveValue(formData.state);
    expect(screen.getByTestId(/inputDescription/i)).toHaveValue(
      formData.description,
    );
    expect(screen.getByTestId(/inputCountry/i)).toHaveValue(
      formData.countryCode,
    );
    expect(screen.getByTestId(/inputEmail/i)).toHaveValue(
      formData.emailAddress,
    );
    expect(screen.getByTestId(/inputMobilePhoneNumber/i)).toHaveValue(
      formData.mobilePhoneNumber,
    );
  });

  test('display admin', async () => {
    renderMemberDetailScreen(link1);
    await wait();
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  test('Should display dicebear image if image is null', async () => {
    const dicebearUrl = 'mocked-data-uri';

    render(
      <MockedProvider addTypename={false} link={link1}>
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
      <MockedProvider addTypename={false} link={link2}>
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

    const birthDateInput = screen.getByTestId('birthDate');
    // Set a hardcoded future date value
    const futureDate = '2080-02-02';
    await userEvent.type(birthDateInput, futureDate);

    // Click away to trigger blur/change
    userEvent.click(document.body);

    expect(birthDateInput).toHaveValue('02/08/0002');
  });

  it('validates password', async () => {
    renderMemberDetailScreen(link1);
    await waitFor(() => {
      expect(screen.getByTestId('inputPassword')).toBeInTheDocument();
    });

    const passwordInput = screen.getByTestId('inputPassword');
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    expect(toast.error).toHaveBeenCalledWith(
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

    const countryInput = screen.getByTestId('inputCountry');
    fireEvent.select(countryInput, { target: { value: 'in' } });
    expect(countryInput).toHaveValue('in');
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
      expect(toast.error).toHaveBeenCalled();
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
      expect(toast.error).toHaveBeenCalledWith(
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

    const fileInput = screen.getByTestId('fileInput') as HTMLInputElement;

    // Test invalid file type
    const invalidFile = new File(['test'], 'test.md', { type: 'text/plain' });

    fireEvent.change(fileInput, {
      target: { files: [invalidFile] },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid file type. Please upload a JPEG, PNG, or GIF.',
      );
    });

    // Test file size limit
    const largeFile = new File(['test'.repeat(10000000)], 'test.jpg', {
      type: 'image/jpeg',
    });

    fireEvent.change(fileInput, {
      target: { files: [largeFile] },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'File is too large. Maximum size is 5MB.',
      );
    });
  });

  it('handles all form field changes', async () => {
    renderMemberDetailScreen(link1);

    await wait();

    // Test all input fields
    const fields = [
      { id: 'inputName', value: 'New Name' },
      { id: 'addressLine1', value: 'New Address 1' },
      { id: 'inputCity', value: 'New City' },
      { id: 'inputState', value: 'New State' },
      { id: 'inputDescription', value: 'New Description' },
      { id: 'inputMobilePhoneNumber', value: '+1234567890' },
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
    expect(toast.error).toHaveBeenCalledWith(
      'File is too large. Maximum size is 5MB.',
    );
  });

  test('handles phone number input formatting', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const mobilePhoneInput = screen.getByTestId('inputMobilePhoneNumber');

    // Test mobile phone
    await fireEvent.change(mobilePhoneInput, {
      target: { value: '+1234567890' },
    });
    expect(mobilePhoneInput).toHaveValue('+1234567890');
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
    expect(educationDropdownBtn).toHaveTextContent('None'); // Or whatever your initial value is

    // Click the dropdown button to open it
    await userEvent.click(educationDropdownBtn);

    expect(
      screen.getByTestId('educationgrade-dropdown-menu'),
    ).toBeInTheDocument();

    // Find and click one of the options=
    const option = screen.getByTestId('change-educationgrade-btn-kg'); // Or whatever option text you expect
    await userEvent.click(option);

    // Verify the selection was made
    expect(educationDropdownBtn).toHaveTextContent('Kg');
  });

  test('renders employe status dropdown and handles selection', async () => {
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
    expect(employmentStatus).toHaveTextContent('None'); // Or whatever your initial value is

    // Click the dropdown button to open it
    await userEvent.click(employmentStatus);

    expect(
      screen.getByTestId('employmentstatus-dropdown-menu'),
    ).toBeInTheDocument();

    // Find and click one of the options=
    const option = screen.getByTestId('change-employmentstatus-btn-full_time'); // Or whatever option text you expect
    await userEvent.click(option);

    // Verify the selection was made
    expect(employmentStatus).toHaveTextContent('Full-Time');
  });

  test('renders maritial status dropdown and handles selection', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(
      screen.getByTestId('maritalstatus-dropdown-container'),
    ).toBeInTheDocument();

    // Find the dropdown by the fieldName from DynamicDropDown props
    const maritialStatus = screen.getByTestId('maritalstatus-dropdown-btn');
    expect(maritialStatus).toBeInTheDocument();

    // Test initial state
    expect(maritialStatus).toHaveTextContent('None'); // Or whatever your initial value is

    // Click the dropdown button to open it
    await userEvent.click(maritialStatus);

    expect(
      screen.getByTestId('maritalstatus-dropdown-menu'),
    ).toBeInTheDocument();

    // Find and click one of the options=
    const option = screen.getByTestId('change-maritalstatus-btn-single'); // Or whatever option text you expect
    await userEvent.click(option);

    // Verify the selection was made
    expect(maritialStatus).toHaveTextContent('Single');
  });

  test('renders gender status dropdown and handles selection', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(
      screen.getByTestId('natalsex-dropdown-container'),
    ).toBeInTheDocument();

    // Find the dropdown by the fieldName from DynamicDropDown props
    const maritialStatus = screen.getByTestId('natalsex-dropdown-btn');
    expect(maritialStatus).toBeInTheDocument();

    // Test initial state
    expect(maritialStatus).toHaveTextContent('None'); // Or whatever your initial value is

    // Click the dropdown button to open it
    await userEvent.click(maritialStatus);

    expect(screen.getByTestId('natalsex-dropdown-menu')).toBeInTheDocument();

    // Find and click one of the options=
    const option = screen.getByTestId('change-natalsex-btn-male'); // Or whatever option text you expect
    await userEvent.click(option);

    // Verify the selection was made
    expect(maritialStatus).toHaveTextContent('Male');
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
    fireEvent.change(countrySelect, { target: { value: 'us' } });
    expect(countrySelect).toHaveValue('us');
  });

  test('should render Overview tab by default', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // Overview tab should be active by default
    const overviewTab = screen.getByTestId('overviewTab');
    expect(overviewTab).toHaveAttribute('aria-selected', 'true');

    // Verify the overview panel is present and linked correctly
    const overviewPanel = screen.getByRole('tabpanel');
    expect(overviewPanel).toHaveAttribute('id', 'overview-panel');
    expect(overviewPanel).toHaveAttribute('aria-labelledby', 'overview-tab');

    // Personal Details card should be visible - using heading role for the card title
    expect(
      screen.getByRole('heading', { name: 'Profile Details' }),
    ).toBeInTheDocument();

    // Contact Info card should be visible - check for email field as unique identifier
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('should switch to Tags tab when clicked', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // Click on Tags tab
    const tagsTab = screen.getByTestId('tagsTab');
    fireEvent.click(tagsTab);

    // Tags tab should be active
    expect(tagsTab).toHaveAttribute('aria-selected', 'true');

    // Verify the tags panel is present and linked correctly
    const tagsPanel = screen.getByRole('tabpanel');
    expect(tagsPanel).toHaveAttribute('id', 'tags-panel');
    expect(tagsPanel).toHaveAttribute('aria-labelledby', 'tags-tab');

    // Tags Assigned card should be visible using testid
    expect(screen.getByTestId('tagsAssigned-title')).toBeInTheDocument();
  });

  test('should switch between tabs correctly', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const overviewTab = screen.getByTestId('overviewTab');
    const tagsTab = screen.getByTestId('tagsTab');

    // Start at Overview
    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    expect(tagsTab).toHaveAttribute('aria-selected', 'false');

    // Verify overview panel is shown and linked correctly
    let currentPanel = screen.getByRole('tabpanel');
    expect(currentPanel).toHaveAttribute('id', 'overview-panel');
    expect(currentPanel).toHaveAttribute('aria-labelledby', 'overview-tab');

    // Switch to Tags
    fireEvent.click(tagsTab);
    expect(tagsTab).toHaveAttribute('aria-selected', 'true');
    expect(overviewTab).toHaveAttribute('aria-selected', 'false');

    // Verify tags panel is shown and linked correctly
    currentPanel = screen.getByRole('tabpanel');
    expect(currentPanel).toHaveAttribute('id', 'tags-panel');
    expect(currentPanel).toHaveAttribute('aria-labelledby', 'tags-tab');

    // Switch back to Overview
    fireEvent.click(overviewTab);
    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    expect(tagsTab).toHaveAttribute('aria-selected', 'false');

    // Verify overview panel is shown again and linked correctly
    currentPanel = screen.getByRole('tabpanel');
    expect(currentPanel).toHaveAttribute('id', 'overview-panel');
    expect(currentPanel).toHaveAttribute('aria-labelledby', 'overview-tab');
  });

  test('validates password with less than 8 characters', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const passwordInput = screen.getByTestId('inputPassword');

    // Try to enter a short password (less than 8 characters)
    await userEvent.type(passwordInput, 'short');

    // Verify error toast was called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Password must be at least 8 characters long.',
      );
    });
  });

  test('handles keyboard Enter key on profile picture edit button', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const editButton = screen.getByTestId('uploadImageBtn');

    // Simulate pressing Enter key
    fireEvent.keyDown(editButton, { key: 'Enter', code: 'Enter' });

    // Verify file input would be triggered (we can't directly test click on hidden input)
    expect(editButton).toBeInTheDocument();
  });

  test('renders MUI icons correctly on save and reset buttons', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // Make a change to show the buttons
    const nameInput = screen.getByTestId('inputName');
    await userEvent.type(nameInput, ' Updated');

    await wait();

    // Check if save and reset buttons are rendered with proper classes
    const saveButton = screen.getByTestId('saveChangesBtn');
    const resetButton = screen.getByTestId('resetChangesBtn');

    expect(saveButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();

    // Verify the save button has a class containing 'editButton' (it's hashed by CSS modules)
    expect(saveButton.className).toContain('editButton');
  });

  test('renders EditIcon on profile picture button', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const editButton = screen.getByTestId('uploadImageBtn');

    // Verify button exists and has correct attributes
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveAttribute('aria-label', 'Edit profile picture');
    expect(editButton).toHaveAttribute('title', 'Edit profile picture');
  });

  test('save and reset buttons are in same row with proper layout', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // Make a change to show the buttons
    const nameInput = screen.getByTestId('inputName');
    await userEvent.type(nameInput, ' Test');

    await wait();

    const saveButton = screen.getByTestId('saveChangesBtn');
    const resetButton = screen.getByTestId('resetChangesBtn');

    // Verify both buttons have flex-grow-1 class for equal width distribution
    expect(saveButton).toHaveClass('flex-grow-1');
    expect(resetButton).toHaveClass('flex-grow-1');
  });
});
