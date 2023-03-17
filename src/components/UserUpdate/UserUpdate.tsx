import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import styles from './UserUpdate.module.css';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';

interface UserUpdateProps {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserUpdate: React.FC<UserUpdateProps> = ({ id }): JSX.Element => {
  const currentUrl = localStorage.getItem('id');
  const { t } = useTranslation('translation', {
    keyPrefix: 'userUpdate',
  });
  const [formState, setFormState] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [login] = useMutation(UPDATE_USER_MUTATION);

  const {
    data: data,
    loading: loading,
    error: error,
  } = useQuery(USER_DETAILS, {
    variables: { id: localStorage.getItem('id') ?? id }, // For testing we are sending the id as a prop
  });
  React.useEffect(() => {
    if (data) {
      setFormState({
        ...formState,
        firstName: data?.user?.firstName,
        lastName: data?.user?.lastName,
        email: data?.user?.email,
      });
    }
  }, [data]);

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  /* istanbul ignore next */
  if (error) {
    window.location.assign(`/orgsettings/id=${currentUrl}`);
  }

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
        toast.success('Successful updated');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      if (error.message === 'Failed to fetch') {
        toast.error(
          'Talawa-API service is unavailable. Is it running? Check your network connectivity too.'
        );
      } else {
        toast.error(error.message);
      }
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
          </div>
          <div className={styles.dispflex}>
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
