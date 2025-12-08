import React, { useState, useRef } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { toast } from 'react-toastify';
import PasswordField from 'shared-components/PasswordField/PasswordField';
import PasswordValidator from 'shared-components/PasswordValidator/PasswordValidator';
import OrganizationSelector from 'shared-components/OrganizationSelector/OrganizationSelector';
import {
  InterfaceRegistrationFormProps,
  IRegistrationData,
} from 'types/RegistrationForm/interface';
import { REACT_APP_USE_RECAPTCHA, RECAPTCHA_SITE_KEY } from 'Constant/constant';
import styles from 'style/app-fixed.module.css';
import {
  getPasswordValidationRules,
  validatePassword,
} from '../../utils/passwordValidator';

/**
 * RegistrationForm
 * Reusable registration form for both admin and user portals.
 * @param {InterfaceRegistrationFormProps} props
 * @param {'admin' | 'user'} props.userType
 * @param {boolean} props.isLoading
 * @param {Function} props.onSubmit
 * @param {boolean} [props.showLoginLink=true]
 * @param {Array} props.organizations
 * @returns {JSX.Element}
 */
const RegistrationForm: React.FC<InterfaceRegistrationFormProps> = ({
  userType,
  isLoading,
  onSubmit,
  showLoginLink = true,
  organizations,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'userRegister' });
  const { t: tCommon } = useTranslation('common');

  const [formState, setFormState] = useState<IRegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationId: '',
  });

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const signupRecaptchaRef = useRef<ReCAPTCHA>(null);

  const [showAlert, setShowAlert] = useState({
    lowercaseChar: true,
    uppercaseChar: true,
    numericValue: true,
    specialChar: true,
  });

  const handlePasswordCheck = (pass: string): void => {
    const rules = getPasswordValidationRules(pass);
    setShowAlert({
      lowercaseChar: !rules.lowercaseChar,
      uppercaseChar: !rules.uppercaseChar,
      numericValue: !rules.numericValue,
      specialChar: !rules.specialChar,
    });
  };

  const handleCaptcha = (token: string | null): void => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    // Validation
    const isValidName = (value: string): boolean => {
      return /^[a-zA-Z]+(?:[-\s][a-zA-Z]+)*$/.test(value.trim());
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isValidName(formState.firstName)) {
      toast.warn(t('firstName_invalid') as string);
      return;
    }

    if (!isValidName(formState.lastName)) {
      toast.warn(t('lastName_invalid') as string);
      return;
    }

    if (!emailRegex.test(formState.email)) {
      toast.warn(t('email_invalid') as string);
      return;
    }

    if (!validatePassword(formState.password)) {
      toast.warn(t('password_invalid') as string);
      return;
    }

    if (formState.confirmPassword !== formState.password) {
      toast.warn(t('passwordMismatches') as string);
      return;
    }

    const success = await onSubmit(formState, recaptchaToken);

    if (success) {
      setFormState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        organizationId: '',
      });

      signupRecaptchaRef.current?.reset();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="fs-2 fw-bold text-dark mb-3" data-testid="register-text">
        {tCommon('register')}
      </h1>

      <Row>
        <Col md={6}>
          <div>
            <Form.Label>{tCommon('firstName')}</Form.Label>
            <Form.Control
              disabled={isLoading}
              type="text"
              id="signFirstName"
              className="mb-3"
              placeholder={tCommon('Enter firstname')}
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
        </Col>

        <Col md={6}>
          <div>
            <Form.Label>{tCommon('lastName')}</Form.Label>
            <Form.Control
              disabled={isLoading}
              type="text"
              id="signSecondName"
              className="mb-3"
              placeholder={tCommon('Enter lastname')}
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
        </Col>
      </Row>

      <div className="position-relative">
        <Form.Label>{tCommon('Email Address')}</Form.Label>
        <div className="position-relative">
          <Form.Control
            disabled={isLoading}
            type="email"
            data-testid="signInEmail"
            className="mb-3"
            placeholder={tCommon('Enter your email')}
            autoComplete="username"
            required
            value={formState.email}
            onChange={(e): void => {
              setFormState({
                ...formState,
                email: e.target.value.toLowerCase(),
              });
            }}
          />
          <Button tabIndex={-1} className={styles.email_button}>
            <EmailOutlinedIcon />
          </Button>
        </div>
      </div>

      <div className="position-relative mb-3">
        <PasswordField
          label={tCommon('password')}
          value={formState.password}
          onChange={(value): void => {
            setFormState({
              ...formState,
              password: value,
            });
            handlePasswordCheck(value);
          }}
          disabled={isLoading}
          placeholder={tCommon('Enter your password')}
          testId="passwordField"
          autoComplete="new-password"
          onFocus={(): void => setIsInputFocused(true)}
          onBlur={(): void => setIsInputFocused(false)}
        />
        <PasswordValidator
          password={formState.password}
          isInputFocused={isInputFocused}
          validation={showAlert}
        />
      </div>

      <div className="position-relative">
        <PasswordField
          label={tCommon('confirmPassword')}
          value={formState.confirmPassword}
          onChange={(value): void => {
            setFormState({
              ...formState,
              confirmPassword: value,
            });
          }}
          disabled={isLoading}
          placeholder={tCommon('Confirm your password')}
          testId="cpassword"
          autoComplete="new-password"
        />
        {formState.confirmPassword.length > 0 &&
          formState.password !== formState.confirmPassword && (
            <div className="form-text text-danger" data-testid="passwordCheck">
              {t('passwordMismatches')}
            </div>
          )}
      </div>

      <OrganizationSelector
        organizations={organizations}
        value={formState.organizationId || ''}
        onChange={(orgId): void => {
          setFormState({
            ...formState,
            organizationId: orgId,
          });
        }}
        disabled={isLoading}
        required={false}
      />

      {REACT_APP_USE_RECAPTCHA === 'yes' && RECAPTCHA_SITE_KEY && (
        <div className="googleRecaptcha">
          <ReCAPTCHA
            className="mt-2"
            ref={signupRecaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptcha}
          />
        </div>
      )}

      <Button
        type="submit"
        className={`mt-4 fw-bold w-100 mb-3 ${styles.login_btn}`}
        value="Register"
        data-testid="registrationBtn"
        disabled={isLoading}
      >
        {tCommon('register')}
      </Button>

      {showLoginLink && (
        <div className="text-center" data-testid="goToLoginPortion">
          {t('alreadyhaveAnAccount')}{' '}
          <Link
            to={userType === 'admin' ? '/admin' : '/'}
            className={styles.loginText}
          >
            <u>{tCommon('login')}</u>
          </Link>
        </div>
      )}
    </Form>
  );
};

export default RegistrationForm;
