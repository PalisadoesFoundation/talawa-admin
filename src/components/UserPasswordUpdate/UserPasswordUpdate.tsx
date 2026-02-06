/**
 * UserUpdate Component.
 *
 * Provides a form for updating a user's password via GraphQL mutation.
 */
import React from 'react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';
import styles from '../../style/app-fixed.module.css';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

interface InterfaceUserPasswordUpdateProps {
  id: string;
}

// Form reset constant to avoid duplication
const INITIAL_FORM_STATE = {
  previousPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export const UserUpdate: React.FC<
  InterfaceUserPasswordUpdateProps
> = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userPasswordUpdate',
  });
  const { t: tCommon } = useTranslation('common');

  const [formState, setFormState] = React.useState(INITIAL_FORM_STATE);

  const [login] = useMutation(UPDATE_USER_PASSWORD_MUTATION);

  /**
   * Handles the form submission to update the password.
   * Validates the inputs and calls the mutation.
   */
  const loginLink = async (): Promise<string | void> => {
    if (
      !formState.previousPassword ||
      !formState.newPassword ||
      !formState.confirmNewPassword
    ) {
      NotificationToast.error(t('passCantBeEmpty') as string);
      return;
    }

    if (formState.newPassword !== formState.confirmNewPassword) {
      NotificationToast.error(t('passNoMatch') as string);
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
        NotificationToast.success(
          tCommon('updatedSuccessfully', { item: 'Password' }) as string,
        );
        // Reset form state after successful update
        setFormState(INITIAL_FORM_STATE);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.toString());
      }
    }
  };

  /**
   * Handles canceling the update process.
   * Resets the form to its initial state.
   */
  const cancelUpdate = (): void => {
    setFormState(INITIAL_FORM_STATE);
  };

  return (
    <>
      <div id="userupdate" className={styles.userupdatediv}>
        <form>
          {/* <h3 className={styles.settingstitle}>Update Your Details</h3> */}
          <div className={styles.dispflexUserPasswordUpdate}>
            <div>
              <FormTextField
                name="previousPassword"
                label={t('previousPassword')}
                type="password"
                placeholder={t('previousPassword')}
                autoComplete="off"
                required
                value={formState.previousPassword}
                onChange={(value: string): void => {
                  setFormState({
                    ...formState,
                    previousPassword: value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflexUserPasswordUpdate}>
            <div>
              <FormTextField
                name="newPassword"
                label={t('newPassword')}
                type="password"
                placeholder={t('newPassword')}
                autoComplete="off"
                required
                value={formState.newPassword}
                onChange={(value: string): void => {
                  setFormState({ ...formState, newPassword: value });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflexUserPasswordUpdate}>
            <div>
              <FormTextField
                name="confirmNewPassword"
                label={t('confirmNewPassword')}
                type="password"
                placeholder={t('confirmNewPassword')}
                autoComplete="off"
                required
                value={formState.confirmNewPassword}
                onChange={(value: string): void => {
                  setFormState({
                    ...formState,
                    confirmNewPassword: value,
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
