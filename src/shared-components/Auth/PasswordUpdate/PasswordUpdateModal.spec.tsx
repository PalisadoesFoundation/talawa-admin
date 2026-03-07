import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

import PasswordUpdateModal from './PasswordUpdateModal';
import type { InterfacePasswordUpdateModalProps } from 'types/shared-components/PasswordUpdateModal/interface';

const renderWithI18n = (props: InterfacePasswordUpdateModalProps) =>
  render(
    <I18nextProvider i18n={i18nForTest}>
      <PasswordUpdateModal {...props} />
    </I18nextProvider>,
  );

describe('PasswordUpdateModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let mockOnClose: ReturnType<typeof vi.fn>;
  let mockOnSubmit: ReturnType<typeof vi.fn>;
  let mockOnChange: ReturnType<typeof vi.fn>;
  let defaultProps: InterfacePasswordUpdateModalProps;

  beforeEach(() => {
    user = userEvent.setup();
    mockOnClose = vi.fn();
    mockOnSubmit = vi.fn();
    mockOnChange = vi.fn();

    defaultProps = {
      open: true,
      onClose: mockOnClose,
      onSubmit: mockOnSubmit,
      onChange: mockOnChange,
      title: 'Update Password',
      saveText: 'Save',
      oldPasswordLabel: 'Old Password',
      newPasswordLabel: 'New Password',
      confirmPasswordLabel: 'Confirm Password',
      values: {
        oldPassword: 'old123',
        newPassword: 'new123',
        confirmNewPassword: 'new123',
      },
    };
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders modal with title', () => {
    renderWithI18n(defaultProps);

    expect(screen.getByTestId('update-password-modal')).toBeInTheDocument();
    expect(screen.getByText('Update Password')).toBeInTheDocument();
  });

  it('renders all password fields when hidePreviousPassword is false', () => {
    renderWithI18n(defaultProps);

    expect(screen.getByTestId('previousPasswordField')).toBeInTheDocument();
    expect(screen.getByTestId('newPasswordField')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPasswordField')).toBeInTheDocument();
  });

  it('does not render previous password field for admin flow', () => {
    renderWithI18n({
      ...defaultProps,
      hidePreviousPassword: true,
    });

    expect(
      screen.queryByTestId('previousPasswordField'),
    ).not.toBeInTheDocument();

    expect(screen.getByTestId('newPasswordField')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPasswordField')).toBeInTheDocument();
  });

  it('renders password values correctly', () => {
    renderWithI18n(defaultProps);

    expect(screen.getByDisplayValue('old123')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('new123')).toHaveLength(2);
  });

  it('handles undefined oldPassword safely', () => {
    renderWithI18n({
      ...defaultProps,
      values: {
        oldPassword: undefined,
        newPassword: '',
        confirmNewPassword: '',
      },
    });

    const previousPasswordField = screen.getByTestId(
      'previousPasswordField',
    ) as HTMLInputElement;

    expect(previousPasswordField.value).toBe('');
  });

  it('calls onChange when user types new password', async () => {
    renderWithI18n(defaultProps);

    const newPasswordInput = screen.getByTestId('newPasswordField');

    await user.type(newPasswordInput, 'x');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onSubmit when save button clicked', async () => {
    renderWithI18n(defaultProps);

    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button clicked', async () => {
    renderWithI18n(defaultProps);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button clicked', async () => {
    renderWithI18n(defaultProps);

    const closeButton = screen.getByRole('button', { name: /close/i });

    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
