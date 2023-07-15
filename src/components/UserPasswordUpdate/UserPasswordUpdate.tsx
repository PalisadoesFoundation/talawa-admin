import React from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import styles from './UserPasswordUpdate.module.css';
import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';

interface InterfaceUserPasswordUpdateProps {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserUpdate: React.FC<InterfaceUserPasswordUpdateProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
}): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userPasswordUpdate',
  });
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
      toast.error('The password field cannot be empty.');
      return;
    }

    if (formState.newPassword !== formState.confirmNewPassword) {
      toast.error('New and Confirm password do not match.');
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
        toast.success('Successful updated');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      toast.error(error.toString());
    }
  };

  /* istanbul ignore next */
  const cancelUpdate = (): void => {
    window.location.reload();
  };

  return (
    <>
      <div id="userupdate" className={styles.userupdatediv}>
        <form>
          {/* <h3 className={styles.settingstitle}>Update Your Details</h3> */}
          <div className={styles.dispflex}>
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
          <div className={styles.dispflex}>
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
          <div className={styles.dispflex}>
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
              {t('saveChanges')}
            </Button>
            <Button
              type="button"
              className={styles.whitebtn}
              value="cancelchanges"
              onClick={cancelUpdate}
            >
              {t('cancel')}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
export default UserUpdate;
