import React from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import styles from '../../style/app.module.css';
import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';

interface InterfaceUserPasswordUpdateProps {
  id: string;
}

/**
 * UserUpdate component allows users to update their passwords.
 * It handles form submission and communicates with the backend to update the user's password.
 *
 * @param props - The properties for the UserUpdate component.
 * @param id - The ID of the user whose password is being updated.
 *
 * @returns The JSX element for updating user password.
 */
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

  /**
   * Handles the password update process.
   * It validates the form inputs and performs the mutation to update the password.
   */
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
      /* istanbul ignore next */
      if (data) {
        toast.success(
          tCommon('updatedSuccessfully', { item: 'Password' }) as string,
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        toast.error(error.toString());
      }
    }
  };

  /**
   * Handles canceling the update process.
   * It reloads the page to reset any changes.
   */
  /* istanbul ignore next */
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
                  setFormState({
                    ...formState,
                    newPassword: e.target.value,
                  });
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
              className={styles.greenregbtn}
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
