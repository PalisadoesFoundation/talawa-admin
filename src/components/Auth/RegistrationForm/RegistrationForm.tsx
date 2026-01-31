import React, { useState, useRef } from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import { Check, Clear } from '@mui/icons-material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Autocomplete, TextField } from '@mui/material';
import {
  SIGNUP_MUTATION,
  RECAPTCHA_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { REACT_APP_USE_RECAPTCHA, RECAPTCHA_SITE_KEY } from 'Constant/constant';
import { errorHandler } from 'utils/errorHandler';
import type { IRegistrationFormProps } from 'types/Auth/RegistrationForm';
import styles from '../../../style/app-fixed.module.css';

export const RegistrationForm: React.FC<IRegistrationFormProps> = ({
  organizations,
  onSuccess,
  loading = false,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });
  const { t: tCommon } = useTranslation('common');

  const [formState, setFormState] = useState({
    signName: '',
    signEmail: '',
    signPassword: '',
    cPassword: '',
    signOrg: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showAlert, setShowAlert] = useState({
    lowercaseChar: true,
    uppercaseChar: true,
    numericValue: true,
    specialChar: true,
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const SignupRecaptchaRef = useRef<ReCAPTCHA>(null);

  const [signup, { loading: signinLoading }] = useMutation(SIGNUP_MUTATION);
  const [recaptcha] = useMutation(RECAPTCHA_MUTATION);

  const passwordValidationRegExp = {
    lowercaseCharRegExp: new RegExp('[a-z]'),
    uppercaseCharRegExp: new RegExp('[A-Z]'),
    numericalValueRegExp: new RegExp('\\d'),
    specialCharRegExp: new RegExp('[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-]'),
  };

  const handlePasswordCheck = (pass: string): void => {
    setShowAlert({
      lowercaseChar: !passwordValidationRegExp.lowercaseCharRegExp.test(pass),
      uppercaseChar: !passwordValidationRegExp.uppercaseCharRegExp.test(pass),
      numericValue: !passwordValidationRegExp.numericalValueRegExp.test(pass),
      specialChar: !passwordValidationRegExp.specialCharRegExp.test(pass),
    });
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

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
  };

  const togglePassword = (): void => setShowPassword(!showPassword);
  const toggleConfirmPassword = (): void =>
    setShowConfirmPassword(!showConfirmPassword);

  const signupLink = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const { signName, signEmail, signPassword, cPassword } = formState;

    const isVerified = await verifyRecaptcha(recaptchaToken);

    if (!isVerified) {
      toast.error(t('Please_check_the_captcha') as string);
      return;
    }

    const isValidName = (value: string): boolean => {
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
              ID: formState.signOrg,
              name: signName,
              email: signEmail,
              password: signPassword,
            },
          });

          if (signUpData?.signUp) {
            if (signUpData.signUp.authenticationToken) {
              onSuccess({
                user: signUpData.signUp.user,
                authenticationToken: signUpData.signUp.authenticationToken,
              });
            } else {
              toast.success(t('afterRegister') as string);
            }
          }
        } catch (error) {
          errorHandler(t, error);
          SignupRecaptchaRef.current?.reset();
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
    <Form onSubmit={signupLink}>
      <h1 className="fs-2 fw-bold text-dark mb-3" data-testid="register-text">
        {tCommon('register')}
      </h1>
      <Row>
        <div>
          <Form.Label>{tCommon('Name')}</Form.Label>
          <Form.Control
            disabled={loading || signinLoading}
            type="text"
            id="signname"
            className="mb-3"
            placeholder={tCommon('Name')}
            required
            value={formState.signName}
            onChange={(e): void => {
              setFormState({
                ...formState,
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
            disabled={loading || signinLoading}
            type="email"
            data-testid="signInEmail"
            className="mb-3"
            placeholder={tCommon('email')}
            autoComplete="username"
            required
            value={formState.signEmail}
            onChange={(e): void => {
              setFormState({
                ...formState,
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
            disabled={loading || signinLoading}
            type={showPassword ? 'text' : 'password'}
            data-testid="passwordField"
            placeholder={tCommon('password')}
            autoComplete="new-password"
            onFocus={(): void => setIsInputFocused(true)}
            onBlur={(): void => setIsInputFocused(false)}
            required
            value={formState.signPassword}
            onChange={(e): void => {
              setFormState({
                ...formState,
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
        <div className={styles.password_checks}>
          {isInputFocused ? (
            formState.signPassword.length < 6 ? (
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
            formState.signPassword.length > 0 &&
            formState.signPassword.length < 6 && (
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
            disabled={loading || signinLoading}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={tCommon('confirmPassword')}
            required
            value={formState.cPassword}
            onChange={(e): void => {
              setFormState({
                ...formState,
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
        {formState.cPassword.length > 0 &&
          formState.signPassword !== formState.cPassword && (
            <div className="form-text text-danger" data-testid="passwordCheck">
              {t('Password_and_Confirm_password_mismatches.')}
            </div>
          )}
      </div>
      <div className="position-relative  my-2">
        <Form.Label>{t('selectOrg')}</Form.Label>
        <div className="position-relative">
          <Autocomplete
            disablePortal
            data-testid="selectOrg"
            onChange={(event, value: { label: string; id: string } | null) => {
              setFormState({
                ...formState,
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
        disabled={loading || signinLoading}
      >
        {tCommon('register')}
      </Button>
    </Form>
  );
};
