import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserDetailsForm from './UserDetails';
import { MOCKS, Mocks1, Mocks2, updateMock } from '../SettingsMocks';
import { MockedProvider } from '@apollo/client/testing';

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
      ...Mocks1[0].result.data.currentUser,
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
      <MockedProvider mocks={Mocks1} addTypename={false}>
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

    expect(screen.queryByTestId('resetChangesBtn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('updateUserBtn')).not.toBeInTheDocument();

    rerender(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} isUpdated={true} />
      </MockedProvider>,
    );

    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    expect(screen.getByTestId('updateUserBtn')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    render(
      <MockedProvider mocks={updateMock} addTypename={false}>
        <UserDetailsForm {...defaultProps} />
      </MockedProvider>,
    );

    const updateButton = screen.getByTestId('updateUserBtn');
    await userEvent.click(updateButton);

    expect(mockHandleUpdateUserDetails).toHaveBeenCalled();
  });

  it('handles reset changes correctly', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <UserDetailsForm {...defaultProps} />
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
    const maxDate = new Date().toISOString().split('T')[0];

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
      <MockedProvider mocks={Mocks2} addTypename={false}>
        <UserDetailsForm
          {...defaultProps}
          userDetails={{ ...Mocks2[0].result.data.currentUser, password: '' }}
        />
      </MockedProvider>,
    );

    expect(screen.getByTestId('inputName')).toHaveValue('');
    expect(screen.getByTestId('inputEmail')).toHaveValue('');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('');
  });
});
