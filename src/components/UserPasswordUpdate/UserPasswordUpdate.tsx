import React from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PASSWORD_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import styles from './UserPasswordUpdate.module.css';

interface UserPasswordUpdateProps {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserUpdate: React.FC<UserPasswordUpdateProps> = ({ id }): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userPasswordUpdate',
  });
  const [formState, setFormState] = React.useState({
    previousPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [login] = useMutation(UPDATE_USER_PASSWORD_MUTATION);

  const login_link = async () => {
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
        window.alert('Successful updated');
        window.location.reload();
      }
    } catch (error) {
      /* istanbul ignore next */
      window.alert(error);
    }
  };

  /* istanbul ignore next */
  const cancelUpdate = () => {
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
              <input
                type="password"
                id="previousPassword"
                placeholder={t('previousPassword')}
                autoComplete="off"
                required
                value={formState.previousPassword}
                onChange={(e) => {
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
              <input
                type="password"
                id="newPassword"
                placeholder={t('newPassword')}
                autoComplete="off"
                required
                value={formState.newPassword}
                onChange={(e) => {
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
              <input
                type="password"
                id="confirmNewPassword"
                placeholder={t('confirmNewPassword')}
                autoComplete="off"
                required
                value={formState.confirmNewPassword}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    confirmNewPassword: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispbtnflex}>
            <button
              type="button"
              className={styles.greenregbtn}
              value="savechanges"
              onClick={login_link}
            >
              {t('saveChanges')}
            </button>
            <button
              type="button"
              className={styles.whitebtn}
              value="cancelchanges"
              onClick={cancelUpdate}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default UserUpdate;
