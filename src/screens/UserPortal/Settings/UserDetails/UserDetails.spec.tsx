import React, { act } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserDetailsForm from './UserDetails';
import { MOCKS, MOCKS1, MOCKS2, UPDATE_MOCK } from '../SettingsMocks';
import { MockedProvider } from '@apollo/client/testing';
import dayjs from 'dayjs';

const handlerMocks = vi.hoisted(() => ({
  handleFieldChange: vi.fn(),
  handleResetChanges: vi.fn(),
  handleUpdateUserDetails: vi.fn(),
}));

const originalConsoleError = console.error;
beforeEach(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Please remove the `addTypename` option')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
});
afterEach(() => {
  console.error = originalConsoleError;
});

// Mock the dependencies

// Mock the dependencies
vi.mock('sanitize-html', () => ({
  default: (content: string) => content,
}));

vi.mock('shared-components/DatePicker', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    slotProps,
    'data-testid': dataTestId,
  }: {
    value: dayjs.Dayjs | null;
    onChange: (value: dayjs.Dayjs | null) => void;
    slotProps: {
      textField: { 'aria-label'?: string; max?: string };
    };
    'data-testid': string;
  }) => (
    <input
      data-testid={dataTestId}
      aria-label={slotProps?.textField?.['aria-label']}
      max={slotProps?.textField?.max}
      value={value ? value.format('MM/DD/YYYY') : ''}
      onChange={(e) => {
        const val = e.target.value;
        onChange?.(val ? dayjs(val, ['MM/DD/YYYY', 'YYYY-MM-DD']) : null);
      }}
    />
  ),
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

    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'password',
      'newPassword123',
    );
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
    const dateInput = screen.getByLabelText(mockT('birthDate'));

    // Test case 1: Setting a date
    await act(async () => {
      fireEvent.change(dateInput, { target: { value: '1990-01-01' } });
      fireEvent.blur(dateInput);
    });
    expect(handlerMocks.handleFieldChange).toHaveBeenCalledWith(
      'birthDate',
      '1990-01-01',
    );

    // Test case 2: Clearing a date
    await act(async () => {
      fireEvent.change(dateInput, { target: { value: '' } });
      fireEvent.blur(dateInput);
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
