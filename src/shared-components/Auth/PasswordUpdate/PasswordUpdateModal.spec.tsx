import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import PasswordUpdateModal from './PasswordUpdateModal';
import type { InterfacePasswordUpdateModalProps } from 'types/shared-components/PasswordUpdateModal/interface';

/* ---------------- MOCK i18n ---------------- */

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PasswordUpdateModal', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnChange = vi.fn();

  const defaultProps: InterfacePasswordUpdateModalProps = {
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

  it('renders modal correctly', () => {
    render(<PasswordUpdateModal {...defaultProps} />);

    expect(screen.getByTestId('update-password-modal')).toBeInTheDocument();
    expect(screen.getByText('Update Password')).toBeInTheDocument();
  });

  it('renders all password fields when hidePreviousPassword is false', () => {
    render(<PasswordUpdateModal {...defaultProps} />);

    expect(screen.getByTestId('previousPasswordField')).toBeInTheDocument();
    expect(screen.getByTestId('newPasswordField')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPasswordField')).toBeInTheDocument();
  });

  it('hides previous password field when hidePreviousPassword is true', () => {
    render(
      <PasswordUpdateModal {...defaultProps} hidePreviousPassword={true} />,
    );

    expect(
      screen.queryByTestId('previousPasswordField'),
    ).not.toBeInTheDocument();

    expect(screen.getByTestId('newPasswordField')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPasswordField')).toBeInTheDocument();
  });

  it('renders correct field values', () => {
    render(<PasswordUpdateModal {...defaultProps} />);

    expect(screen.getByDisplayValue('old123')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('new123')).toHaveLength(2);
  });

  it('handles undefined oldPassword safely', () => {
    const props: InterfacePasswordUpdateModalProps = {
      ...defaultProps,
      values: {
        oldPassword: undefined,
        newPassword: '',
        confirmNewPassword: '',
      },
    };

    render(<PasswordUpdateModal {...props} />);

    const previousField = screen.getByTestId(
      'previousPasswordField',
    ) as HTMLInputElement;

    expect(previousField.value).toBe('');
  });

  it('calls onChange when typing in new password field', async () => {
    render(<PasswordUpdateModal {...defaultProps} />);

    const input = screen.getByTestId('newPasswordField');

    await user.type(input, 'x');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onSubmit when primary button clicked', async () => {
    render(<PasswordUpdateModal {...defaultProps} />);

    const button = screen.getByText('Save');

    await user.click(button);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when modal close button clicked', async () => {
    render(<PasswordUpdateModal {...defaultProps} />);

    const closeButtons = screen.getAllByRole('button');

    await user.click(closeButtons[0]);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
