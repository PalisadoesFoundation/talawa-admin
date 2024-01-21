import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import styles from './UserUpdate.module.css';
import convertToBase64 from 'utils/convertToBase64';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { useLocation } from 'react-router-dom';

import { languages } from 'utils/languages';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import { Form } from 'react-bootstrap';
import Loader from 'components/Loader/Loader';
import useLocalStorage from 'utils/useLocalstorage';

interface InterfaceUserUpdateProps {
  id: string;
  toggleStateValue: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserUpdate: React.FC<InterfaceUserUpdateProps> = ({
  id,
  toggleStateValue,
}): JSX.Element => {
  const location = useLocation<InterfaceUserUpdateProps>();
  const { getItem, setItem } = useLocalStorage();
  const currentUrl = location.state?.id || getItem('id') || id;
  const { t } = useTranslation('translation', {
    keyPrefix: 'userUpdate',
  });
  const [formState, setFormState] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    applangcode: '',
    file: '',
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  const {
    data: data,
    loading: loading,
    error: error,
  } = useQuery(USER_DETAILS, {
    variables: { id: currentUrl }, // For testing we are sending the id as a prop
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
    return <Loader />;
  }

  /* istanbul ignore next */
  if (error) {
    window.location.assign(`/orgsettings/id=${currentUrl}`);
  }

  const loginLink = async (): Promise<void> => {
    try {
      const firstName = formState.firstName;
      const lastName = formState.lastName;
      const email = formState.email;
      const file = formState.file;
      let toSubmit = true;
      if (firstName.trim().length == 0 || !firstName) {
        toast.warning('First Name cannot be blank!');
        toSubmit = false;
      }
      if (lastName.trim().length == 0 || !lastName) {
        toast.warning('Last Name cannot be blank!');
        toSubmit = false;
      }
      if (email.trim().length == 0 || !email) {
        toast.warning('Email cannot be blank!');
        toSubmit = false;
      }
      if (!toSubmit) return;
      const { data } = await updateUser({
        variables: {
          //Currently on these  fields are supported by the api
          firstName,
          lastName,
          email,
          file,
        },
      });
      /* istanbul ignore next */
      if (data) {
        setFormState({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          applangcode: '',
          file: '',
        });
        setItem('FirstName', firstName);
        setItem('LastName', lastName);
        setItem('Email', email);
        setItem('UserImage', file);
        toast.success('Successful updated');

        toggleStateValue();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  /* istanbul ignore next */
  const cancelUpdate = (): void => {
    toggleStateValue();
  };

  return (
    <>
      <div id="userupdate" className={styles.userupdatediv}>
        <form>
          {/* <h3 className={styles.settingstitle}>Update Your Details</h3> */}
          <div className={styles.dispflex}>
            <div>
              <label>{t('firstName')}</label>
              <Form.Control
                type="input"
                id="firstname"
                placeholder={t('firstName')}
                autoComplete="off"
                required
                value={formState.firstName}
                onChange={(e): void => {
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
              <Form.Control
                type="input"
                id="lastname"
                placeholder={t('lastName')}
                autoComplete="off"
                required
                value={formState.lastName}
                onChange={(e): void => {
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
              <Form.Control
                type="email"
                id="email"
                placeholder={t('email')}
                autoComplete="off"
                required
                value={formState.email}
                onChange={(e): void => {
                  setFormState({
                    ...formState,
                    email: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          <div className={styles.dispflex}>
            <div>
              <label>
                {t('appLanguageCode')}
                <select
                  className="form-control"
                  data-testid="applangcode"
                  onChange={(e): void => {
                    setFormState({
                      ...formState,
                      applangcode: e.target.value,
                    });
                  }}
                >
                  {languages.map((language, index: number) => (
                    <option key={index} value={language.code}>
                      {language.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className={styles.dispflex}>
            <label htmlFor="orgphoto" className={styles.orgphoto}>
              {t('displayImage')}:
              <Form.Control
                accept="image/*"
                id="orgphoto"
                name="photo"
                type="file"
                multiple={false}
                onChange={async (e: React.ChangeEvent): Promise<void> => {
                  const target = e.target as HTMLInputElement;
                  const file = target.files && target.files[0];
                  if (file)
                    setFormState({
                      ...formState,
                      file: await convertToBase64(file),
                    });
                }}
                data-testid="organisationImage"
              />
            </label>
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
          </div>
        </form>
      </div>
    </>
  );
};
export default UserUpdate;
