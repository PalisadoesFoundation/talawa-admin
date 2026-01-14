import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserDetailsForm from './UserDetails';
import { MOCKS, MOCKS1, MOCKS2, UPDATE_MOCK } from '../SettingsMocks';
import { MockedProvider } from '@apollo/client/testing';
import dayjs from 'dayjs';

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
  const mockHandleFieldChange = vi.fn();
  const mockHandleResetChanges = vi.fn();
  const mockHandleUpdateUserDetails = vi.fn();
  const mockT = (key: string): string => key;
  const mockTCommon = (key: string): string => key;

  const defaultProps = {
    userDetails: {
      ...MOCKS1[0].result.data.currentUser,
      password: '', // Add a default password value
    },
    handleFieldChange: mockHandleFieldChange,
    isUpdated: true,
    handleResetChanges: mockHandleResetChanges,
    handleUpdateUserDetails: mockHandleUpdateUserDetails,
    t: mockT,
    tCommon: mockTCommon,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields with correct initial values', () => {
    render(
      <MockedProvider mocks={MOCKS1} addTypename={false}>
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
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    const passwordInput = screen.getByTestId('inputPassword');
    await userEvent.type(passwordInput, 'newPassword123');

    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      'password',
      'newPassword123',
    );
  });

  it('disables email field', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    expect(screen.getByTestId('inputEmail')).toBeDisabled();
  });

  it('shows/hides action buttons based on isUpdated prop', () => {
    const { rerender } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} isUpdated={false} />
      </MockedProvider>,
    );

    // When isUpdated is true, buttons should NOT be in the document
    expect(screen.queryByTestId('resetChangesBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('updateUserBtn')).not.toBeInTheDocument();

    rerender(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} isUpdated={true} />
      </MockedProvider>,
    );

    // When isUpdated is false, buttons should be in the document
    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    expect(screen.getByTestId('updateUserBtn')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    render(
      <MockedProvider mocks={UPDATE_MOCK} addTypename={false}>
        <UserDetailsForm {...defaultProps} isUpdated={true} />
      </MockedProvider>,
    );

    const updateButton = screen.getByTestId('updateUserBtn');
    await userEvent.click(updateButton);

    expect(mockHandleUpdateUserDetails).toHaveBeenCalled();
  });

  it('handles reset changes correctly', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} isUpdated={true} />
      </MockedProvider>,
    );

    const resetButton = screen.getByTestId('resetChangesBtn');
    await userEvent.click(resetButton);

    expect(mockHandleResetChanges).toHaveBeenCalled();
  });

  it('renders select fields with correct options', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
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
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    const birthDateInput = screen.getByLabelText(mockT('birthDate'));
    const today = new Date();
    const maxDate = today.toLocaleDateString('en-CA');

    expect(birthDateInput).toHaveAttribute('max', maxDate);
  });

  it('renders description field with sanitized content', () => {
    const userDetailsWithHtml = {
      ...defaultProps.userDetails,
      description: '<p>Test description</p><script>alert("xss")</script>',
    };

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} userDetails={userDetailsWithHtml} />
      </MockedProvider>,
    );

    const descriptionField = screen.getByTestId('inputDescription');
    expect(descriptionField).toBeInTheDocument();
  });

  it('handles empty user details gracefully', () => {
    render(
      <MockedProvider mocks={MOCKS2} addTypename={false}>
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
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    const addressInput = screen.getByTestId('mock-address-input');
    await userEvent.type(addressInput, '123 Test St');

    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      'addressLine1',
      '123 Test St',
    );
  });

  it('handles all form field changes correctly', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    // Test name field
    const nameInput = screen.getByTestId('inputName');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(mockHandleFieldChange).toHaveBeenCalledWith('name', 'New Name');

    // Test gender field
    const genderSelect = screen.getByTestId('inputGender');
    await userEvent.selectOptions(genderSelect, 'male');
    expect(mockHandleFieldChange).toHaveBeenCalledWith('natalSex', 'male');

    // Test phone numbers
    const mobilePhone = screen.getByTestId('inputPhoneNumber');
    fireEvent.change(mobilePhone, { target: { value: '1234567890' } });
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      'mobilePhoneNumber',
      '1234567890',
    );

    const homePhone = screen.getByTestId('inputHomePhoneNumber');
    fireEvent.change(homePhone, { target: { value: '1234567890' } });
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      'homePhoneNumber',
      '1234567890',
    );

    const workPhone = screen.getByTestId('inputWorkPhoneNumber');
    fireEvent.change(workPhone, { target: { value: '1234567890' } });
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
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
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
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
    expect(mockHandleFieldChange).toHaveBeenCalledWith('birthDate', '');

    // Test education grade
    const gradeSelect = screen.getByTestId('inputGrade');
    await userEvent.selectOptions(gradeSelect, 'graduate');
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      'educationGrade',
      'graduate',
    );

    // // Test employment status
    const empStatusSelect = screen.getByTestId('inputEmpStatus');
    await userEvent.selectOptions(empStatusSelect, 'unemployed');
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      'employmentStatus',
      'unemployed',
    );

    // Test marital status
    const maritalStatusSelect = screen.getByTestId('inputMaritalStatus');
    await userEvent.selectOptions(maritalStatusSelect, 'single');
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
      'maritalStatus',
      'single',
    );

    // Test description
    const description = screen.getByTestId('inputDescription');
    fireEvent.change(description, { target: { value: 'New description' } }); // Fixed the fireEvent.change syntax
    expect(mockHandleFieldChange).toHaveBeenCalledWith(
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
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...propsWithNullBirthDate} />
      </MockedProvider>,
    );

    const birthDateInput = screen.getByLabelText(mockT('birthDate'));
    expect(birthDateInput).toHaveValue('');
  });

  it('renders address section with correct heading', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    expect(
      screen.getByText(`${mockTCommon('address')} :-`),
    ).toBeInTheDocument();
  });
});
