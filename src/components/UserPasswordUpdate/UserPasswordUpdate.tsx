/**
 * UserUpdate Component
 *
 * This component provides a user interface for updating a user's password.
 * It supports two modes:
 * 1. User Mode: Requires the previous password to be entered.
 * 2. Admin Mode: Does not require the previous password (used for admins resetting passwords).
 *
 * It includes form fields for entering the password(s) and confirming the new password.
 * The component validates the input and communicates with the backend using GraphQL mutations.
 *
/**
 * UserUpdate Component
 *
 * This component provides a user interface for updating a user's password.
 * It supports two modes:
 * 1. User Mode: Requires the previous password to be entered.
 * 2. Admin Mode: Does not require the previous password (used for admins resetting passwords).
 *
 * It includes form fields for entering the password(s) and confirming the new password.
 * The component validates the input and communicates with the backend using GraphQL mutations.
 */
import React from 'react';
import { useMutation } from '@apollo/client';
import {
  UPDATE_USER_PASSWORD_MUTATION,
  UPDATE_USER_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared-components/Button';
import styles from './UserPasswordUpdate.module.css';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { InterfaceUserPasswordUpdateProps } from 'types/shared-components/UserPasswordUpdate/interface';
import { validatePassword } from 'utils/passwordValidator';

// Form reset constant
const INITIAL_FORM_STATE = {
  previousPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export const UserUpdate: React.FC<InterfaceUserPasswordUpdateProps> = ({
  userId,
  requirePreviousPassword = true,
  onCancel,
  onSuccess,
}): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userPasswordUpdate',
  });
  const { t: tCommon } = useTranslation('common');

  const [formState, setFormState] = React.useState(INITIAL_FORM_STATE);

  // Mutation for self-update (User Mode)
  const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD_MUTATION);
  // Mutation for admin update (Admin Mode)
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  /**
   * Handles the form submission to update the password.
   * Validates the inputs and calls the appropriate mutation.
   */
  const handleSave = async (): Promise<void> => {
    // 1. Validation
    if (requirePreviousPassword && !formState.previousPassword) {
      NotificationToast.error(t('passCantBeEmpty') as string);
      return;
    }

    if (!formState.newPassword || !formState.confirmNewPassword) {
      NotificationToast.error(t('passCantBeEmpty') as string);
      return;
    }

    if (formState.newPassword !== formState.confirmNewPassword) {
      NotificationToast.error(t('passNoMatch') as string);
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(formState.newPassword);
    if (passwordError) {
      NotificationToast.error(passwordError);
      return;
    }

    try {
      if (requirePreviousPassword) {
        // User Mode: Use UPDATE_USER_PASSWORD_MUTATION
        const { data } = await updateUserPassword({
          variables: {
            previousPassword: formState.previousPassword,
            newPassword: formState.newPassword,
            confirmNewPassword: formState.confirmNewPassword,
          },
        });
        if (data) {
          NotificationToast.success(
            tCommon('updatedSuccessfully', { item: 'Password' }) as string,
          );
          setFormState(INITIAL_FORM_STATE);
          if (onSuccess) onSuccess();
        }
      } else {
        // Admin Mode: Use UPDATE_USER_MUTATION
        if (!userId) {
          NotificationToast.error(t('users.userIdRequired'));
          return;
        }

        const { data } = await updateUser({
          variables: {
            input: {
              id: userId,
              password: formState.newPassword,
            },
          },
        });

        if (data) {
          NotificationToast.success(
            tCommon('updatedSuccessfully', { item: 'Password' }) as string,
          );
          setFormState(INITIAL_FORM_STATE);
          if (onSuccess) onSuccess();
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  /**
   * Handles canceling the update process.
   * Resets the form to its initial state.
   */
  const handleCancel = (): void => {
    setFormState(INITIAL_FORM_STATE);
    onCancel();
  };

  return (
    <div className={styles.userupdatediv}>
      <form>
        {requirePreviousPassword && (
          <div className={styles.dispflexUserPasswordUpdate}>
            <div>
              <div>
                <FormFieldGroup
                  label={t('previousPassword')}
                  inputId="previousPassword"
                  name="previousPassword"
                >
                  <input
                    type="password"
                    id="previousPassword"
                    placeholder={t('previousPassword')}
                    autoComplete="off"
                    required
                    className="form-control"
                    value={formState.previousPassword}
                    onChange={(e): void => {
                      setFormState({
                        ...formState,
                        previousPassword: e.target.value,
                      });
                    }}
                  />
                </FormFieldGroup>
              </div>
            </div>
          </div>
        )}
        <div className={styles.dispflexUserPasswordUpdate}>
          <div>
            <div>
              <FormFieldGroup
                label={t('newPassword')}
                inputId="newPassword"
                name="newPassword"
              >
                <input
                  type="password"
                  id="newPassword"
                  placeholder={t('newPassword')}
                  autoComplete="off"
                  required
                  className="form-control"
                  value={formState.newPassword}
                  onChange={(e): void => {
                    setFormState({ ...formState, newPassword: e.target.value });
                  }}
                />
              </FormFieldGroup>
            </div>
          </div>
        </div>
        <div className={styles.dispflexUserPasswordUpdate}>
          <div>
            <FormFieldGroup
              label={t('confirmNewPassword')}
              inputId="confirmNewPassword"
              name="confirmNewPassword"
            >
              <input
                type="password"
                id="confirmNewPassword"
                placeholder={t('confirmNewPassword')}
                autoComplete="off"
                required
                className="form-control"
                value={formState.confirmNewPassword}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    confirmNewPassword: e.target.value,
                  });
                }}
              />
            </FormFieldGroup>
          </div>
        </div>
        <div className={styles.dispbtnflex}>
          <Button type="button" className={styles.regBtn} onClick={handleSave}>
            {tCommon('saveChanges')}
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            className={styles.whitebtn}
            onClick={handleCancel}
          >
            {tCommon('cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default UserUpdate;
