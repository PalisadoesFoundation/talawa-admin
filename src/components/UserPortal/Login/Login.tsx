<<<<<<< HEAD
import { useMutation } from '@apollo/client';
import { LockOutlined } from '@mui/icons-material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import type { ChangeEvent, SetStateAction } from 'react';
import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LOGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './Login.module.css';
=======
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { LockOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import { LOGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './Login.module.css';
import { errorHandler } from 'utils/errorHandler';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

interface InterfaceLoginProps {
  setCurrentMode: React.Dispatch<SetStateAction<string>>;
}

export default function login(props: InterfaceLoginProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userLogin' });

<<<<<<< HEAD
  const navigate = useNavigate();

  const { setCurrentMode } = props;

  const { setItem } = useLocalStorage();

=======
  const { setCurrentMode } = props;

>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  const handleModeChangeToRegister = (): void => {
    setCurrentMode('register');
  };

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const [loginVariables, setLoginVariables] = React.useState({
    email: '',
    password: '',
  });

  const handleLogin = async (): Promise<void> => {
    if (!(loginVariables.email && loginVariables.password)) {
      toast.error(t('invalidDetailsMessage'));
    } else {
      try {
        const { data } = await loginMutation({
          variables: {
            email: loginVariables.email,
            password: loginVariables.password,
          },
        });

<<<<<<< HEAD
        setItem('token', data.login.accessToken);
        setItem('userId', data.login.user._id);
        navigate('/user/organizations');
      } catch (error: any) {
=======
        if (data) {
          localStorage.setItem('token', data.login.accessToken);
          localStorage.setItem('userId', data.login.user._id);

          navigator.clipboard.writeText('');
          /* istanbul ignore next */
          window.location.assign('/user/organizations');
        } else {
          toast.warn(t('notAuthorised'));
        }
      } catch (error: any) {
        /* istanbul ignore next */
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        errorHandler(t, error);
      }
    }
  };

  /* istanbul ignore next */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const email = e.target.value;

    setLoginVariables({
      email,
      password: loginVariables.password,
    });
  };

  /* istanbul ignore next */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;

    setLoginVariables({
      email: loginVariables.email,
      password,
    });
  };

  return (
    <>
      <h3 className="mt-3 font-weight-bold">{t('login')}</h3>
<<<<<<< HEAD
=======
      <div className="mt-1">{t('loginIntoYourAccount')}</div>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

      <div className="my-3">
        <h6>{t('emailAddress')}</h6>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={t('enterEmail')}
            type="email"
            className={styles.borderNone}
            value={loginVariables.email}
            onChange={handleEmailChange}
          />
          <InputGroup.Text
            className={`${styles.colorPrimary} ${styles.borderNone}`}
          >
            <EmailOutlinedIcon className={`${styles.colorWhite}`} />
          </InputGroup.Text>
        </InputGroup>
        <h6>{t('password')}</h6>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={t('enterPassword')}
            type="password"
            className={styles.borderNone}
            value={loginVariables.password}
            onChange={handlePasswordChange}
          />
          <InputGroup.Text
            className={`${styles.colorPrimary} ${styles.borderNone}`}
          >
            <LockOutlined className={`${styles.colorWhite}`} />
          </InputGroup.Text>
        </InputGroup>
      </div>

      <div className={styles.forgotPasswordContainer}>
        <Link to="/forgotPassword" className={`${styles.forgotPasswordText}`}>
          <u>{t('forgotPassword')}</u>
        </Link>
      </div>

      <Button
        className={`${styles.colorPrimary} ${styles.borderNone}`}
        variant="success"
        onClick={handleLogin}
        data-testid="loginBtn"
      >
        {t('login')}
      </Button>
      <hr />
      <Button
        className={`${styles.colorPrimaryHover}`}
        variant="outline-success"
        onClick={handleModeChangeToRegister}
        data-testid="setRegisterBtn"
      >
        {t('register')}
      </Button>
    </>
  );
}
