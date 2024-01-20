import { useMutation } from '@apollo/client';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  FORGOT_PASSWORD_MUTATION,
  GENERATE_OTP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ReactComponent as KeyLogo } from 'assets/svgs/key.svg';

import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import Loader from 'components/Loader/Loader';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from './ForgotPassword.module.css';
import useLocalStorage from 'utils/useLocalStorage';

const ForgotPassword = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'forgotPassword',
  });

  const { getItem, setItem, removeItem } = useLocalStorage();
  document.title = t('title');

  const [showEnterEmail, setShowEnterEmail] = useState(true);

  const [registeredEmail, setregisteredEmail] = useState('');

  const [forgotPassFormData, setForgotPassFormData] = useState({
    userOtp: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [otp, { loading: otpLoading }] = useMutation(GENERATE_OTP_MUTATION);
  const [forgotPassword, { loading: forgotPasswordLoading }] = useMutation(
    FORGOT_PASSWORD_MUTATION
  );
  const isLoggedIn = getItem('IsLoggedIn');
  useEffect(() => {
    if (isLoggedIn == 'TRUE') {
      window.location.replace('/orglist');
    }
    return () => {
      removeItem('otpToken');
    };
  }, []);

  const getOTP = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await otp({
        variables: {
          email: registeredEmail,
        },
      });

      if (data) {
        setItem('otpToken', data.otp.otpToken);
        toast.success(t('OTPsent'));
        setShowEnterEmail(false);
      }
    } catch (error: any) {
      if (error.message === 'User not found') {
        toast.warn(t('emailNotRegistered'));
      } else if (error.message === 'Failed to fetch') {
        toast.error(t('talawaApiUnavailable'));
      } else {
        toast.error(t('errorSendingMail'));
      }
    }
  };

  const submitForgotPassword = async (
    e: ChangeEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const { userOtp, newPassword, confirmNewPassword } = forgotPassFormData;

    if (newPassword !== confirmNewPassword) {
      toast.error(t('passwordMismatches'));
      return;
    }

    const otpToken = getItem('otpToken');

    if (!otpToken) {
      return;
    }

    try {
      const { data } = await forgotPassword({
        variables: {
          userOtp,
          newPassword,
          otpToken,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('passwordChanges'));
        setShowEnterEmail(true);
        setForgotPassFormData({
          userOtp: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (error: any) {
      setShowEnterEmail(true);
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  if (otpLoading || forgotPasswordLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className={styles.pageWrapper}>
        <div className="row container-fluid d-flex justify-content-center items-center">
          <div className="col-12 col-lg-4 px-0">
            <div className={styles.cardBody}>
              <div className={styles.keyWrapper}>
                <div className={styles.themeOverlay} />
                <KeyLogo className={styles.keyLogo} fill="var(--bs-primary)" />
              </div>
              <h3 className="text-center fw-bold">{t('forgotPassword')}</h3>
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
                      className="mt-4 w-100"
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
                      placeholder={t('password')}
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
