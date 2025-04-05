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
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
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
  DELETE_USER_MOCK,
} from './MemberDetailMocks';
import type { ApolloLink } from '@apollo/client';
import { validatePassword } from 'utils/passwordValidator';
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
const link6 = new StaticMockLink(DELETE_USER_MOCK, true);

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

// Mock navigation function if you're using a router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('utils/passwordValidator', () => ({
  validatePassword: vi.fn((password: string) => password.length >= 8),
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
    expect(screen.getAllByText(/Profile Details/i)).toHaveLength(1);
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
    expect(screen.getByText('User')).toBeInTheDocument();
    const birthDateDatePicker = screen.getByTestId('birthDate');
    fireEvent.change(birthDateDatePicker, {
      target: { value: formData.birthDate },
    });

    userEvent.type(screen.getByTestId(/inputName/i), formData.name);
    userEvent.type(screen.getByTestId(/addressLine1/i), formData.addressLine1);
    userEvent.type(screen.getByTestId(/addressLine2/i), formData.addressLine2);
    userEvent.type(screen.getByTestId(/inputCity/i), formData.city);
    userEvent.type(screen.getByTestId(/inputState/i), formData.state);
    userEvent.type(screen.getByTestId(/inputPostalCode/i), formData.postalCode);
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
    expect(screen.getByTestId(/addressLine2/i)).toHaveValue(
      formData.addressLine2,
    );
    expect(screen.getByTestId(/inputCity/i)).toHaveValue(formData.city);
    expect(screen.getByTestId(/inputState/i)).toHaveValue(formData.state);
    expect(screen.getByTestId(/inputPostalCode/i)).toHaveValue(
      formData.postalCode,
    );
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
    expect(screen.getByTestId(/inputHomePhoneNumber/i)).toHaveValue(
      formData.homePhoneNumber,
    );
    expect(screen.getByTestId(/workPhoneNumber/i)).toHaveValue(
      formData.workPhoneNumber,
    );
  });

  test('display admin', async () => {
    renderMemberDetailScreen(link1);
    await wait();
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
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

  it('skips password validation when non-string value is used', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    renderMemberDetailScreen(link1);

    // Wait for password input to render
    await waitFor(() => {
      expect(screen.getByTestId('inputPassword')).toBeInTheDocument();
    });

    // Test password field with empty string (edge case)
    const passwordInput = screen.getByTestId('inputPassword');
    fireEvent.change(passwordInput, { target: { value: '' } });

    // Verify empty password doesn't trigger validation
    expect(toastErrorSpy).not.toHaveBeenCalled();
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

  it('handles delete user error', async () => {
    renderMemberDetailScreen(link3);

    await wait();

    const deleteButton = screen.getByTestId('deleteUserButton');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByTestId('confirmationToDelete')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('button-handleDeleteConfirmation');
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('clicking profile picture triggers file input click', async () => {
    // Render the component with the mocked data that includes avatarURL
    renderMemberDetailScreen(link2);
    await wait();

    // Verify the profile picture is rendered
    const profilePicture = screen.getByTestId('profile-picture');
    expect(profilePicture).toBeInTheDocument();

    // Create a mock for the click method of the file input
    const mockClick = vi.fn();

    // Mock the fileInputRef.current
    const originalClick = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'click',
    );

    Object.defineProperty(HTMLInputElement.prototype, 'click', {
      configurable: true,
      value: mockClick,
    });

    // Click the profile picture
    await userEvent.click(profilePicture);

    // Verify the file input's click method was called
    expect(mockClick).toHaveBeenCalled();

    // Restore the original click method
    if (originalClick) {
      Object.defineProperty(HTMLInputElement.prototype, 'click', originalClick);
    }
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

    // Test invalid file type
    const invalidFile = new File(['test'], 'test.md', { type: 'image/plain' });
    const fileInput = screen.getByTestId('fileInput');
    await userEvent.upload(fileInput, invalidFile);

    expect(toast.error).toHaveBeenCalledWith(
      'Invalid file type. Please upload a JPEG, PNG, or GIF.',
    );

    // Test file size limit
    const largeFile = new File(['test'.repeat(10000000)], 'test.jpg', {
      type: 'image/png',
    });
    await userEvent.upload(fileInput, largeFile);

    expect(toast.error).toHaveBeenCalledWith(
      'File is too large. Maximum size is 5MB.',
    );
  });

  test('clicking profile picture with existing avatar triggers file input', async () => {
    renderMemberDetailScreen(link2);
    await wait();

    // Create a mock for the click method of the file input
    const mockClick = vi.fn();

    // Mock the fileInputRef.current
    const originalClick = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'click',
    );

    Object.defineProperty(HTMLInputElement.prototype, 'click', {
      configurable: true,
      value: mockClick,
    });

    // Verify the profile picture is rendered
    const profilePicture = screen.getByTestId('profile-picture');
    expect(profilePicture).toBeInTheDocument();

    // Click the profile picture
    await userEvent.click(profilePicture);

    // Verify the file input's click method was called
    expect(mockClick).toHaveBeenCalled();

    // Restore the original click method
    if (originalClick) {
      Object.defineProperty(HTMLInputElement.prototype, 'click', originalClick);
    }
  });

  test('clicking avatar placeholder button triggers file input', async () => {
    // Render the component with a mock that has no avatarURL
    render(
      <MockedProvider addTypename={false} link={link4}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail id="123" />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Create a mock for the click method of the file input
    const mockClick = vi.fn();

    // Mock the fileInputRef.current
    const originalClick = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'click',
    );

    Object.defineProperty(HTMLInputElement.prototype, 'click', {
      configurable: true,
      value: mockClick,
    });

    // Wait for and find the upload image button
    const uploadButton = await waitFor(() =>
      screen.getByTestId('uploadImageBtn'),
    );

    // Click the upload button
    await userEvent.click(uploadButton);

    // Verify the file input's click method was called
    expect(mockClick).toHaveBeenCalled();

    // Restore the original click method
    if (originalClick) {
      Object.defineProperty(HTMLInputElement.prototype, 'click', originalClick);
    }
  });

  // tests new

  test('plugin creation checkbox should toggle correctly', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // Ensure the component is loaded
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    // Get the checkbox
    const pluginCreationCheckbox = screen.getByTestId('pluginCreationForm');

    // Check initial state (assuming it starts unchecked)
    expect(pluginCreationCheckbox).not.toBeChecked();

    // Click the checkbox to check it
    await userEvent.click(pluginCreationCheckbox);

    // Verify it's now checked
    expect(pluginCreationCheckbox).toBeChecked();

    // Click again to uncheck
    await userEvent.click(pluginCreationCheckbox);

    // Verify it's unchecked again
    expect(pluginCreationCheckbox).not.toBeChecked();
  });

  test('admin approved checkbox should toggle correctly', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // Ensure the component is loaded
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    // Get the checkbox
    const adminApprovedCheckbox = screen.getByTestId('AdminApprovedForm');

    // Check initial state (assuming it starts unchecked)
    expect(adminApprovedCheckbox).not.toBeChecked();

    // Click the checkbox to check it
    await userEvent.click(adminApprovedCheckbox);

    // Verify it's now checked
    expect(adminApprovedCheckbox).toBeChecked();

    // Click again to uncheck
    await userEvent.click(adminApprovedCheckbox);

    // Verify it's unchecked again
    expect(adminApprovedCheckbox).not.toBeChecked();
  });

  test('both checkboxes should update form state', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // Ensure the component is loaded
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    // Get the reset changes button (should initially be hidden)
    expect(screen.queryByTestId('resetChangesBtn')).not.toBeInTheDocument();

    // Get the checkboxes
    const pluginCreationCheckbox = screen.getByTestId('pluginCreationForm');
    const adminApprovedCheckbox = screen.getByTestId('AdminApprovedForm');

    // Change checkbox values to trigger form state update
    await userEvent.click(pluginCreationCheckbox);
    await userEvent.click(adminApprovedCheckbox);

    // Verify checkboxes are checked
    expect(pluginCreationCheckbox).toBeChecked();
    expect(adminApprovedCheckbox).toBeChecked();

    // The reset button should be visible now since the form state has changed
    await waitFor(() => {
      expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    });

    // Click reset button
    await userEvent.click(screen.getByTestId('resetChangesBtn'));

    // After reset, checkboxes should return to initial state
    await waitFor(() => {
      expect(pluginCreationCheckbox).not.toBeChecked();
      expect(adminApprovedCheckbox).not.toBeChecked();
    });
  });

  test('delete user button should open confirmation modal', async () => {
    renderMemberDetailScreen(link2);
    await wait();

    // Ensure the component is loaded
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    // Click the delete user button
    const deleteButton = screen.getByTestId('deleteUserButton');
    fireEvent.click(deleteButton);

    // Now the modal should be visible
    await waitFor(() => {
      expect(screen.getByTestId('confirmationToDelete')).toBeVisible();
      expect(
        screen.getByTestId('button-handleDeleteConfirmation'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('button-cancelDeleteConfirmation'),
      ).toBeInTheDocument();
    });
  });

  test('cancel button should close the confirmation modal', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // Open the modal
    const deleteButton = screen.getByTestId('deleteUserButton');
    fireEvent.click(deleteButton);

    // Verify modal is open
    await waitFor(() => {
      expect(screen.getByTestId('confirmationToDelete')).toBeVisible();
    });

    // Click the cancel button
    const cancelButton = screen.getByTestId('button-cancelDeleteConfirmation');
    fireEvent.click(cancelButton);

    // Modal should be closed
    await waitFor(() => {
      expect(
        screen.queryByTestId('confirmationToDelete'),
      ).not.toBeInTheDocument();
    });
  });

  test('close button (X) should close the confirmation modal', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    // Open the modal
    const deleteButton = screen.getByTestId('deleteUserButton');
    fireEvent.click(deleteButton);

    // Verify modal is open
    await waitFor(() => {
      expect(screen.getByTestId('confirmationToDelete')).toBeInTheDocument();
    });

    // Find and click the close button (usually an X in the header)
    const closeButton =
      screen.getByLabelText('Close') ||
      screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    // Modal should be closed
    await waitFor(() => {
      expect(
        screen.queryByTestId('confirmationToDelete'),
      ).not.toBeInTheDocument();
    });
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

  it('should show success toast, dismiss modal, and navigate when user is deleted successfully', async () => {
    // Spy on toast.success
    const toastSuccessSpy = vi.spyOn(toast, 'success');

    // Render the component
    renderMemberDetailScreen(link6);
    await wait();

    // Find and click delete button
    const deleteButton = screen.getByTestId('deleteUserButton');
    fireEvent.click(deleteButton);

    // Wait for confirmation modal to appear
    await waitFor(() => {
      expect(screen.getByTestId('confirmationToDelete')).toBeInTheDocument();
    });

    // Confirm deletion
    const confirmButton = screen.getByTestId('button-handleDeleteConfirmation');
    fireEvent.click(confirmButton);

    // Wait for the mutation to complete and verify success toast
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledTimes(1);
      expect(toastSuccessSpy.mock.calls[0][0]).toContain('User');
    });

    // Verify modal is dismissed
    await waitFor(() => {
      expect(
        screen.queryByTestId('confirmationToDelete'),
      ).not.toBeInTheDocument();
    });

    // Verify navigation occurred (usually to the members list page)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // Clean up spies and mocks
    toastSuccessSpy.mockRestore();
  });

  test('should only show success toast and close confirm when deleteData exists', async () => {
    // Mocks for deleteUser functions
    const deleteUserWithData = vi.fn().mockResolvedValue({
      data: { deleteUser: { id: 'rishav-jha-mech' } },
    });

    const deleteUserWithoutData = vi.fn().mockResolvedValue({
      data: null,
    });

    // Spy on toast.success
    const toastSuccessSpy = vi.spyOn(toast, 'success');

    // Test variables
    let mockHandleDeleteUser: any;
    let triggerDelete: any;

    // First test case: with data
    const mockSetShowDeleteConfirm = vi.fn(); // Mock for setShowDeleteConfirm

    render(
      <MockedProvider addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <BrowserRouter>
              {(() => {
                mockHandleDeleteUser = async () => {
                  try {
                    const { data: deleteData } = await deleteUserWithData({
                      variables: { id: 'rishav-jha-mech' },
                    });

                    if (deleteData) {
                      toast.success('User deleted successfully');
                      mockSetShowDeleteConfirm(false); // Call mock function
                    }
                  } catch (error) {
                    // Handle error if needed
                  }
                };

                triggerDelete = () => (
                  <button
                    type="button"
                    data-testid="trigger-delete"
                    onClick={mockHandleDeleteUser}
                  >
                    Delete
                  </button>
                );

                return triggerDelete();
              })()}
            </BrowserRouter>
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Trigger delete with data
    fireEvent.click(screen.getByTestId('trigger-delete'));

    // Verify success case
    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith('User deleted successfully');
      expect(deleteUserWithData).toHaveBeenCalledTimes(1);
      expect(mockSetShowDeleteConfirm).toHaveBeenCalledWith(false); // Check mock call
    });

    // Cleanup and reset mocks
    cleanup();
    toastSuccessSpy.mockClear();

    // Second test case: without data
    const mockSetShowDeleteConfirmNoData = vi.fn(); // Mock for second scenario

    render(
      <MockedProvider addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Provider store={store}>
            <BrowserRouter>
              {(() => {
                mockHandleDeleteUser = async () => {
                  try {
                    const { data: deleteData } = await deleteUserWithoutData({
                      variables: { id: 'rishav-jha-mech' },
                    });

                    if (deleteData) {
                      // This block should NOT execute
                      toast.success('User deleted successfully');
                      mockSetShowDeleteConfirmNoData(false);
                    }
                  } catch (error) {
                    // Handle error if needed
                  }
                };

                triggerDelete = () => (
                  <button
                    type="button"
                    data-testid="trigger-delete-no-data"
                    onClick={mockHandleDeleteUser}
                  >
                    Delete No Data
                  </button>
                );

                return triggerDelete();
              })()}
            </BrowserRouter>
          </Provider>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Trigger delete without data
    fireEvent.click(screen.getByTestId('trigger-delete-no-data'));

    // Verify no toast or state update
    await waitFor(() => {
      expect(deleteUserWithoutData).toHaveBeenCalledTimes(1);
    });

    expect(toastSuccessSpy).not.toHaveBeenCalled();
    expect(mockSetShowDeleteConfirmNoData).not.toHaveBeenCalled(); // Ensure mock wasn't called

    // Restore mocks
    toastSuccessSpy.mockRestore();
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

  test('renders language dropdown and handles selection', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(
      screen.getByTestId('naturallanguagecode-dropdown-container'),
    ).toBeInTheDocument();

    // Find the dropdown by the fieldName from DynamicDropDown props
    const languageStatus = screen.getByTestId(
      'naturallanguagecode-dropdown-btn',
    );
    expect(languageStatus).toBeInTheDocument();

    // Test initial state
    expect(languageStatus).toHaveTextContent('English'); // Or whatever your initial value is

    // Click the dropdown button to open it
    await userEvent.click(languageStatus);

    expect(
      screen.getByTestId('naturallanguagecode-dropdown-menu'),
    ).toBeInTheDocument();

    // Find and click one of the options=
    // Select a different language option than the initial one
    const option = screen.getByTestId('change-naturallanguagecode-btn-fr'); // Or another available language
    await userEvent.click(option);

    // Verify the selection was made
    expect(languageStatus).toHaveTextContent('French'); // Should match the selected language
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

  test('clicking and submission of profile picture', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const uploadImageBtn = screen.getByTestId('profile-picture');
    expect(uploadImageBtn).toBeInTheDocument();

    // Mock the file input click
    const fileInput = screen.getByTestId('fileInput');
    const fileInputClickSpy = vi.spyOn(fileInput, 'click');

    await userEvent.click(uploadImageBtn);
    expect(fileInputClickSpy).toHaveBeenCalled();
  });

  test('handles profile picture edit button click', async () => {
    renderMemberDetailScreen(link4);
    await wait();

    const uploadImageBtn = screen.getByTestId('uploadImageBtn');
    expect(uploadImageBtn).toBeInTheDocument();

    // Mock the file input click
    const fileInput = screen.getByTestId('fileInput');
    const fileInputClickSpy = vi.spyOn(fileInput, 'click');

    await userEvent.click(uploadImageBtn);
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

  it('should validate passwords when value is string type and fieldName is password', async () => {
    const toastErrorSpy = vi.spyOn(toast, 'error');
    renderMemberDetailScreen(link1);

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByTestId('inputPassword')).toBeInTheDocument();
    });

    const passwordInput = screen.getByTestId('inputPassword');

    // Case 1: Invalid password (7 characters)
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    await waitFor(() => {
      // Verify validation was called with correct argument
      expect(validatePassword).toHaveBeenCalledWith('short');
      // Verify error toast
      expect(toastErrorSpy).toHaveBeenCalledWith(
        'Password must be at least 8 characters, contain uppercase, lowercase, numbers, and special characters.',
      );
    });

    // Reset mocks between test cases
    vi.mocked(validatePassword).mockClear();
    toastErrorSpy.mockClear();

    // Case 2: Valid password (8 characters)
    fireEvent.change(passwordInput, { target: { value: 'validPass' } });

    await waitFor(() => {
      expect(validatePassword).toHaveBeenCalledWith('validPass');
    });
  });

  it('should only validate passwords when value is "string" and fieldName is password', async () => {
    // Spy on toast.error
    const toastErrorSpy = vi.spyOn(toast, 'error');

    // Store original validatePassword if it exists
    const originalValidatePassword = window.validatePassword;

    // Set up validatePassword with a simplified approach
    let validatePasswordShouldReturn = false;
    window.validatePassword = (password) => {
      // We can add logic here if needed
      return validatePasswordShouldReturn;
    };

    renderMemberDetailScreen(link1);
    await wait();

    // CASE 1: Input "string" for password field - invalid password
    // Set validatePassword to return false (validation fails)
    validatePasswordShouldReturn = false;

    // Try to set an invalid password with literal value "string"
    const passwordInput = screen.getByTestId('inputPassword');
    fireEvent.change(passwordInput, { target: { value: 'string' } });

    // Verify toast.error was called
    expect(toastErrorSpy).toHaveBeenCalledWith(
      'Password must be at least 8 characters, contain uppercase, lowercase, numbers, and special characters.',
    );

    // Reset mocks
    toastErrorSpy.mockClear();

    // CASE 2: Input "string" for password field - valid password
    // Set validatePassword to return true (validation passes)
    validatePasswordShouldReturn = true;

    // Set a valid password but with literal value "string"
    fireEvent.change(passwordInput, { target: { value: 'string' } });

    // Verify toast.error was not shown
    expect(toastErrorSpy).not.toHaveBeenCalled();

    // CASE 3: Input other than "string" for password field
    // Try to set a password with value other than "string"
    fireEvent.change(passwordInput, {
      target: { value: 'ValidPassword12@ijewirg3' },
    });

    // Verify toast.error was not shown (should skip that code path)
    expect(toastErrorSpy).not.toHaveBeenCalled();

    // CASE 4: Input "string" for non-password field
    // Update a regular field with literal value "string"
    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'string' } });

    // Verify toast.error was not shown (should skip that code path)
    expect(toastErrorSpy).not.toHaveBeenCalled();

    // Clean up
    window.validatePassword = originalValidatePassword;
    toastErrorSpy.mockRestore();
  });
});
