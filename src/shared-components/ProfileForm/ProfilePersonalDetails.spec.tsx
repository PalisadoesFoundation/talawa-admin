import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePersonalDetails from './ProfilePersonalDetails';
import { IProfileFormState } from './types';
import { USER_ROLES } from 'constants/userRoles';
import dayjs from 'dayjs';

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: (_ns: string) => {
    return {
      t: (key: string, defaultVal?: string) => defaultVal || key,
      i18n: {
        changeLanguage: vi.fn(),
      },
    };
  },
}));

// Mock Avatar component
vi.mock('components/Avatar/Avatar', () => ({
  default: () => <div data-testid="mock-avatar">Avatar</div>,
}));

// Mock DatePicker
vi.mock('shared-components/DatePicker', () => ({
  default: ({
    value,
    onChange,
    slotProps,
  }: {
    value: string | null;
    onChange: (date: unknown) => void;
    slotProps: { textField?: { 'aria-label'?: string } };
  }) => (
    <input
      data-testid="birthDate"
      value={value ? dayjs(value).format('YYYY-MM-DD') : ''}
      onChange={(e) => onChange(dayjs(e.target.value))}
      aria-label={slotProps?.textField?.['aria-label']}
    />
  ),
}));

// Mock DynamicDropDown
vi.mock('components/DynamicDropDown/DynamicDropDown', () => ({
  default: ({
    fieldName,
    handleChange,
    fieldOptions,
  }: {
    fieldName: string;
    handleChange: React.ChangeEventHandler<HTMLSelectElement>;
    fieldOptions: { value: string; label: string }[];
  }) => (
    <select
      data-testid={`select-${fieldName}`}
      aria-label={fieldName}
      onChange={handleChange}
    >
      {fieldOptions.map((opt: { value: string; label: string }) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

describe('ProfilePersonalDetails', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockHandleFieldChange = vi.fn();
  const mockSetFormState = vi.fn();
  const mockHandleFileUpload = vi.fn();
  // Create a ref object that can be passed
  const mockFileInputRef = {
    current: null,
  } as unknown as React.RefObject<HTMLInputElement>;

  const mockFormState: IProfileFormState = {
    mobilePhoneNumber: '',
    workPhoneNumber: '',
    homePhoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    state: '',
    countryCode: '',
    name: 'Test User',
    natalSex: 'Male',
    birthDate: '1990-01-01',
    educationGrade: 'Bachelor',
    employmentStatus: 'Employed',
    maritalStatus: 'Single',
    password: '',
    description: 'Description',
    avatarURL: '',
    emailAddress: 'test@example.com',
    avatar: null,
    naturalLanguageCode: 'en',
  };

  const defaultProps = {
    formState: mockFormState,
    setFormState: mockSetFormState,
    handleFieldChange: mockHandleFieldChange,
    selectedAvatar: null,
    fileInputRef: mockFileInputRef,
    handleFileUpload: mockHandleFileUpload,
    userRole: USER_ROLES.USER,
  };

  it('renders main UI elements with typical props', () => {
    render(<ProfilePersonalDetails {...defaultProps} />);

    expect(screen.getByText('personalDetailsHeading')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument(); // Badge content
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    expect(screen.getByLabelText('name')).toBeInTheDocument();
    expect(screen.getByTestId('birthDate')).toBeInTheDocument();
  });

  it('renders correctly for ADMIN role', () => {
    render(
      <ProfilePersonalDetails {...defaultProps} userRole={USER_ROLES.ADMIN} />,
    );
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('simulates field changes calling handleFieldChange', () => {
    render(<ProfilePersonalDetails {...defaultProps} />);

    // Name input
    const nameInput = screen.getByLabelText('name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(mockHandleFieldChange).toHaveBeenCalledWith('name', 'New Name');

    // Description input
    const descInput = screen.getByLabelText('description');
    fireEvent.change(descInput, { target: { value: 'New Desc' } });
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      'description',
      'New Desc',
    );

    // Password input
    const passwordInput = screen.getByLabelText('password');
    fireEvent.change(passwordInput, { target: { value: 'secret' } });
    expect(mockHandleFieldChange).toHaveBeenCalledWith('password', 'secret');
  });

  it('handles date picker changes', () => {
    render(<ProfilePersonalDetails {...defaultProps} />);
    const dateInput = screen.getByTestId('birthDate');
    fireEvent.change(dateInput, { target: { value: '2000-01-01' } });
    // The mocked date picker calls onChange with a dayjs object
    // The component calls handleFieldChange with 'YYYY-MM-DD'
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      'birthDate',
      '2000-01-01',
    );
  });

  it('handles file upload interactions', () => {
    render(<ProfilePersonalDetails {...defaultProps} />);

    // Simulate clicking the edit button
    screen.getByTestId('uploadImageBtn');

    // Create a mock click function on the ref if it were attached, but JSDOM refs are tricky.
    // The component does: `onClick={() => fileInputRef.current?.click()}`
    // We can spy on the ref.current.click if we could assign it, but React manages the ref.
    // simpler: check if the file input is present and we can trigger change on it.

    const fileInput = screen.getByTestId('fileInput');
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockHandleFileUpload).toHaveBeenCalled();
  });

  it('renders existing avatar when avatarURL is present', () => {
    const propsWithAvatar = {
      ...defaultProps,
      formState: { ...mockFormState, avatarURL: 'http://example.com/pic.jpg' },
    };
    render(<ProfilePersonalDetails {...propsWithAvatar} />);

    const img = screen.getByTestId('profile-picture');
    expect(img).toHaveAttribute('src');
    // SanitizeAvatars is used, so valid URL should be preserved or handled.
    // Since we didn't mock sanitizeAvatars, it runs the real code?
    // Usually utils are real unless mocked. If it has no deps it works.
  });
});
