/**
 * Registration form for new users in the user portal.
 *
 * Renders inputs for first name, last name, email, and password with validation and mutation handling.
 *
 * @remarks
 * Integrates the signup GraphQL mutation, toast notifications, i18n translations, and provides a control
 * to switch back to login mode.
 *
 * @param props - Props containing a setter to change the current authentication mode.
 * @returns A registration form with validated inputs and submit handling.
 *
 * @example
 * ```tsx
 * <Register setCurrentMode={setModeFunction} />
 * ```
 */
import type { ChangeEvent, SetStateAction } from 'react';
import React from 'react';
import { InputGroup } from 'react-bootstrap';
import Button from 'shared-components/Button';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { LockOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';

import styles from './Register.module.css';
import { useMutation } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { errorHandler } from 'utils/errorHandler';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

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
      NotificationToast.error(t('invalidDetailsMessage')); // Error if fields are missing
    } else if (
      registerVariables.password !== registerVariables.confirmPassword
    ) {
      NotificationToast.error(t('passwordNotMatch')); // Error if passwords do not match
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

        NotificationToast.success(t('afterRegister')); // Success message

        // Reset form fields
        setRegisterVariables({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } catch (error: unknown) {
        // Handle any errors during registration
        errorHandler(t, error);
      }
    }
  };

  /**
   * Updates the state with the first name input value.
   * @param e - Change event from the input element
   */
  const handleFirstName = (e: ChangeEvent<HTMLInputElement>): void => {
    const firstName = e.target.value;
    setRegisterVariables({ ...registerVariables, firstName });
  };

  /**
   * Updates the state with the last name input value.
   * @param e - Change event from the input element
   */
  const handleLastName = (e: ChangeEvent<HTMLInputElement>): void => {
    const lastName = e.target.value;
    setRegisterVariables({ ...registerVariables, lastName });
  };

  /**
   * Updates the state with the email input value.
   * @param e - Change event from the input element
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const email = e.target.value;
    setRegisterVariables({ ...registerVariables, email });
  };

  /**
   * Updates the state with the password input value.
   * @param e - Change event from the input element
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;

    setRegisterVariables({ ...registerVariables, password });
  };

  /**
   * Updates the state with the confirm password input value.
   * @param e - Change event from the input element
   */
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
        <div className="mb-3">
          <FormFieldGroup
            name="firstNameInput"
            label={tCommon('firstName')}
            required
          >
            <InputGroup>
              <input
                id="firstNameInput"
                placeholder={t('enterFirstName')}
                className={`${styles.borderNone} form-control`}
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
          </FormFieldGroup>
        </div>
        <div className="mb-3">
          <FormFieldGroup
            name="lastNameInput"
            label={tCommon('lastName')}
            required
          >
            <InputGroup>
              <input
                id="lastNameInput"
                placeholder={t('enterLastName')}
                className={`${styles.borderNone} form-control`}
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
          </FormFieldGroup>
        </div>
        <div className="mb-3">
          <FormFieldGroup
            name="emailInput"
            label={tCommon('emailAddress')}
            required
          >
            <InputGroup>
              <input
                id="emailInput"
                placeholder={tCommon('enterEmail')}
                type="email"
                className={`${styles.borderNone} form-control`}
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
          </FormFieldGroup>
        </div>
        <div className="mb-3">
          <FormFieldGroup
            name="passwordInput"
            label={tCommon('password')}
            required
          >
            <InputGroup>
              <input
                id="passwordInput"
                placeholder={tCommon('enterPassword')}
                type="password"
                className={`${styles.borderNone} form-control`}
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
          </FormFieldGroup>
        </div>
        <div className="mb-3">
          <FormFieldGroup
            name="confirmPasswordInput"
            label={tCommon('confirmPassword')}
            required
          >
            <InputGroup>
              <input
                id="confirmPasswordInput"
                placeholder={t('enterConfirmPassword')}
                type="password"
                className={`${styles.borderNone} form-control`}
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
          </FormFieldGroup>
        </div>
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
