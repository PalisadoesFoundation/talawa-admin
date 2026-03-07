import React from 'react';

import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { PasswordField } from 'shared-components/Auth/PasswordField/PasswordField';
import { InterfacePasswordUpdateModalProps } from 'types/shared-components/PasswordUpdateModal/interface';

/**
 * PasswordUpdateModal component.
 *
 * @remarks
 * A reusable modal for updating user passwords. It renders password fields
 * for old password, new password, and confirmation using {@link PasswordField}.
 * The previous password field can optionally be hidden (e.g., when an admin
 * updates another user's password).
 *
 * @param props - {@link InterfacePasswordUpdateModalProps}
 * - `open`: Controls modal visibility.
 * - `onClose`: Callback triggered when the modal is closed.
 * - `onSubmit`: Handler executed when the password update action is confirmed.
 * - `values`: Current password form values.
 * - `onChange`: Change handler for password inputs.
 * - `hidePreviousPassword`: Hides the old password field when `true`.
 *
 * @returns A modal dialog containing password update fields and submit actions.
 */
export const PasswordUpdateModal: React.FC<
  InterfacePasswordUpdateModalProps
> = ({
  open,
  onClose,
  onSubmit,
  values,
  onChange,
  hidePreviousPassword = false,
  title,
  saveText,
  oldPasswordLabel,
  newPasswordLabel,
  confirmPasswordLabel,
  loading,
}) => {
  return (
    <CRUDModalTemplate
      open={open}
      title={title}
      onClose={onClose}
      onPrimary={onSubmit}
      primaryText={saveText}
      loading={loading}
      data-testid="update-password-modal"
    >
      {!hidePreviousPassword && (
        <PasswordField
          label={oldPasswordLabel}
          name="oldPassword"
          value={values.oldPassword ?? ''}
          onChange={onChange}
          testId="previousPasswordField"
        />
      )}

      <PasswordField
        label={newPasswordLabel}
        name="newPassword"
        value={values.newPassword}
        onChange={onChange}
        testId="newPasswordField"
      />

      <PasswordField
        label={confirmPasswordLabel}
        name="confirmNewPassword"
        value={values.confirmNewPassword}
        onChange={onChange}
        testId="confirmPasswordField"
      />
    </CRUDModalTemplate>
  );
};

export default PasswordUpdateModal;
