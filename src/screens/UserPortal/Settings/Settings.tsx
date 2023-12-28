import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Settings.module.css';
import UserSidebar from 'components/UserPortal/UserSidebar/UserSidebar';
import UserNavbar from 'components/UserPortal/UserNavbar/UserNavbar';
import { Button, Form } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { errorHandler } from 'utils/errorHandler';
import { toast } from 'react-toastify';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';

export default function settings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'settings',
  });

  const { data } = useQuery(CHECK_AUTH);
  const [image, setImage] = React.useState('');
  const [updateUserDetails] = useMutation(UPDATE_USER_MUTATION);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleUpdateUserDetails = async (): Promise<void> => {
    let variables: any = {
      firstName,
      lastName,
    };

    /* istanbul ignore next */
    if (image) {
      variables = {
        ...variables,
        file: image,
      };
    }
    try {
      const { data } = await updateUserDetails({
        variables,
      });

      /* istanbul ignore next */
      if (data) {
        setImage('');
        toast.success('Your details have been updated.');
        setTimeout(() => {
          window.location.reload();
        }, 500);

        const userFullName = `${firstName} ${lastName}`;
        localStorage.setItem('name', userFullName);
      }
    } catch (error: any) {
      errorHandler(t, error);
    }
  };

  const handleFirstNameChange = (e: any): void => {
    const { value } = e.target;
    setFirstName(value);
  };

  const handleLastNameChange = (e: any): void => {
    const { value } = e.target;
    setLastName(value);
  };

  React.useEffect(() => {
    /* istanbul ignore next */
    if (data) {
      setFirstName(data.checkAuth.firstName);
      setLastName(data.checkAuth.lastName);
      setEmail(data.checkAuth.email);
    }
  }, [data]);

  return (
    <>
      <UserNavbar />
      <div className={`d-flex flex-row ${styles.containerHeight}`}>
        <UserSidebar />
        <div className={`${styles.mainContainer}`}>
          <h3>{t('profileSettings')}</h3>
          <div className={`${styles.content} rounded-4`}>
            <div className={`${styles.formHeader}`}>
              <div className={`${styles.formTitle}`}>Update Profile</div>
            </div>
            <div className={`${styles.formBody}`}>
              <Form.Label
                htmlFor="inputFirstName"
                className={`${styles.formLabel}`}
              >
                {t('firstName')}
              </Form.Label>
              <Form.Control
                type="text"
                id="inputFirstName"
                value={firstName}
                onChange={handleFirstNameChange}
                className={`${styles.formControl}`}
                data-testid="inputFirstName"
              />
              <Form.Label
                htmlFor="inputLastName"
                className={`${styles.formLabel}`}
              >
                {t('lastName')}
              </Form.Label>
              <Form.Control
                type="text"
                id="inputLastName"
                value={lastName}
                onChange={handleLastNameChange}
                className={`${styles.formControl}`}
                data-testid="inputLastName"
              />
              <Form.Label
                htmlFor="inputEmail"
                className={`${styles.formLabel}`}
              >
                {t('emailAddress')}
              </Form.Label>
              <Form.Control
                type="email"
                id="inputEmail"
                value={email}
                className={`${styles.formControl}`}
                disabled
              />
              <Form.Label htmlFor="postphoto" className={`${styles.formLabel}`}>
                {t('updateImage')}
              </Form.Label>
              <Form.Control
                accept="image/*"
                id="postphoto"
                name="photo"
                type="file"
                className={styles.formControl}
                multiple={false}
                onChange={
                  /* istanbul ignore next */
                  async (e: React.ChangeEvent): Promise<void> => {
                    const target = e.target as HTMLInputElement;
                    const file = target.files && target.files[0];
                    if (file) {
                      const image = await convertToBase64(file);
                      setImage(image);
                    }
                  }
                }
              />
              <div>
                <Button
                  onClick={handleUpdateUserDetails}
                  data-testid="updateUserBtn"
                  className={`${styles.formButton}`}
                >
                  {t('saveChanges')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
