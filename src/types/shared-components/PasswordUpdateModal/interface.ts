import type { ChangeEvent } from 'react';

/** Props for the shared PasswordUpdateModal component. */
export interface InterfacePasswordUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;

  values: {
    oldPassword?: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  loading?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;

  hidePreviousPassword?: boolean;
  title: string;
  saveText: string;
  oldPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
}
