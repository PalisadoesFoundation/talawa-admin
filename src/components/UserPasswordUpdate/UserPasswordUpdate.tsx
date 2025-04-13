/**
 * UserUpdate Component
 *
 * This component provides a user interface for updating a user's password.
 * It includes form fields for entering the previous password, a new password,
 * and confirming the new password. The component validates the input and
 * communicates with the backend to update the password using a GraphQL mutation.
 *
 * @file UserPasswordUpdate.tsx
 * @module UserUpdate
 * @requires React
 * @requires @apollo/client - For executing the GraphQL mutation.
 * @requires GraphQl/Mutations/mutations - Contains the `UPDATE_USER_PASSWORD_MUTATION`.
 * @requires react-i18next - For internationalization and translations.
 * @requires react-bootstrap/Button - For styled buttons.
 * @requires react-bootstrap/Form - For form controls.
 * @requires style/app.module.css - For component-specific styles.
 * @requires react-toastify - For displaying success and error notifications.
 *
 * @interface InterfaceUserPasswordUpdateProps
 * @property {string} id - The unique identifier of the user whose password is being updated.
 *
 * @function UserUpdate
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - Validates that all fields are filled and that the new password matches the confirmation.
 * - Displays success or error messages using `react-toastify`.
 * - Reloads the page after a successful update or when the user cancels the operation.
 *
 * @example
 * ```tsx
 * <UserUpdate id="12345" />
 * ```
 */
import React from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import styles from '../../style/app-fixed.module.css';
import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';

interface InterfaceUserPasswordUpdateProps {
  id: string;
}

const UserUpdate: React.FC<
  InterfaceUserPasswordUpdateProps
> = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userPasswordUpdate',
  });
  const { t: tCommon } = useTranslation('common');
  const [formState, setFormState] = React.useState({
    previousPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [login] = useMutation(UPDATE_USER_PASSWORD_MUTATION);

  const loginLink = async (): Promise<string | void> => {
    if (
      !formState.previousPassword ||
      !formState.newPassword ||
      !formState.confirmNewPassword
    ) {
      toast.error(t('passCantBeEmpty') as string);
      return;
    }

    if (formState.newPassword !== formState.confirmNewPassword) {
      toast.error(t('passNoMatch') as string);
      return;
    }

    try {
      const { data } = await login({
        variables: {
          previousPassword: formState.previousPassword,
          newPassword: formState.newPassword,
          confirmNewPassword: formState.confirmNewPassword,
        },
      });
      if (data) {
        toast.success(
          tCommon('updatedSuccessfully', { item: 'Password' }) as string,
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.toString());
      }
    }
  };

  /**
   * Handles canceling the update process.
   * It reloads the page to reset any changes.
   */
  const cancelUpdate = (): void => {
    window.location.reload();
  };

  return (
    <>
      <div id="userupdate" className={styles.userupdatediv}>
        <form>
          {/* <h3 className={styles.settingstitle}>Update Your Details</h3> */}
          <div className={styles.dispflexUserPasswordUpdate}>
            <div>
              <label>{t('previousPassword')}</label>
              <Form.Control
                type="password"
                id="previousPassword"
                placeholder={t('previousPassword')}
                autoComplete="off"
                required
                value={formState.previousPassword}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    previousPassword: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflexUserPasswordUpdate}>
            <div>
              <label>{t('newPassword')}</label>
              <Form.Control
                type="password"
                id="newPassword"
                placeholder={t('newPassword')}
                autoComplete="off"
                required
                value={formState.newPassword}
                onChange={(e): void => {
                  setFormState({ ...formState, newPassword: e.target.value });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflexUserPasswordUpdate}>
            <div>
              <label>{t('confirmNewPassword')}</label>
              <Form.Control
                type="password"
                id="confirmNewPassword"
                placeholder={t('confirmNewPassword')}
                autoComplete="off"
                required
                value={formState.confirmNewPassword}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    confirmNewPassword: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispbtnflex}>
            <Button
              type="button"
              className={styles.regBtn}
              value="savechanges"
              onClick={loginLink}
            >
              {tCommon('saveChanges')}
            </Button>
            <Button
              type="button"
              className={styles.whitebtn}
              value="cancelchanges"
              onClick={cancelUpdate}
            >
              {tCommon('cancel')}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
export default UserUpdate;
