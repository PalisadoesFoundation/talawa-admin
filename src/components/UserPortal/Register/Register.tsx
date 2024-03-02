import type { ChangeEvent, SetStateAction } from 'react';
import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { LockOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';

import styles from './Register.module.css';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceRegisterProps {
  setCurrentMode: React.Dispatch<SetStateAction<string>>;
}

export default function register(props: InterfaceRegisterProps): JSX.Element {
  const { setCurrentMode } = props;

  const { t } = useTranslation('translation', { keyPrefix: 'userRegister' });

  const handleModeChangeToLogin = (): void => {
    setCurrentMode('login');
  };

  const [registerMutation] = useMutation(SIGNUP_MUTATION);

  const [registerVariables, setRegisterVariables] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async (): Promise<void> => {
    if (
      !(
        registerVariables.email &&
        registerVariables.password &&
        registerVariables.firstName &&
        registerVariables.lastName
      )
    ) {
      toast.error(t('invalidDetailsMessage'));
    } else if (
      registerVariables.password !== registerVariables.confirmPassword
    ) {
      toast.error(t('passwordNotMatch'));
    } else {
      try {
        await registerMutation({
          variables: {
            firstName: registerVariables.firstName,
            lastName: registerVariables.lastName,
            email: registerVariables.email,
            password: registerVariables.password,
          },
        });

        toast.success(t('afterRegister'));

        /* istanbul ignore next */
        setRegisterVariables({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } catch (error: any) {
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    }
  };

  /* istanbul ignore next */
  const handleFirstName = (e: ChangeEvent<HTMLInputElement>): void => {
    const firstName = e.target.value;

    setRegisterVariables({ ...registerVariables, firstName });
  };

  /* istanbul ignore next */
  const handleLastName = (e: ChangeEvent<HTMLInputElement>): void => {
    const lastName = e.target.value;

    setRegisterVariables({ ...registerVariables, lastName });
  };

  /* istanbul ignore next */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const email = e.target.value;

    setRegisterVariables({ ...registerVariables, email });
  };

  /* istanbul ignore next */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;

    setRegisterVariables({ ...registerVariables, password });
  };

  /* istanbul ignore next */
  const handleConfirmPasswordChange = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const confirmPassword = e.target.value;

    setRegisterVariables({ ...registerVariables, confirmPassword });
  };

  return (
    <>
      <h3 className="mt-3 font-weight-bold">{t('register')}</h3>
      <div className="my-3">
        <h6>{t('firstName')}</h6>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={t('enterFirstName')}
            className={styles.borderNone}
            value={registerVariables.firstName}
            onChange={handleFirstName}
            data-testid="firstNameInput"
          />
          <InputGroup.Text
            className={`${styles.colorPrimary} ${styles.borderNone}`}
          >
            <BadgeOutlinedIcon className={`${styles.colorWhite}`} />
          </InputGroup.Text>
        </InputGroup>
        <h6>{t('lastName')}</h6>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={t('enterLastName')}
            className={styles.borderNone}
            value={registerVariables.lastName}
            onChange={handleLastName}
            data-testid="lastNameInput"
          />
          <InputGroup.Text
            className={`${styles.colorPrimary} ${styles.borderNone}`}
          >
            <BadgeOutlinedIcon className={`${styles.colorWhite}`} />
          </InputGroup.Text>
        </InputGroup>
        <h6>{t('emailAddress')}</h6>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={t('enterEmail')}
            type="email"
            className={styles.borderNone}
            value={registerVariables.email}
            onChange={handleEmailChange}
            data-testid="emailInput"
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
            value={registerVariables.password}
            onChange={handlePasswordChange}
            data-testid="passwordInput"
          />
          <InputGroup.Text
            className={`${styles.colorPrimary} ${styles.borderNone}`}
          >
            <LockOutlined className={`${styles.colorWhite}`} />
          </InputGroup.Text>
        </InputGroup>
        <h6>{t('confirmPassword')}</h6>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={t('enterConfirmPassword')}
            type="password"
            className={styles.borderNone}
            value={registerVariables.confirmPassword}
            onChange={handleConfirmPasswordChange}
            data-testid="confirmPasswordInput"
          />
          <InputGroup.Text
            className={`${styles.colorPrimary} ${styles.borderNone}`}
          >
            <LockOutlined className={`${styles.colorWhite}`} />
          </InputGroup.Text>
        </InputGroup>
      </div>
      <Button
        className={`${styles.colorPrimary} ${styles.borderNone}`}
        variant="success"
        onClick={handleRegister}
        data-testid="registerBtn"
      >
        {t('register')}
      </Button>

      <div className="mt-4 text-center">
        {t('alreadyhaveAnAccount')}{' '}
        <span
          onClick={handleModeChangeToLogin}
          className={styles.loginText}
          data-testid="setLoginBtn"
        >
          <u>{t('login')}</u>
        </span>
      </div>
    </>
  );
}
