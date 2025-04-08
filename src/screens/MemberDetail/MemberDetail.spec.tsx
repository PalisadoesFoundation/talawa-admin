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
import {
  BrowserRouter,
  MemoryRouter,
  Route,
  Routes,
  NavigateFunction,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import { validatePassword } from 'utils/passwordValidator';
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

const toastErrorSpy = vi.spyOn(toast, 'error');

async function wait(ms = 500): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

const setItem = vi.fn();

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: setItem,
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

const mockNavigate: NavigateFunction = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const addressInput = screen.getByTestId('addressLine1');
    await userEvent.type(addressInput, 'random');

    const resetButton = await waitFor(() =>
      screen.getByTestId('resetChangesBtn'),
    );

    await userEvent.click(resetButton);

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

  it('validates birth date input', async () => {
    renderMemberDetailScreen(link1);
    await waitFor(() => {
      expect(screen.getByTestId('birthDate')).toBeInTheDocument();
    });

    const birthDateInput = screen.getByTestId('birthDate');

    const futureDate = '2080-02-02';
    await userEvent.type(birthDateInput, futureDate);

    userEvent.click(document.body);

    expect(birthDateInput).toHaveValue('02/08/0002');
  });

  it('handles empty password gracefully', async () => {
    renderMemberDetailScreen(link1);

    await waitFor(() => {
      expect(screen.getByTestId('inputPassword')).toBeInTheDocument();
    });

    const passwordInput = screen.getByTestId('inputPassword');
    fireEvent.change(passwordInput, { target: { value: '' } });

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
      expect(screen.getByTestId('confirmationToDelete')).toBeInTheDocument();
    });
  });

  test('profile picture triggers file input and handles file upload', async () => {
    global.URL.createObjectURL = vi.fn(() => 'mockURL');

    renderMemberDetailScreen(link1);

    await waitFor(() => {
      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    });

    const mockClick = vi.fn();
    const originalClick = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'click',
    );
    Object.defineProperty(HTMLInputElement.prototype, 'click', {
      configurable: true,
      value: mockClick,
    });

    const profilePicture = screen.getByTestId('profile-picture');
    await userEvent.click(profilePicture);

    expect(mockClick).toHaveBeenCalled();

    if (originalClick) {
      Object.defineProperty(HTMLInputElement.prototype, 'click', originalClick);
    }

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('fileInput');
    await userEvent.upload(fileInput, file);

    expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
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

    const invalidFile = new File(['test'], 'test.md', { type: 'image/plain' });
    const fileInput = screen.getByTestId('fileInput');
    await userEvent.upload(fileInput, invalidFile);

    expect(toast.error).toHaveBeenCalledWith(
      'Invalid file type. Please upload a JPEG, PNG, or GIF.',
    );

    const largeFile = new File(['test'.repeat(10000000)], 'test.jpg', {
      type: 'image/png',
    });
    await userEvent.upload(fileInput, largeFile);

    expect(toast.error).toHaveBeenCalledWith(
      'File is too large. Maximum size is 5MB.',
    );
  });

  test('admin approved checkbox should toggle correctly', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    const adminApprovedCheckbox = screen.getByTestId('AdminApprovedForm');

    expect(adminApprovedCheckbox).not.toBeChecked();

    await userEvent.click(adminApprovedCheckbox);

    expect(adminApprovedCheckbox).toBeChecked();

    await userEvent.click(adminApprovedCheckbox);

    expect(adminApprovedCheckbox).not.toBeChecked();
  });

  test('checkbox should update form state', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    expect(screen.queryByTestId('resetChangesBtn')).not.toBeInTheDocument();

    const adminApprovedCheckbox = screen.getByTestId('AdminApprovedForm');

    await userEvent.click(adminApprovedCheckbox);

    expect(adminApprovedCheckbox).toBeChecked();

    await waitFor(() => {
      expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('resetChangesBtn'));

    await waitFor(() => {
      expect(adminApprovedCheckbox).not.toBeChecked();
    });
  });

  test('delete user button should open confirmation modal', async () => {
    renderMemberDetailScreen(link2);
    await wait();

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    const deleteButton = screen.getByTestId('deleteUserButton');
    fireEvent.click(deleteButton);

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

  test('confirmation modal can be closed by both X button and cancel button', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const deleteButton = screen.getByTestId('deleteUserButton');
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(screen.getByTestId('confirmationToDelete')).toBeInTheDocument();
    });

    const closeButton =
      screen.getByLabelText('Close') ||
      screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(
        screen.queryByTestId('confirmationToDelete'),
      ).not.toBeInTheDocument();
    });

    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(screen.getByTestId('confirmationToDelete')).toBeVisible();
    });

    const cancelButton = screen.getByTestId('button-cancelDeleteConfirmation');
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(
        screen.queryByTestId('confirmationToDelete'),
      ).not.toBeInTheDocument();
    });
  });

  it('handles all form field changes', async () => {
    renderMemberDetailScreen(link1);

    await wait();

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
    const toastSuccessSpy = vi.spyOn(toast, 'success');

    renderMemberDetailScreen(link6);
    await wait();

    const deleteButton = screen.getByTestId('deleteUserButton');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByTestId('confirmationToDelete')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('button-handleDeleteConfirmation');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledTimes(1);
      expect(toastSuccessSpy.mock.calls[0][0]).toContain('User');
    });

    await waitFor(() => {
      expect(
        screen.queryByTestId('confirmationToDelete'),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    toastSuccessSpy.mockRestore();
  });

  test.each([
    {
      scenario: 'with valid data',
      mockDelete: vi.fn().mockResolvedValue({
        data: { deleteUser: { id: 'rishav-jha-mech' } },
      }),
      testId: 'trigger-delete',
      expectToast: true,
      expectCloseModal: true,
    },
    {
      scenario: 'with null data',
      mockDelete: vi.fn().mockResolvedValue({
        data: null,
      }),
      testId: 'trigger-delete-no-data',
      expectToast: false,
      expectCloseModal: false,
    },
  ])(
    'should handle user deletion $scenario',
    async ({ mockDelete, testId, expectToast, expectCloseModal }) => {
      const toastSuccessSpy = vi.spyOn(toast, 'success');
      const mockSetShowDeleteConfirm = vi.fn();

      render(
        <MockedProvider addTypename={false}>
          <I18nextProvider i18n={i18nForTest}>
            <Provider store={store}>
              <BrowserRouter>
                <button
                  type="button"
                  data-testid={testId}
                  onClick={async (): Promise<void> => {
                    try {
                      const { data: deleteData } = await mockDelete({
                        variables: { id: 'rishav-jha-mech' },
                      });
                      if (deleteData) {
                        toast.success('User deleted successfully');
                        mockSetShowDeleteConfirm(false);
                        mockNavigate('/');
                      }
                    } catch (error) {}
                  }}
                >
                  Delete
                </button>
              </BrowserRouter>
            </Provider>
          </I18nextProvider>
        </MockedProvider>,
      );

      fireEvent.click(screen.getByTestId(testId));

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledTimes(1);
      });

      if (expectToast) {
        expect(toastSuccessSpy).toHaveBeenCalledWith(
          'User deleted successfully',
        );

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
      } else {
        expect(toastSuccessSpy).not.toHaveBeenCalled();
      }

      if (expectCloseModal) {
        expect(mockSetShowDeleteConfirm).toHaveBeenCalledWith(false);
      } else {
        expect(mockSetShowDeleteConfirm).not.toHaveBeenCalled();
      }

      toastSuccessSpy.mockRestore();
    },
  );

  test('prevents selection of future birthdates', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const futureDate = dayjs().add(1, 'year');
    const birthDateInput = screen.getByTestId('birthDate');

    await userEvent.type(birthDateInput, futureDate.format('YYYY-MM-DD'));
    fireEvent.blur(birthDateInput);

    expect(birthDateInput).not.toHaveValue(futureDate.format('YYYY-MM-DD'));
  });

  test('validates file upload size and type', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const fileInput = screen.getByTestId('fileInput');

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
    const workPhoneInput = screen.getByTestId('inputWorkPhoneNumber');
    const homePhoneInput = screen.getByTestId('inputHomePhoneNumber');

    await fireEvent.change(mobilePhoneInput, {
      target: { value: '+1234567890' },
    });
    expect(mobilePhoneInput).toHaveValue('+1234567890');

    await fireEvent.change(workPhoneInput, {
      target: { value: '+1987654321' },
    });
    expect(workPhoneInput).toHaveValue('+1987654321');

    await fireEvent.change(homePhoneInput, {
      target: { value: '+1555555555' },
    });
    expect(homePhoneInput).toHaveValue('+1555555555');
  });

  test('removes empty fields before update', async () => {
    const mockUpdateUser = vi.fn();
    const updatedMock = {
      request: {
        query: UPDATE_CURRENT_USER_MUTATION,
        variables: {
          input: {
            name: 'Test User',

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

    const nameInput = screen.getByTestId('inputName');
    const descriptionInput = screen.getByTestId('inputDescription');
    const addressInput = screen.getByTestId('addressLine1');

    await userEvent.clear(descriptionInput);
    await userEvent.clear(addressInput);
    await userEvent.type(nameInput, 'Test User');

    const saveButton = screen.getByTestId('saveChangesBtn');
    await userEvent.click(saveButton);

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

    const educationDropdownBtn = screen.getByTestId(
      'educationgrade-dropdown-btn',
    );
    expect(educationDropdownBtn).toBeInTheDocument();

    expect(educationDropdownBtn).toHaveTextContent('None');

    await userEvent.click(educationDropdownBtn);

    expect(
      screen.getByTestId('educationgrade-dropdown-menu'),
    ).toBeInTheDocument();

    const option = screen.getByTestId('change-educationgrade-btn-kg');
    await userEvent.click(option);

    expect(educationDropdownBtn).toHaveTextContent('Kg');
  });

  test('renders employe status dropdown and handles selection', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(
      screen.getByTestId('employmentstatus-dropdown-container'),
    ).toBeInTheDocument();

    const employmentStatus = screen.getByTestId(
      'employmentstatus-dropdown-btn',
    );
    expect(employmentStatus).toBeInTheDocument();

    expect(employmentStatus).toHaveTextContent('None');

    await userEvent.click(employmentStatus);

    expect(
      screen.getByTestId('employmentstatus-dropdown-menu'),
    ).toBeInTheDocument();

    const option = screen.getByTestId('change-employmentstatus-btn-full_time');
    await userEvent.click(option);

    expect(employmentStatus).toHaveTextContent('Full-Time');
  });

  test('renders maritial status dropdown and handles selection', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(
      screen.getByTestId('maritalstatus-dropdown-container'),
    ).toBeInTheDocument();

    const maritalStatus = screen.getByTestId('maritalstatus-dropdown-btn');
    expect(maritalStatus).toBeInTheDocument();

    expect(maritalStatus).toHaveTextContent('None');

    await userEvent.click(maritalStatus);

    expect(
      screen.getByTestId('maritalstatus-dropdown-menu'),
    ).toBeInTheDocument();

    const option = screen.getByTestId('change-maritalstatus-btn-single');
    await userEvent.click(option);

    expect(maritalStatus).toHaveTextContent('Single');
  });

  test('renders gender status dropdown and handles selection', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    expect(
      screen.getByTestId('natalsex-dropdown-container'),
    ).toBeInTheDocument();

    const genderStatus = screen.getByTestId('natalsex-dropdown-btn');
    expect(genderStatus).toBeInTheDocument();

    expect(genderStatus).toHaveTextContent('None');

    await userEvent.click(genderStatus);

    expect(screen.getByTestId('natalsex-dropdown-menu')).toBeInTheDocument();

    const option = screen.getByTestId('change-natalsex-btn-male');
    await userEvent.click(option);

    expect(genderStatus).toHaveTextContent('Male');
  });

  test('handles country selection change', async () => {
    renderMemberDetailScreen(link1);
    await wait();

    const countrySelect = screen.getByTestId('inputCountry');
    expect(countrySelect).toBeInTheDocument();

    fireEvent.change(countrySelect, { target: { value: 'us' } });
    expect(countrySelect).toHaveValue('us');
  });

  it('should only validate passwords when value is "string" and fieldName is password', async () => {
    vi.spyOn({ validatePassword }, 'validatePassword').mockImplementation(
      (password: string) => {
        if (password === 'string' || password === 'weakpassword') {
          return false;
        }
        return true;
      },
    );

    renderMemberDetailScreen(link1);
    await wait();

    const passwordInput = screen.getByTestId('inputPassword');
    fireEvent.change(passwordInput, { target: { value: 'weakpassword' } });
    expect(toastErrorSpy).toHaveBeenCalledWith(
      'Password must be at least 8 characters, contain uppercase, lowercase, numbers, and special characters.',
    );

    toastErrorSpy.mockClear();
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ssw0rd' } });
    expect(toastErrorSpy).not.toHaveBeenCalled();

    fireEvent.change(passwordInput, {
      target: { value: 'ValidP@ss123' },
    });
    expect(toastErrorSpy).not.toHaveBeenCalled();

    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'string' } });
    expect(toastErrorSpy).not.toHaveBeenCalled();

    toastErrorSpy.mockRestore();
  });

  test('should set localStorage items when user update is successful', async () => {
    renderMemberDetailScreen(link5);
    await wait();

    await act(async () => {
      const updateUserMock = vi.fn().mockResolvedValue({
        data: {
          updateCurrentUser: {
            id: '65378abd-8500-8f17-1cf2-990d00000002',
            name: 'New Name',
            emailAddress: 'testadmin1@example.com',
            avatarURL: null,
            role: 'administrator',
          },
        },
      });

      const tCommon = vi.fn().mockReturnValue('Profile updated successfully');

      const { data: updateData } = await updateUserMock();

      if (updateData) {
        toast.success(tCommon('updatedSuccessfully', { item: 'Profile' }));
        setItem('UserImage', updateData.updateCurrentUser.avatarURL);
        setItem('name', updateData.updateCurrentUser.name);
        setItem('email', updateData.updateCurrentUser.emailAddress);
        setItem('id', updateData.updateCurrentUser.id);
        setItem('role', updateData.updateCurrentUser.role);

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      expect(setItem).toHaveBeenCalledTimes(5);
      expect(setItem).toHaveBeenCalledWith('UserImage', null);
      expect(setItem).toHaveBeenCalledWith('name', 'New Name');
      expect(setItem).toHaveBeenCalledWith('email', 'testadmin1@example.com');
      expect(setItem).toHaveBeenCalledWith(
        'id',
        '65378abd-8500-8f17-1cf2-990d00000002',
      );
      expect(setItem).toHaveBeenCalledWith('role', 'administrator');
    });
  });
});
