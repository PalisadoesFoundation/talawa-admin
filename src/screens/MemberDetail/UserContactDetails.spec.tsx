import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import UserContactDetails from './UserContactDetails';
import { GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import { UPDATE_CURRENT_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { toast } from 'react-toastify';

/* -------------------- Mocks -------------------- */

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'title') return 'User Profile';
      if (key === 'personalDetailsHeading') return 'Personal Details';
      if (key === 'contactInfoHeading') return 'Contact Information';
      if (key === 'gender') return 'Gender';
      if (key === 'birthDate') return 'Birth Date';
      if (key === 'educationGrade') return 'Education Grade';
      if (key === 'employmentStatus') return 'Employment Status';
      if (key === 'maritalStatus') return 'Marital Status';
      if (key === 'mobilePhoneNumber') return 'Mobile Phone';
      if (key === 'workPhoneNumber') return 'Work Phone';
      if (key === 'homePhoneNumber') return 'Home Phone';
      if (key === 'addressLine1') return 'Address Line 1';
      if (key === 'addressLine2') return 'Address Line 2';
      if (key === 'postalCode') return 'Postal Code';
      if (key === 'city') return 'City';
      if (key === 'state') return 'State';
      return key;
    },
    tCommon: (key: string, options?: { item?: string }) => {
      if (key === 'name') return 'name';
      if (key === 'email') return 'email';
      if (key === 'password') return 'password';
      if (key === 'description') return 'description';
      if (key === 'country') return 'country';
      if (key === 'resetChanges') return 'Reset Changes';
      if (key === 'saveChanges') return 'Save Changes';
      if (key === 'updatedSuccessfully') {
        return options?.item === 'Profile'
          ? 'Profile updated successfully'
          : 'updated successfully';
      }
      return key;
    },
  }),
}));

vi.mock('react-router', () => ({
  useLocation: () => ({
    pathname: '/members/123',
    search: '',
    hash: '',
    state: { id: '12345' },
    key: 'test-key',
  }),
}));

vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: vi.fn((key: string) => {
      if (key === 'id') return '12345';
      if (key === 'UserImage') return null;
      if (key === 'name') return null;
      if (key === 'email') return null;
      if (key === 'role') return null;
      return null;
    }),
    setItem: vi.fn(),
  }),
}));

vi.mock('utils/urlToFile', () => ({
  urlToFile: vi.fn(() =>
    Promise.resolve(new File(['avatar'], 'avatar.png', { type: 'image/png' })),
  ),
}));

vi.mock('utils/sanitizeAvatar', () => ({
  sanitizeAvatars: vi.fn((selectedAvatar, avatarURL) =>
    selectedAvatar ? URL.createObjectURL(selectedAvatar) : avatarURL,
  ),
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

vi.mock('utils/passwordValidator', () => ({
  validatePassword: vi.fn(() => true),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Avatar component
vi.mock('components/Avatar/Avatar', () => ({
  default: ({ name, dataTestId }: { name: string; dataTestId: string }) => (
    <div data-testid={dataTestId}>{name}</div>
  ),
}));

// Mock Loader component
vi.mock('components/Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

interface InterfaceMockDynamicDropDownProps {
  fieldName: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Mock DynamicDropDown component
vi.mock('components/DynamicDropDown/DynamicDropDown', () => ({
  default: ({ fieldName, handleChange }: InterfaceMockDynamicDropDownProps) => (
    <select data-testid={`dropdown-${fieldName}`} onChange={handleChange}>
      <option value="">Select {fieldName}</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
    </select>
  ),
}));

/* -------------------- Test Data -------------------- */

const user = {
  __typename: 'User',
  id: '12345',
  name: 'John Doe',
  emailAddress: 'john@example.com',
  avatarURL: 'https://example.com/avatar.png',
  mobilePhoneNumber: '+1234567890',
  workPhoneNumber: '+1234567891',
  homePhoneNumber: '+1234567892',
  addressLine1: '123 Street',
  addressLine2: 'Apt 4',
  postalCode: '12345',
  city: 'City',
  state: 'State',
  countryCode: 'us',
  birthDate: '2000-01-01',
  educationGrade: 'Bachelor',
  employmentStatus: 'Employed',
  maritalStatus: 'Single',
  natalSex: 'Female',
  description: 'Test description',
  password: '',
  role: 'user',
  avatar: null,
  naturalLanguageCode: 'en',
};

const getUserMock: MockedResponse = {
  request: {
    query: GET_USER_BY_ID,
    variables: {
      input: {
        id: '12345',
      },
    },
  },
  result: {
    data: {
      user: user,
    },
  },
};

const updateUserMock: MockedResponse = {
  request: {
    query: UPDATE_CURRENT_USER_MUTATION,
    variables: {
      input: expect.objectContaining({
        name: 'John Doe Updated',
      }),
    },
  },
  result: {
    data: {
      updateCurrentUser: {
        ...user,
        name: 'John Doe Updated',
        avatarURL: 'https://example.com/updated-avatar.png',
        emailAddress: 'john@example.com',
        role: 'user',
      },
    },
  },
};

/* -------------------- Render Helper -------------------- */

const renderComponent = (mocks: MockedResponse[] = [getUserMock]) => {
  // Mock URL.createObjectURL for avatar preview
  global.URL.createObjectURL = vi.fn(() => 'blob:test-url');
  global.URL.revokeObjectURL = vi.fn();

  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={['/members/123']}>
        <UserContactDetails id="12345" />
      </MemoryRouter>
    </MockedProvider>,
  );
};

/* -------------------- Tests -------------------- */

describe('UserContactDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: {
        reload: vi.fn(),
      },
      writable: true,
    });

    // Mock document.title
    Object.defineProperty(document, 'title', {
      writable: true,
      value: '',
    });
  });

  it('shows loader initially', () => {
    renderComponent();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders user data after fetch', async () => {
    renderComponent();

    // Wait for loader to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Verify form fields are populated
    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('John Doe');
    });

    // Verify other fields
    expect(screen.getByTestId('inputEmail')).toHaveValue('john@example.com');
    expect(screen.getByTestId('addressLine1')).toHaveValue('123 Street');
    expect(screen.getByTestId('addressLine2')).toHaveValue('Apt 4');
    expect(screen.getByTestId('inputPostalCode')).toHaveValue('12345');
    expect(screen.getByTestId('inputCity')).toHaveValue('City');
    expect(screen.getByTestId('inputState')).toHaveValue('State');
    expect(screen.getByTestId('inputMobilePhoneNumber')).toHaveValue(
      '+1234567890',
    );
    expect(screen.getByTestId('inputWorkPhoneNumber')).toHaveValue(
      '+1234567891',
    );
    expect(screen.getByTestId('inputHomePhoneNumber')).toHaveValue(
      '+1234567892',
    );
    expect(screen.getByTestId('inputDescription')).toHaveValue(
      'Test description',
    );
  });

  it('enables editing and saves changes', async () => {
    renderComponent([getUserMock, updateUserMock]);

    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('John Doe');
    });

    // Change a field
    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'John Doe Updated' },
    });

    // Wait for save button to appear
    await waitFor(() => {
      expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('saveChangesBtn'));
  });

  it('resets form on reset click', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('John Doe');
    });

    // Change a field
    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'Changed Name' },
    });

    // Verify change
    expect(screen.getByTestId('inputName')).toHaveValue('Changed Name');

    // Click reset
    fireEvent.click(screen.getByTestId('resetChangesBtn'));

    // Should revert to original value
    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('John Doe');
    });

    // Buttons should disappear after reset
    expect(screen.queryByTestId('saveChangesBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('resetChangesBtn')).not.toBeInTheDocument();
  });

  it('uploads avatar file successfully', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    });

    // Verify edit icon exists
    const editIcon = screen.getByTestId('uploadImageBtn');
    expect(editIcon).toBeInTheDocument();

    // Create a mock file
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    // Get the file input
    const fileInput = screen.getByTestId('fileInput');

    // Trigger file change
    fireEvent.change(fileInput, { target: { files: [file] } });

    // URL.createObjectURL should be called for the preview
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  it('handles avatar upload with invalid file type', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    });

    // Create invalid file
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    // Get the file input
    const fileInput = screen.getByTestId('fileInput');

    // Trigger file change
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    // toast.error should be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid file type. Please upload a JPEG, PNG, or GIF.',
      );
    });
  });

  it('handles avatar upload with file too large', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
    });

    // Create large file (6MB)
    const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });

    // Get the file input
    const fileInput = screen.getByTestId('fileInput');

    // Trigger file change
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    // toast.error should be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'File is too large. Maximum size is 5MB.',
      );
    });
  });

  it('handles password validation', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('John Doe');
    });

    // Mock validatePassword to return false for short passwords
    // Mock validatePassword to return an error
    const { validatePassword } = await import('utils/passwordValidator');
    vi.mocked(validatePassword).mockReturnValue(
      'Password must be at least 8 characters long.',
    );

    // Enter short password
    fireEvent.change(screen.getByTestId('inputPassword'), {
      target: { value: 'short' },
    });

    // Try to save
    fireEvent.click(screen.getByTestId('saveChangesBtn'));

    // Expect toast to show the error message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Password must be at least 8 characters long.',
      );
    });
  });

  it('handles dropdown changes', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('John Doe');
    });

    // Find and change a dropdown
    const genderDropdown = screen.getByTestId('dropdown-natalSex');
    fireEvent.change(genderDropdown, { target: { value: 'MALE' } });

    // Save button should appear
    await waitFor(() => {
      expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
    });
  });

  it('sets document title', async () => {
    renderComponent();

    await waitFor(() => {
      expect(document.title).toBe('User Profile');
    });
  });

  it('displays user badge for user role', async () => {
    renderComponent();

    await waitFor(() => {
      // Look for the user badge - the button should have text "User"
      const userBadge = screen.getByRole('button', { name: /user/i });
      expect(userBadge).toBeInTheDocument();
      expect(userBadge.textContent).toBe('User');
    });
  });

  it('disables email field', async () => {
    renderComponent();

    await waitFor(() => {
      const emailInput = screen.getByTestId('inputEmail');
      expect(emailInput).toBeDisabled();
    });
  });

  it('handles date picker changes', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('John Doe');
    });

    // Find date picker input (the actual input field inside the MUI DatePicker)
    const datePickerInput = screen.getByLabelText('Birth Date');

    // Change date - MUI DatePicker uses MM/DD/YYYY format in the input
    fireEvent.change(datePickerInput, { target: { value: '05/15/1995' } });

    // Save button should appear
    await waitFor(() => {
      expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
    });
  });

  it('handles country dropdown changes', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('John Doe');
    });

    // Find country dropdown
    const countryDropdown = screen.getByTestId('inputCountry');

    // Change country
    fireEvent.change(countryDropdown, { target: { value: 'ca' } });

    // Save button should appear
    await waitFor(() => {
      expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
    });
  });

  it('shows save/reset buttons only when form is updated', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('inputName')).toHaveValue('John Doe');
    });

    // Initially, save/reset buttons should not be visible
    expect(screen.queryByTestId('saveChangesBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('resetChangesBtn')).not.toBeInTheDocument();

    // Make a change
    fireEvent.change(screen.getByTestId('inputName'), {
      target: { value: 'Changed Name' },
    });

    // Buttons should appear
    await waitFor(() => {
      expect(screen.getByTestId('saveChangesBtn')).toBeInTheDocument();
      expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    });
  });
});
