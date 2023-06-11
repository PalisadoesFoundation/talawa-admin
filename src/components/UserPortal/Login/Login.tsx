import type { ChangeEvent, SetStateAction } from 'react';
import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { LockOutlined } from '@mui/icons-material';
import { Link, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import { LOGIN_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './Login.module.css';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceLoginProps {
  setCurrentMode: React.Dispatch<SetStateAction<string>>;
}

export default function login(props: InterfaceLoginProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'userLogin' });

  const { setCurrentMode } = props;

  const handleModeChangeToRegister = (): void => {
    setCurrentMode('register');
  };

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const [loginVariables, setLoginVariables] = React.useState({
    email: '',
    password: '',
  });

  const history = useHistory();

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

        if (data.login.user.adminApproved) {
          localStorage.setItem('userToken', data.login.accessToken);
          localStorage.setItem('userId', data.login.user._id);

          navigator.clipboard.writeText('');
          /* istanbul ignore next */
          history.replace('/user/organizations');
        } else {
          toast.warn(t('notAuthorised'));
        }
      } catch (error: any) {
        /* istanbul ignore next */
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
      <div className="mt-1">{t('loginIntoYourAccount')}</div>

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
          <InputGroup.Text className={`bg-success ${styles.borderNone}`}>
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
          <InputGroup.Text className={`bg-success ${styles.borderNone}`}>
            <LockOutlined className={`${styles.colorWhite}`} />
          </InputGroup.Text>
        </InputGroup>
      </div>

      <div className={styles.forgotPasswordContainer}>
        <Link to="/forgotPassword" className={`${styles.forgotPasswordText}`}>
          <u>{t('forgotPassword')}</u>
        </Link>
      </div>

      <Button variant="success" onClick={handleLogin} data-testid="loginBtn">
        {t('login')}
      </Button>
      <hr />
      <Button
        variant="outline-success"
        onClick={handleModeChangeToRegister}
        data-testid="setRegisterBtn"
      >
        {t('register')}
      </Button>
    </>
  );
}
