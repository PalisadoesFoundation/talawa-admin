/**
 * @fileoverview RegistrationForm component for user registration
 * @description Handles registration functionality with validation and organization selection
 */

import { useMutation } from '@apollo/client';
import { Check, Clear } from '@mui/icons-material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Autocomplete, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { REACT_APP_USE_RECAPTCHA, RECAPTCHA_SITE_KEY } from 'Constant/constant';
import {
  RECAPTCHA_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import styles from '../../../style/app-fixed.module.css';
import type {
  InterfaceRegistrationFormProps,
  InterfaceRegistrationFormData,
  InterfacePasswordValidation,
  InterfaceUserData,
} from 'types/Auth/RegistrationForm/interface';

/**
 * RegistrationForm component for user registration
 */
const RegistrationForm: React.FC<InterfaceRegistrationFormProps> = ({
  organizations,
  onSuccess,
  onError,
  pendingInvitationToken,
  testId = 'registration-form',
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');
  const { setItem, removeItem } = useLocalStorage();

  // Form state
  const [signformState, setSignFormState] =
    useState<InterfaceRegistrationFormData>({
      signName: '',
      signEmail: '',
      signPassword: '',
      cPassword: '',
      signOrg: '',
    });

  // UI state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // Password validation state
  const [showAlert, setShowAlert] = useState<InterfacePasswordValidation>({
    lowercaseChar: true,
    uppercaseChar: true,
    numericValue: true,
    specialChar: true,
  });

  // Refs
  const SignupRecaptchaRef = useRef<ReCAPTCHA>(null);

  // GraphQL hooks
  const [signup, { loading: signinLoading }] = useMutation(SIGNUP_MUTATION);
  const [recaptcha] = useMutation(RECAPTCHA_MUTATION);

  // Password validation regex
  const passwordValidationRegExp = {
    lowercaseCharRegExp: new RegExp('[a-z]'),
    uppercaseCharRegExp: new RegExp('[A-Z]'),
    numericalValueRegExp: new RegExp('\\d'),
    specialCharRegExp: new RegExp('[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-]'),
  };

  // Handlers
  const togglePassword = (): void => setShowPassword(!showPassword);
  const toggleConfirmPassword = (): void =>
    setShowConfirmPassword(!showConfirmPassword);

  const handlePasswordCheck = (pass: string): void => {
    setShowAlert({
      lowercaseChar: !passwordValidationRegExp.lowercaseCharRegExp.test(pass),
      uppercaseChar: !passwordValidationRegExp.uppercaseCharRegExp.test(pass),
      numericValue: !passwordValidationRegExp.numericalValueRegExp.test(pass),
      specialChar: !passwordValidationRegExp.specialCharRegExp.test(pass),
    });
  };

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
  };

  const verifyRecaptcha = async (
    recaptchaToken: string | null,
  ): Promise<boolean | void> => {
    try {
      if (REACT_APP_USE_RECAPTCHA !== 'yes') {
        return true;
      }
      const { data } = await recaptcha({
        variables: {
          recaptchaToken,
        },
      });

      return data.recaptcha;
    } catch {
      toast.error(t('captchaError') as string);
    }
  };

  const signupLink = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const { signName, signEmail, signPassword, cPassword } = signformState;

    const isVerified = await verifyRecaptcha(recaptchaToken);

    if (!isVerified) {
      toast.error(t('Please_check_the_captcha') as string);
      return;
    }

    const isValidName = (value: string): boolean => {
      // Allow letters, spaces, and hyphens, but not consecutive spaces or hyphens
      return /^[a-zA-Z]+(?:[-\s][a-zA-Z]+)*$/.test(value.trim());
    };

    const validatePassword = (password: string): boolean => {
      const lengthCheck = new RegExp('^.{6,}$');
      return (
        lengthCheck.test(password) &&
        passwordValidationRegExp.lowercaseCharRegExp.test(password) &&
        passwordValidationRegExp.uppercaseCharRegExp.test(password) &&
        passwordValidationRegExp.numericalValueRegExp.test(password) &&
        passwordValidationRegExp.specialCharRegExp.test(password)
      );
    };

    if (
      isValidName(signName) &&
      signName.trim().length > 1 &&
      signEmail.length >= 8 &&
      signPassword.length > 1 &&
      validatePassword(signPassword)
    ) {
      if (cPassword == signPassword) {
        try {
          const { data: signUpData } = await signup({
            variables: {
              ID: signformState.signOrg,
              name: signName,
              email: signEmail,
              password: signPassword,
            },
          });

          if (signUpData) {
            toast.success(t('successfullyRegistered') as string);

            // Reset form
            setSignFormState({
              signName: '',
              signEmail: '',
              signPassword: '',
              cPassword: '',
              signOrg: '',
            });
            SignupRecaptchaRef.current?.reset();

            // If signup returned an authentication token, prepare user data
            if (signUpData.signUp && signUpData.signUp.authenticationToken) {
              const userData: InterfaceUserData = {
                token: signUpData.signUp.authenticationToken,
                user: {
                  id: signUpData.signUp.user?.id || '',
                  name: signName,
                  emailAddress: signEmail,
                  role: 'user', // Default role for new registrations
                  avatarURL: '',
                },
              };

              // Handle pending invitation token
              if (pendingInvitationToken) {
                setItem('token', signUpData.signUp.authenticationToken);
                setItem('IsLoggedIn', 'TRUE');
                setItem('name', signName);
                setItem('email', signEmail);
                removeItem('pendingInvitationToken');
                window.location.href = `/event/invitation/${pendingInvitationToken}`;
                return;
              }

              onSuccess(userData);
            } else {
              // Registration successful but no auto-login
              onSuccess({
                token: '',
                user: {
                  id: '',
                  name: signName,
                  emailAddress: signEmail,
                  role: 'user',
                  avatarURL: '',
                },
              });
            }
          }
        } catch (error) {
          errorHandler(t, error);
          SignupRecaptchaRef.current?.reset();
          onError(
            error instanceof Error ? error.message : 'Registration failed',
          );
        }
      } else {
        toast.warn(t('passwordMismatches') as string);
      }
    } else {
      if (!isValidName(signName)) {
        toast.warn(t('name_invalid') as string);
      }
      if (!validatePassword(signPassword)) {
        toast.warn(t('password_invalid') as string);
      }
      if (signEmail.length < 8) {
        toast.warn(t('email_invalid') as string);
      }
    }
  };

  return (
    <div data-testid={testId}>
      <Form onSubmit={signupLink}>
        <h1 className="fs-2 fw-bold text-dark mb-3" data-testid="register-text">
          {tCommon('register')}
        </h1>

        <Row>
          <div>
            <Form.Label>{tCommon('Name')}</Form.Label>
            <Form.Control
              disabled={signinLoading}
              type="text"
              id="signname"
              className="mb-3"
              placeholder={tCommon('Name')}
              required
              value={signformState.signName}
              onChange={(e): void => {
                setSignFormState({
                  ...signformState,
                  signName: e.target.value,
                });
              }}
            />
          </div>
        </Row>

        <div className="position-relative">
          <Form.Label>{tCommon('email')}</Form.Label>
          <div className="position-relative">
            <Form.Control
              disabled={signinLoading}
              type="email"
              data-testid="signInEmail"
              className="mb-3"
              placeholder={tCommon('email')}
              autoComplete="username"
              required
              value={signformState.signEmail}
              onChange={(e): void => {
                setSignFormState({
                  ...signformState,
                  signEmail: e.target.value.toLowerCase(),
                });
              }}
            />
            <Button tabIndex={-1} className={`${styles.email_button}`}>
              <EmailOutlinedIcon />
            </Button>
          </div>
        </div>

        <div className="position-relative mb-3">
          <Form.Label>{tCommon('password')}</Form.Label>
          <div className="position-relative">
            <Form.Control
              disabled={signinLoading}
              type={showPassword ? 'text' : 'password'}
              data-testid="passwordField"
              placeholder={tCommon('password')}
              autoComplete="new-password"
              onFocus={(): void => setIsInputFocused(true)}
              onBlur={(): void => setIsInputFocused(false)}
              required
              value={signformState.signPassword}
              onChange={(e): void => {
                setSignFormState({
                  ...signformState,
                  signPassword: e.target.value,
                });
                handlePasswordCheck(e.target.value);
              }}
            />
            <Button
              onClick={togglePassword}
              data-testid="showPassword"
              className={`${styles.email_button}`}
            >
              {showPassword ? (
                <i className="fas fa-eye"></i>
              ) : (
                <i className="fas fa-eye-slash"></i>
              )}
            </Button>
          </div>

          {/* Password strength indicators */}
          <div className={styles.password_checks}>
            {isInputFocused ? (
              signformState.signPassword.length < 6 ? (
                <div data-testid="passwordCheck">
                  <p
                    className={`form-text text-danger ${styles.password_check_element_top}`}
                  >
                    <span>
                      <Clear className="" />
                    </span>
                    {t('atleast_6_char_long')}
                  </p>
                </div>
              ) : (
                <p
                  className={`form-text text-success ${styles.password_check_element_top}`}
                >
                  <span>
                    <Check />
                  </span>
                  {t('atleast_6_char_long')}
                </p>
              )
            ) : null}

            {!isInputFocused &&
              signformState.signPassword.length > 0 &&
              signformState.signPassword.length < 6 && (
                <div
                  className={`form-text text-danger ${styles.password_check_element}`}
                  data-testid="passwordCheck"
                >
                  <span>
                    <Check className="size-sm" />
                  </span>
                  {t('atleast_6_char_long')}
                </div>
              )}
            {isInputFocused && (
              <p
                className={`form-text ${
                  showAlert.lowercaseChar ? 'text-danger' : 'text-success'
                } ${styles.password_check_element}`}
              >
                {showAlert.lowercaseChar ? (
                  <span>
                    <Clear />
                  </span>
                ) : (
                  <span>
                    <Check />
                  </span>
                )}
                {t('lowercase_check')}
              </p>
            )}
            {isInputFocused && (
              <p
                className={`form-text ${
                  showAlert.uppercaseChar ? 'text-danger' : 'text-success'
                } ${styles.password_check_element}`}
              >
                {showAlert.uppercaseChar ? (
                  <span>
                    <Clear />
                  </span>
                ) : (
                  <span>
                    <Check />
                  </span>
                )}
                {t('uppercase_check')}
              </p>
            )}
            {isInputFocused && (
              <p
                className={`form-text ${
                  showAlert.numericValue ? 'text-danger' : 'text-success'
                } ${styles.password_check_element}`}
              >
                {showAlert.numericValue ? (
                  <span>
                    <Clear />
                  </span>
                ) : (
                  <span>
                    <Check />
                  </span>
                )}
                {t('numeric_value_check')}
              </p>
            )}
            {isInputFocused && (
              <p
                className={`form-text ${
                  showAlert.specialChar ? 'text-danger' : 'text-success'
                } ${styles.password_check_element} ${
                  styles.password_check_element_bottom
                }`}
              >
                {showAlert.specialChar ? (
                  <span>
                    <Clear />
                  </span>
                ) : (
                  <span>
                    <Check />
                  </span>
                )}
                {t('special_char_check')}
              </p>
            )}
          </div>
        </div>

        <div className="position-relative">
          <Form.Label>{tCommon('confirmPassword')}</Form.Label>
          <div className="position-relative">
            <Form.Control
              disabled={signinLoading}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={tCommon('confirmPassword')}
              required
              value={signformState.cPassword}
              onChange={(e): void => {
                setSignFormState({
                  ...signformState,
                  cPassword: e.target.value,
                });
              }}
              data-testid="cpassword"
              autoComplete="new-password"
            />
            <Button
              data-testid="showPasswordCon"
              onClick={toggleConfirmPassword}
              className={`${styles.email_button}`}
            >
              {showConfirmPassword ? (
                <i className="fas fa-eye"></i>
              ) : (
                <i className="fas fa-eye-slash"></i>
              )}
            </Button>
          </div>
          {signformState.cPassword.length > 0 &&
            signformState.signPassword !== signformState.cPassword && (
              <div
                className="form-text text-danger"
                data-testid="passwordCheck"
              >
                {t('Password_and_Confirm_password_mismatches.')}
              </div>
            )}
        </div>

        <div className="position-relative my-2">
          <Form.Label>{t('selectOrg')}</Form.Label>
          <div className="position-relative">
            <Autocomplete
              disablePortal
              data-testid="selectOrg"
              onChange={(
                event,
                value: { label: string; id: string } | null,
              ) => {
                setSignFormState({
                  ...signformState,
                  signOrg: value?.id ?? '',
                });
              }}
              options={organizations}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Organizations"
                  className={styles.selectOrgText}
                />
              )}
            />
          </div>
        </div>

        {REACT_APP_USE_RECAPTCHA === 'yes' ? (
          <div className="mt-3">
            <ReCAPTCHA
              ref={SignupRecaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY : 'XXX'}
              onChange={handleCaptcha}
            />
          </div>
        ) : (
          <></>
        )}

        <Button
          type="submit"
          className={`mt-4 fw-bold w-100 mb-3 ${styles.login_btn}`}
          value="Register"
          data-testid="registrationBtn"
          disabled={signinLoading}
        >
          {tCommon('register')}
        </Button>
      </Form>
    </div>
  );
};

export default RegistrationForm;
