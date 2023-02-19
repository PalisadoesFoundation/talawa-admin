import React from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';

import styles from './UserUpdate.module.css';

interface UserUpdateProps {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function UserUpdate(props: UserUpdateProps): JSX.Element {
  const [formState, setFormState] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    applangcode: '',
    selectedOption: '',
  });

  const [login] = useMutation(UPDATE_USER_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'userUpdate',
  });

  const login_link = async () => {
    try {
      const { data } = await login({
        variables: {
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
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
              <label>{t('firstName')}</label>
              <input
                type="input"
                id="firstname"
                placeholder={t('firstName')}
                autoComplete="off"
                required
                value={formState.firstName}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    firstName: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label>{t('lastName')}</label>
              <input
                type="input"
                id="lastname"
                placeholder={t('lastName')}
                autoComplete="off"
                required
                value={formState.lastName}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    lastName: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflex}>
            <div>
              <label>{t('email')}</label>
              <input
                type="email"
                id="email"
                placeholder={t('email')}
                autoComplete="off"
                required
                value={formState.email}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    email: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label>{t('password')}</label>
              <input
                type="password"
                id="password"
                placeholder={t('password')}
                required
                value={formState.password}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    password: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.dispflex}>
            <div>
              <label>{t('appLanguageCode')}</label>
              <input
                type="input"
                id="applangcode"
                placeholder={t('appLanguageCode')}
                required
                value={formState.applangcode}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    applangcode: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label>{t('userType')}</label>
              <div className={styles.radio_buttons}>
                <input
                  type="radio"
                  id="admin"
                  value="selectadmin"
                  name="selectRole"
                  checked={formState.selectedOption === 'selectadmin'}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      selectedOption: e.target.value,
                    });
                  }}
                />
                <label htmlFor="admin">{t('admin')}</label>
                <input
                  type="radio"
                  id="superadmin"
                  value="selectsuperadmin"
                  name="selectRole"
                  checked={formState.selectedOption === 'selectsuperadmin'}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      selectedOption: e.target.value,
                    });
                  }}
                />
                <label htmlFor="superadmin">{t('superAdmin')}</label>
              </div>
            </div>
          </div>
          <label htmlFor="orgphoto" className={styles.orgphoto}>
            {t('displayImage')}:
            <input
              accept="image/*"
              id="orgphoto"
              name="photo"
              type="file"
              multiple={false}
              //onChange=""
            />
          </label>
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
}
export default UserUpdate;
