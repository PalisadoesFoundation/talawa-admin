/**
 * ForgotPassword Component
 *
 * This component provides a user interface for the "Forgot Password" functionality.
 * It allows users to request an OTP (One-Time Password) to reset their password
 * and subsequently update their password using the OTP.
 *
 * Features:
 * - Displays a form to enter a registered email address to request an OTP.
 * - Displays a form to enter the OTP and reset the password.
 * - Validates password confirmation to ensure the new password matches.
 * - Provides feedback to the user via toast notifications for success or error states.
 * - Redirects logged-in users to the organization list page.
 *
 * Hooks:
 * - `useTranslation`: For internationalization and localization of text.
 * - `useLocalStorage`: Custom hook for managing local storage operations.
 * - `useMutation`: For executing GraphQL mutations to generate OTP and reset password.
 * - `useEffect`: To handle redirection for logged-in users and cleanup on unmount.
 *
 * State:
 * - `showEnterEmail`: Toggles between the email input form and the OTP/password reset form.
 * - `registeredEmail`: Stores the email address entered by the user.
 * - `forgotPassFormData`: Stores the OTP, new password, and confirmation password entered by the user.
 *
 * GraphQL Mutations:
 * - `GENERATE_OTP_MUTATION`: Sends an OTP to the user's registered email.
 * - `FORGOT_PASSWORD_MUTATION`: Resets the user's password using the OTP and new password.
 *
 * UI Components:
 * - `Form` and `Button` from React Bootstrap for form handling and submission.
 * - `Loader`: Displays a loading spinner during mutation operations.
 * - `KeyLogo`: SVG logo for visual representation.
 * - `Link`: For navigation back to the login page.
 *
 * Error Handling:
 * - Displays appropriate toast notifications for errors such as user not found,
 *   API unavailability, or email not registered.
 *
 * @returns {JSX.Element} The ForgotPassword component.
 */
import { useMutation } from '@apollo/client';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

import {
  FORGOT_PASSWORD_MUTATION,
  GENERATE_OTP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import KeyLogo from 'assets/svgs/key.svg?react';

import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import Loader from 'components/Loader/Loader';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';

const ForgotPassword = (): JSX.Element => {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', { keyPrefix: 'forgotPassword' });
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  // Set the page title
  document.title = t('title');

  // Custom hook for accessing local storage
  const { getItem, removeItem, setItem } = useLocalStorage();

  // State hooks for form data and UI
  const [showEnterEmail, setShowEnterEmail] = useState(true);

  const [registeredEmail, setregisteredEmail] = useState('');

  const [forgotPassFormData, setForgotPassFormData] = useState({
    userOtp: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // GraphQL mutations
  const [otp, { loading: otpLoading }] = useMutation(GENERATE_OTP_MUTATION);
  const [forgotPassword, { loading: forgotPasswordLoading }] = useMutation(
    FORGOT_PASSWORD_MUTATION,
  );

  // Check if the user is already logged in
  const isLoggedIn = getItem('IsLoggedIn');
  useEffect(() => {
    if (isLoggedIn == 'TRUE') {
      window.location.replace('/orglist');
    }
    return () => {
      removeItem('otpToken');
    };
  }, []);

  /**
   * Handles the form submission for generating OTP.
   *
   * @param e - The form submit event
   */
  const getOTP = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await otp({ variables: { email: registeredEmail } });

      setItem('otpToken', data.otp.otpToken);
      toast.success(t('OTPsent'));
      setShowEnterEmail(false);
    } catch (error: unknown) {
      if ((error as Error).message === 'User not found') {
        toast.warn(tErrors('emailNotRegistered'));
      } else if ((error as Error).message === 'Failed to fetch') {
        toast.error(tErrors('talawaApiUnavailable'));
      } else {
        toast.error(tErrors('errorSendingMail'));
      }
    }
  };

  /**
   * manages the form submission for resetting the password.
   *
   * @param e - The form submit event
   */
  const submitForgotPassword = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const { userOtp, newPassword, confirmNewPassword } = forgotPassFormData;

    if (newPassword !== confirmNewPassword) {
      toast.error(t('passwordMismatches') as string);
      return;
    }

    const otpToken = getItem('otpToken');

    if (!otpToken) {
      return;
    }

    try {
      const { data } = await forgotPassword({
        variables: { userOtp, newPassword, otpToken },
      });

      if (data) {
        toast.success(t('passwordChanges') as string);
        setShowEnterEmail(true);
        setForgotPassFormData({
          userOtp: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (error: unknown) {
      setShowEnterEmail(true);
      errorHandler(t, error);
    }
  };

  // Show loader while performing OTP or password reset operations
  if (otpLoading || forgotPasswordLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className="row container-fluid d-flex justify-content-center items-center">
          <div className="col-12 col-lg-4 px-0">
            <div className={styles.cardTemplate}>
              <div className={styles.keyWrapper}>
                <div className={styles.themeOverlay} />
                <KeyLogo
                  className={styles.keyLogo}
                  fill="var(--forgot-password-fill)"
                />
              </div>
              <h3 className="text-center fw-bold">
                {tCommon('forgotPassword')}
              </h3>
              {showEnterEmail ? (
                <div className="mt-4">
                  <Form onSubmit={getOTP}>
                    <Form.Label htmlFor="registeredEmail">
                      {t('registeredEmail')}:
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        className="form-control"
                        id="registeredEmail"
                        placeholder={t('registeredEmail')}
                        value={registeredEmail}
                        name="registeredEmail"
                        required
                        onChange={(e): void =>
                          setregisteredEmail(e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      className={`mt-4 w-100 ${styles.login_btn}`}
                      data-testid="getOtpBtn"
                    >
                      {t('getOtp')}
                    </Button>
                  </Form>
                </div>
              ) : (
                <div className="mt-4">
                  <Form onSubmit={submitForgotPassword}>
                    <Form.Label htmlFor="userOtp">{t('enterOtp')}:</Form.Label>
                    <Form.Control
                      type="number"
                      className="form-control"
                      id="userOtp"
                      placeholder={t('userOtp')}
                      name="userOtp"
                      value={forgotPassFormData.userOtp}
                      required
                      onChange={(e): void =>
                        setForgotPassFormData({
                          ...forgotPassFormData,
                          userOtp: e.target.value,
                        })
                      }
                    />
                    <Form.Label htmlFor="newPassword">
                      {t('enterNewPassword')}:
                    </Form.Label>
                    <Form.Control
                      type="password"
                      className="form-control"
                      id="newPassword"
                      placeholder={tCommon('password')}
                      data-testid="newPassword"
                      name="newPassword"
                      value={forgotPassFormData.newPassword}
                      required
                      onChange={(e): void =>
                        setForgotPassFormData({
                          ...forgotPassFormData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <Form.Label htmlFor="confirmNewPassword">
                      {t('cofirmNewPassword')}:
                    </Form.Label>
                    <Form.Control
                      type="password"
                      className="form-control"
                      id="confirmNewPassword"
                      placeholder={t('cofirmNewPassword')}
                      data-testid="confirmNewPassword"
                      name="confirmNewPassword"
                      value={forgotPassFormData.confirmNewPassword}
                      required
                      onChange={(e): void =>
                        setForgotPassFormData({
                          ...forgotPassFormData,
                          confirmNewPassword: e.target.value,
                        })
                      }
                    />
                    <Button type="submit" className="mt-2 w-100">
                      {t('changePassword')}
                    </Button>
                  </Form>
                </div>
              )}
              <div className="d-flex justify-content-between items-center mt-4">
                <Link
                  to={'/'}
                  className="mx-auto d-flex items-center text-secondary"
                >
                  <ArrowRightAlt
                    fontSize="medium"
                    style={{ transform: 'rotate(180deg)' }}
                  />
                  {t('backToLogin')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
