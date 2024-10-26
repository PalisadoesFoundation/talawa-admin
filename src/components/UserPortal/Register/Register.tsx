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
  /**
   * Function to change the current mode (e.g., from register to login).
   */
  setCurrentMode: React.Dispatch<SetStateAction<string>>;
}

export default function register(props: InterfaceRegisterProps): JSX.Element {
  const { setCurrentMode } = props;

  // Translation hooks for user registration and common text
  const { t } = useTranslation('translation', { keyPrefix: 'userRegister' });
  const { t: tCommon } = useTranslation('common');

  /**
   * Changes the mode to login when invoked.
   */
  const handleModeChangeToLogin = (): void => {
    setCurrentMode('login');
  };

  // Mutation hook for user registration
  const [registerMutation] = useMutation(SIGNUP_MUTATION);

  // State to manage the registration form variables
  const [registerVariables, setRegisterVariables] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  /**
   * Handles the registration process by validating inputs and invoking the mutation.
   */
  const handleRegister = async (): Promise<void> => {
    if (
      !(
        registerVariables.email &&
        registerVariables.password &&
        registerVariables.firstName &&
        registerVariables.lastName
      )
    ) {
      toast.error(t('invalidDetailsMessage') as string); // Error if fields are missing
    } else if (
      registerVariables.password !== registerVariables.confirmPassword
    ) {
      toast.error(t('passwordNotMatch') as string); // Error if passwords do not match
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

        toast.success(t('afterRegister') as string); // Success message

        // Reset form fields
        /* istanbul ignore next */
        setRegisterVariables({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } catch (error: unknown) {
        // Handle any errors during registration
        /* istanbul ignore next */
        errorHandler(t, error);
      }
    }
  };

  /**
   * Updates the state with the first name input value.
   * @param e - Change event from the input element
   */
  /* istanbul ignore next */
  const handleFirstName = (e: ChangeEvent<HTMLInputElement>): void => {
    const firstName = e.target.value;
    setRegisterVariables({ ...registerVariables, firstName });
  };

  /**
   * Updates the state with the last name input value.
   * @param e - Change event from the input element
   */
  /* istanbul ignore next */
  const handleLastName = (e: ChangeEvent<HTMLInputElement>): void => {
    const lastName = e.target.value;
    setRegisterVariables({ ...registerVariables, lastName });
  };

  /**
   * Updates the state with the email input value.
   * @param e - Change event from the input element
   */
  /* istanbul ignore next */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const email = e.target.value;
    setRegisterVariables({ ...registerVariables, email });
  };

  /**
   * Updates the state with the password input value.
   * @param e - Change event from the input element
   */
  /* istanbul ignore next */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;

    setRegisterVariables({ ...registerVariables, password });
  };

  /**
   * Updates the state with the confirm password input value.
   * @param e - Change event from the input element
   */
  /* istanbul ignore next */
  const handleConfirmPasswordChange = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const confirmPassword = e.target.value;

    setRegisterVariables({ ...registerVariables, confirmPassword });
  };

  return (
    <>
      <h3 className="mt-3 font-weight-bold">{tCommon('register')}</h3>
      <div className="my-3">
        <h6>{tCommon('firstName')}</h6>
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
        <h6>{tCommon('lastName')}</h6>
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
        <h6>{tCommon('emailAddress')}</h6>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={tCommon('enterEmail')}
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
        <h6>{tCommon('password')}</h6>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={tCommon('enterPassword')}
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
        <h6>{tCommon('confirmPassword')}</h6>
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
        {tCommon('register')}
      </Button>

      <div className="mt-4 text-center">
        {t('alreadyhaveAnAccount')}{' '}
        <span
          onClick={handleModeChangeToLogin}
          className={styles.loginText}
          data-testid="setLoginBtn"
        >
          <u>{tCommon('login')}</u>
        </span>
      </div>
    </>
  );
}
