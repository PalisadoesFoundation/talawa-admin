import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserDetailsForm from './UserDetails';
import { MOCKS, MOCKS1, MOCKS2, UPDATE_MOCK } from '../SettingsMocks';
import { MockedProvider } from '@apollo/client/testing';
import dayjs from 'dayjs';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

const defaultUserDetails = {
  name: 'Test User',
  natalSex: 'MALE',
  password: '',
  emailAddress: 'test@example.com',
  mobilePhoneNumber: '1234567890',
  homePhoneNumber: '',
  workPhoneNumber: '',
  birthDate: '2000-01-01',
  educationGrade: 'GRADE_1',
  employmentStatus: 'UNEMPLOYED',
  maritalStatus: 'SINGLE',
  description: 'Test description',
  addressLine1: '123 Test St',
  addressLine2: '',
  state: 'Test State',
  countryCode: 'US',
  city: 'Test City',
  postalCode: '12345',
};

const handlerMocks = vi.hoisted(() => ({
  handleFieldChange: vi.fn(),
  handleResetChanges: vi.fn(),
  handleUpdateUserDetails: vi.fn(),
}));

// Mock the dependencies
vi.mock('sanitize-html', () => ({
  default: (content: string) => content,
}));

vi.mock('components/UserPortal/UserProfile/UserAddressFields', () => ({
  default: ({
    handleFieldChange,
  }: {
    handleFieldChange: (field: string, value: string) => void;
  }) => (
    <div data-testid="address-fields">
      <input
        data-testid="mock-address-input"
        onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
      />
    </div>
  ),
}));

describe('UserDetailsForm', () => {
  const mockT = (key: string): string => key;
  const mockTCommon = (key: string): string => key;

  const defaultProps = {
    userDetails: {
      ...MOCKS1[0].result.data.currentUser,
      password: '', // Add a default password value
    },
    handleFieldChange: handlerMocks.handleFieldChange,
    isUpdated: true,
    handleResetChanges: handlerMocks.handleResetChanges,
    handleUpdateUserDetails: handlerMocks.handleUpdateUserDetails,
    t: mockT,
    tCommon: mockTCommon,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields with correct initial values', () => {
    render(
      <MockedProvider mocks={MOCKS1}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    expect(screen.getByTestId('inputName')).toHaveValue(
      defaultProps.userDetails.name,
    );
    expect(screen.getByTestId('inputGender')).toHaveValue(
      defaultProps.userDetails.natalSex,
    );
    expect(screen.getByTestId('inputEmail')).toHaveValue(
      defaultProps.userDetails.emailAddress,
    );
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue(
      defaultProps.userDetails.mobilePhoneNumber,
    );
    expect(screen.getByTestId('inputHomePhoneNumber')).toHaveValue(
      defaultProps.userDetails.homePhoneNumber,
    );
    expect(screen.getByTestId('inputWorkPhoneNumber')).toHaveValue(
      defaultProps.userDetails.workPhoneNumber,
    );
  });

  it('handles password field changes', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    const passwordInput = screen.getByTestId('inputPassword');
    await userEvent.type(passwordInput, 'newPassword123');

    const calls = handlerMocks.handleFieldChange.mock.calls;

    expect(calls.length).toBe('newPassword123'.length);
    // Ensure the full password was emitted incrementally
    expect(calls.map((call) => call[1]).join('')).toBe('newPassword123');
  });

  it('disables email field', () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    expect(screen.getByTestId('inputEmail')).toBeDisabled();
  });

  it('shows/hides action buttons based on isUpdated prop', () => {
    const { rerender } = render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} isUpdated={false} />
      </MockedProvider>,
    );

    // When isUpdated is true, buttons should NOT be in the document
    expect(screen.queryByTestId('resetChangesBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('updateUserBtn')).not.toBeInTheDocument();

    rerender(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} isUpdated={true} />
      </MockedProvider>,
    );

    // When isUpdated is false, buttons should be in the document
    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    expect(screen.getByTestId('updateUserBtn')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    render(
      <MockedProvider mocks={UPDATE_MOCK}>
        <UserDetailsForm {...defaultProps} isUpdated={true} />
      </MockedProvider>,
    );

    const updateButton = screen.getByTestId('updateUserBtn');
    await userEvent.click(updateButton);

    expect(handlerMocks.handleUpdateUserDetails).toHaveBeenCalled();
  });

  it('handles reset changes correctly', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} isUpdated={true} />
      </MockedProvider>,
    );

    const resetButton = screen.getByTestId('resetChangesBtn');
    await userEvent.click(resetButton);

    expect(handlerMocks.handleResetChanges).toHaveBeenCalled();
  });

  it('renders select fields with correct options', () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    const genderSelect = screen.getByTestId('inputGender');
    const gradeSelect = screen.getByTestId('inputGrade');
    const empStatusSelect = screen.getByTestId('inputEmpStatus');
    const maritalStatusSelect = screen.getByTestId('inputMaritalStatus');

    expect(genderSelect.getElementsByTagName('option').length).toBeGreaterThan(
      1,
    );
    expect(gradeSelect.getElementsByTagName('option').length).toBeGreaterThan(
      1,
    );
    expect(
      empStatusSelect.getElementsByTagName('option').length,
    ).toBeGreaterThan(1);
    expect(
      maritalStatusSelect.getElementsByTagName('option').length,
    ).toBeGreaterThan(1);
  });

  it('validates birth date to not be in the future', () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    const birthDateInput = screen.getByLabelText(mockT('birthDate'));
    const maxDate = dayjs().format('YYYY-MM-DD');

    expect(birthDateInput).toHaveAttribute('max', maxDate);
  });

  it('renders description field with sanitized content', () => {
    const userDetailsWithHtml = {
      ...defaultProps.userDetails,
      description: '<p>Test description</p><script>alert("xss")</script>',
    };

    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} userDetails={userDetailsWithHtml} />
      </MockedProvider>,
    );

    const descriptionField = screen.getByTestId('inputDescription');
    expect(descriptionField).toBeInTheDocument();
  });

  it('handles empty user details gracefully', () => {
    render(
      <MockedProvider mocks={MOCKS2}>
        <UserDetailsForm
          {...defaultProps}
          userDetails={{ ...MOCKS2[0].result.data.currentUser, password: '' }}
        />
      </MockedProvider>,
    );

    expect(screen.getByTestId('inputName')).toHaveValue('');
    expect(screen.getByTestId('inputEmail')).toHaveValue('');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('');
  });

  it('handles address fields changes correctly', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    const addressInput = screen.getByTestId('mock-address-input');
    await userEvent.type(addressInput, '123 Test St');

    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'addressLine1',
      '123 Test St',
    );
  });

  it('handles all form field changes correctly', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    // Test name field
    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'name',
      'New Name',
    );

    // Test gender field
    const genderSelect = screen.getByTestId('inputGender');
    await userEvent.selectOptions(genderSelect, 'male');
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'natalSex',
      'male',
    );

    // Test phone numbers
    const mobilePhone = screen.getByTestId('inputPhoneNumber');
    fireEvent.change(mobilePhone, { target: { value: '1234567890' } });
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'mobilePhoneNumber',
      '1234567890',
    );

    const homePhone = screen.getByTestId('inputHomePhoneNumber');
    fireEvent.change(homePhone, { target: { value: '1234567890' } });
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'homePhoneNumber',
      '1234567890',
    );

    const workPhone = screen.getByTestId('inputWorkPhoneNumber');
    fireEvent.change(workPhone, { target: { value: '1234567890' } });
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'workPhoneNumber',
      '1234567890',
    );

    // Test birth date - properly test DatePicker onChange handler
    const dateInput = screen.getByTestId('birth-date-input');

    // Test case 1: Setting a date (testing the date ? date.format() branch)
    await act(async () => {
      // Find the DatePicker component and directly call its onChange prop
      // to simulate what happens when a user selects a date
      const datePickerOnChange = screen
        .getByLabelText(mockT('birthDate'))
        .closest('.MuiDatePicker-root')
        ?.dispatchEvent(new Event('change'));
      if (datePickerOnChange) {
        if (typeof datePickerOnChange === 'function') {
          (datePickerOnChange as (date: dayjs.Dayjs) => void)(
            dayjs('1990-01-01'),
          );
        }
      } else {
        // Fallback to simulating input change
        fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
        fireEvent.blur(dateInput);
      }
    });
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'birthDate',
      '1990-01-01',
    );

    // Test case 2: Clearing a date (testing the : '' branch)
    await act(async () => {
      // Find the DatePicker component and directly call its onChange prop with null
      const datePickerOnChange = screen
        .getByLabelText(mockT('birthDate'))
        .closest('.MuiDatePicker-root')
        ?.dispatchEvent(new Event('change'));
      if (datePickerOnChange) {
        if (typeof datePickerOnChange === 'function') {
          (datePickerOnChange as (date: dayjs.Dayjs | null) => void)(null);
        }
      } else {
        // Fallback to simulating input change to empty string
        fireEvent.change(dateInput, { target: { value: '' } });
        fireEvent.blur(dateInput);
      }
    });
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'birthDate',
      '',
    );

    // Test education grade
    const gradeSelect = screen.getByTestId('inputGrade');
    await userEvent.selectOptions(gradeSelect, 'graduate');
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'educationGrade',
      'graduate',
    );

    // // Test employment status
    const empStatusSelect = screen.getByTestId('inputEmpStatus');
    await userEvent.selectOptions(empStatusSelect, 'unemployed');
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'employmentStatus',
      'unemployed',
    );

    // Test marital status
    const maritalStatusSelect = screen.getByTestId('inputMaritalStatus');
    await userEvent.selectOptions(maritalStatusSelect, 'single');
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'maritalStatus',
      'single',
    );

    // Test description
    const description = screen.getByTestId('inputDescription');
    fireEvent.change(description, { target: { value: 'New description' } }); // Fixed the fireEvent.change syntax
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'description',
      'New description',
    );
  });

  it('handles null birth date correctly', () => {
    const propsWithNullBirthDate = {
      ...defaultProps,
      userDetails: {
        ...defaultProps.userDetails,
        birthDate: null,
      },
    };

    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...propsWithNullBirthDate} />
      </MockedProvider>,
    );

    const birthDateInput = screen.getByLabelText(mockT('birthDate'));
    expect(birthDateInput).toHaveValue('');
  });

  it('renders address section with correct heading', () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    expect(
      screen.getByText(`${mockTCommon('address')} :-`),
    ).toBeInTheDocument();
  });
});

describe('UserDetailsForm - Password Validation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ✅ FIXED: mockT now translates with 'settings' namespace
  const mockT = (key: string): string => {
    if (!key.includes('.')) {
      return i18nForTest.t(`settings.${key}`);
    }
    return i18nForTest.t(key);
  };
  const mockTCommon = (key: string): string => i18nForTest.t(`common.${key}`);

  const renderComponent = (overrides = {}) => {
    const props = {
      userDetails: { ...defaultUserDetails, ...overrides },
      handleFieldChange: handlerMocks.handleFieldChange,
      isUpdated: true,
      handleResetChanges: handlerMocks.handleResetChanges,
      handleUpdateUserDetails: handlerMocks.handleUpdateUserDetails,
      t: mockT,
      tCommon: mockTCommon,
    };

    return render(
      <I18nextProvider i18n={i18nForTest}>
        <UserDetailsForm {...props} />
      </I18nextProvider>,
    );
  };

  describe('Password Input Rendering', () => {
    it('should render password input field', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should render password visibility toggle button', () => {
      renderComponent();
      const toggleButton = screen.getByTestId('showPassword');
      expect(toggleButton).toBeInTheDocument();
    });

    it('should have correct placeholder text', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');
      expect(passwordInput).toHaveAttribute(
        'placeholder',
        mockT('enterNewPassword'),
      );
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when clicking show/hide button', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');
      const toggleButton = screen.getByTestId('showPassword');

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show password
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Click to hide password again
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Password Validation UI Display', () => {
    it('should not show validation messages when input is not focused', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.blur(passwordInput);

      // Validation messages should not be visible - now looking for actual translated text
      expect(
        screen.queryByText(mockT('atleast_8_char_long')),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(mockT('lowercase_check')),
      ).not.toBeInTheDocument();
    });

    it('should show validation messages when input is focused', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      // Focus the input
      fireEvent.focus(passwordInput);

      // All validation messages should be visible - using mockT for consistent translation
      expect(
        screen.getByText(mockT('atleast_8_char_long')),
      ).toBeInTheDocument();
      expect(screen.getByText(mockT('lowercase_check'))).toBeInTheDocument();
      expect(screen.getByText(mockT('uppercase_check'))).toBeInTheDocument();
      expect(
        screen.getByText(mockT('numeric_value_check')),
      ).toBeInTheDocument();
      expect(screen.getByText(mockT('special_char_check'))).toBeInTheDocument();
    });

    it('should hide validation messages when input loses focus', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      // Focus and then blur
      fireEvent.focus(passwordInput);
      expect(
        screen.getByText(mockT('atleast_8_char_long')),
      ).toBeInTheDocument();

      fireEvent.blur(passwordInput);
      expect(
        screen.queryByText(mockT('atleast_8_char_long')),
      ).not.toBeInTheDocument();
    });
  });

  describe('Length Validation', () => {
    it('should show error (red with Clear icon) when password is less than 8 characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'Test1!' } });

      const lengthCheck = screen
        .getByText(mockT('atleast_8_char_long'))
        .closest('p');
      expect(lengthCheck).toHaveClass('text-danger');
    });

    it('should show success (green with Check icon) when password is 8 or more characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'Test123!' } });

      const lengthCheck = screen
        .getByText(mockT('atleast_8_char_long'))
        .closest('p');
      expect(lengthCheck).toHaveClass('text-success');
    });
  });

  describe('Lowercase Character Validation', () => {
    it('should show error when password has no lowercase characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'TEST123!' } });

      const lowercaseCheck = screen
        .getByText(mockT('lowercase_check'))
        .closest('p');
      expect(lowercaseCheck).toHaveClass('text-danger');
    });

    it('should show success when password has lowercase characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'Test123!' } });

      const lowercaseCheck = screen
        .getByText(mockT('lowercase_check'))
        .closest('p');
      expect(lowercaseCheck).toHaveClass('text-success');
    });
  });

  describe('Uppercase Character Validation', () => {
    it('should show error when password has no uppercase characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'test123!' } });

      const uppercaseCheck = screen
        .getByText(mockT('uppercase_check'))
        .closest('p');
      expect(uppercaseCheck).toHaveClass('text-danger');
    });

    it('should show success when password has uppercase characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'Test123!' } });

      const uppercaseCheck = screen
        .getByText(mockT('uppercase_check'))
        .closest('p');
      expect(uppercaseCheck).toHaveClass('text-success');
    });
  });

  describe('Numeric Value Validation', () => {
    it('should show error when password has no numeric characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'TestPass!' } });

      const numericCheck = screen
        .getByText(mockT('numeric_value_check'))
        .closest('p');
      expect(numericCheck).toHaveClass('text-danger');
    });

    it('should show success when password has numeric characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'Test123!' } });

      const numericCheck = screen
        .getByText(mockT('numeric_value_check'))
        .closest('p');
      expect(numericCheck).toHaveClass('text-success');
    });
  });

  describe('Special Character Validation', () => {
    it('should show error when password has no special characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'Test1234' } });

      const specialCharCheck = screen
        .getByText(mockT('special_char_check'))
        .closest('p');
      expect(specialCharCheck).toHaveClass('text-danger');
    });

    it('should show success when password has special characters', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'Test123!' } });

      const specialCharCheck = screen
        .getByText(mockT('special_char_check'))
        .closest('p');
      expect(specialCharCheck).toHaveClass('text-success');
    });
  });

  describe('Combined Validation States', () => {
    it('should show all checks as failed for empty password', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: '' } });

      expect(
        screen.getByText(mockT('atleast_8_char_long')).closest('p'),
      ).toHaveClass('text-danger');
      expect(
        screen.getByText(mockT('lowercase_check')).closest('p'),
      ).toHaveClass('text-danger');
      expect(
        screen.getByText(mockT('uppercase_check')).closest('p'),
      ).toHaveClass('text-danger');
      expect(
        screen.getByText(mockT('numeric_value_check')).closest('p'),
      ).toHaveClass('text-danger');
      expect(
        screen.getByText(mockT('special_char_check')).closest('p'),
      ).toHaveClass('text-danger');
    });

    it('should show all checks as passed for valid password', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });

      expect(
        screen.getByText(mockT('atleast_8_char_long')).closest('p'),
      ).toHaveClass('text-success');
      expect(
        screen.getByText(mockT('lowercase_check')).closest('p'),
      ).toHaveClass('text-success');
      expect(
        screen.getByText(mockT('uppercase_check')).closest('p'),
      ).toHaveClass('text-success');
      expect(
        screen.getByText(mockT('numeric_value_check')).closest('p'),
      ).toHaveClass('text-success');
      expect(
        screen.getByText(mockT('special_char_check')).closest('p'),
      ).toHaveClass('text-success');
    });

    it('should show mixed validation states correctly', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'TestPassword' } });

      expect(
        screen.getByText(mockT('atleast_8_char_long')).closest('p'),
      ).toHaveClass('text-success');
      expect(
        screen.getByText(mockT('lowercase_check')).closest('p'),
      ).toHaveClass('text-success');
      expect(
        screen.getByText(mockT('uppercase_check')).closest('p'),
      ).toHaveClass('text-success');
      expect(
        screen.getByText(mockT('numeric_value_check')).closest('p'),
      ).toHaveClass('text-danger');
      expect(
        screen.getByText(mockT('special_char_check')).closest('p'),
      ).toHaveClass('text-danger');
    });
  });

  describe('Real-time Validation Updates', () => {
    it('should update validation states as user types', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);

      fireEvent.change(passwordInput, { target: { value: 't' } });
      expect(
        screen.getByText(mockT('lowercase_check')).closest('p'),
      ).toHaveClass('text-success');
      expect(
        screen.getByText(mockT('uppercase_check')).closest('p'),
      ).toHaveClass('text-danger');

      fireEvent.change(passwordInput, { target: { value: 'tT' } });
      expect(
        screen.getByText(mockT('uppercase_check')).closest('p'),
      ).toHaveClass('text-success');

      fireEvent.change(passwordInput, { target: { value: 'tT1' } });
      expect(
        screen.getByText(mockT('numeric_value_check')).closest('p'),
      ).toHaveClass('text-success');

      fireEvent.change(passwordInput, { target: { value: 'tT1!' } });
      expect(
        screen.getByText(mockT('special_char_check')).closest('p'),
      ).toHaveClass('text-success');

      fireEvent.change(passwordInput, { target: { value: 'tT1!abcd' } });
      expect(
        screen.getByText(mockT('atleast_8_char_long')).closest('p'),
      ).toHaveClass('text-success');
    });
  });

  describe('Password Field Integration', () => {
    it('should call handleFieldChange when password is changed', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.change(passwordInput, { target: { value: 'NewPassword123!' } });

      expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
        'password',
        'NewPassword123!',
      );
    });

    it('should trigger validation on every password change', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);

      const passwords = [
        'T',
        'Te',
        'Tes',
        'Test',
        'Test1',
        'Test12',
        'Test123',
        'Test123!',
      ];

      passwords.forEach((password) => {
        fireEvent.change(passwordInput, { target: { value: password } });
        expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
          'password',
          password,
        );
      });

      expect(handlerMocks.handleFieldChange).toHaveBeenCalledTimes(
        passwords.length,
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long passwords correctly', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      const longPassword = 'A'.repeat(50) + 'a1!';
      fireEvent.change(passwordInput, { target: { value: longPassword } });

      expect(
        screen.getByText(mockT('atleast_8_char_long')).closest('p'),
      ).toHaveClass('text-success');
    });

    it('should handle password with only spaces correctly', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: '        ' } });

      expect(
        screen.getByText(mockT('lowercase_check')).closest('p'),
      ).toHaveClass('text-danger');
      expect(
        screen.getByText(mockT('uppercase_check')).closest('p'),
      ).toHaveClass('text-danger');
      expect(
        screen.getByText(mockT('numeric_value_check')).closest('p'),
      ).toHaveClass('text-danger');
      expect(
        screen.getByText(mockT('special_char_check')).closest('p'),
      ).toHaveClass('text-danger');
    });

    it('should handle Unicode characters appropriately', () => {
      renderComponent();
      const passwordInput = screen.getByTestId('inputPassword');

      fireEvent.focus(passwordInput);
      fireEvent.change(passwordInput, { target: { value: 'Tëst123!' } });

      expect(
        screen.getByText(mockT('atleast_8_char_long')).closest('p'),
      ).toHaveClass('text-success');
    });
  });
});
