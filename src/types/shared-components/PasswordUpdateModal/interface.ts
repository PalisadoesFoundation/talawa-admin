export interface InterfacePasswordUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;

  values: {
    oldPassword?: string;
    newPassword: string;
    confirmNewPassword: string;
  };

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  hidePreviousPassword?: boolean;
  title: string;
  saveText: string;
  oldPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
}
