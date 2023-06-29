import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  FORGOT_PASSWORD_MUTATION,
  GENERATE_OTP_MUTATION,
} from 'GraphQl/Mutations/mutations';

import styles from './ForgotPassword.module.css';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';

const ForgotPassword = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'forgotPassword',
  });

  document.title = t('title');

  const [componentLoader, setComponentLoader] = useState(true);
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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('IsLoggedIn');
    if (isLoggedIn == 'TRUE') {
      window.location.replace('/orglist');
    }
    setComponentLoader(false);
  }, []);

  const getOTP = async (e: ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await otp({
        variables: {
          email: registeredEmail,
        },
      });

      /* istanbul ignore next */
      if (data) {
        localStorage.setItem('otpToken', data.otp.otpToken);
        toast.success(t('OTPsent'));
      }
    } catch (error: any) {
      /* istanbul ignore next */
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

    const otpToken = localStorage.getItem('otpToken');

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

        setForgotPassFormData({
          userOtp: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  if (componentLoader || otpLoading || forgotPasswordLoading) {
    return <div className="loader"></div>;
  }

  return (
    <section className={styles.forgotPassword}>
      <div className="container">
        <div className={`border rounded p-4 mb-4 ${styles.border}`}>
          <div className={`heading text-center ${styles.heading}`}>
            <h1>{t('forgotPassword')}</h1>
          </div>

          <div className="otpForm my-5">
            <form onSubmit={getOTP}>
              <div className="form-group row">
                <label
                  htmlFor="registeredEmail"
                  className="col-sm-2 col-form-label"
                >
                  {t('registeredEmail')}:
                </label>
                <div className="col-sm-7">
                  <Form.Control
                    type="email"
                    className="form-control"
                    id="registeredEmail"
                    placeholder={t('registeredEmail')}
                    value={registeredEmail}
                    name="registeredEmail"
                    required
                    onChange={(e): void => setregisteredEmail(e.target.value)}
                  />
                </div>
                <div className="col-sm-3">
                  <Button
                    type="submit"
                    className={`btn btn-success btn-block ${styles.talawaBackgroundColor}`}
                  >
                    <i className="fa fa-key"></i> {t('getOtp')}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="changePasswordForm">
            <form onSubmit={submitForgotPassword}>
              <div className="form-group row">
                <label htmlFor="userOtp" className="col-sm-2 col-form-label">
                  {t('enterOtp')}:
                </label>
                <div className="col-sm-10">
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
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="newPassword"
                  className="col-sm-2 col-form-label"
                >
                  {t('enterNewPassword')}:
                </label>
                <div className="col-sm-10">
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
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="confirmNewPassword"
                  className="col-sm-2 col-form-label"
                >
                  {t('cofirmNewPassword')}:
                </label>
                <div className="col-sm-10">
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
                </div>
              </div>
              <div className="submitBtn">
                <Button
                  type="submit"
                  className={`btn btn-success btn-block ${styles.talawaBackgroundColor}`}
                >
                  {t('changePassword')}
                </Button>
              </div>
              <div className={`homeBtn mt-3 ${styles.talawaBackgroundColor}`}>
                <Link to="/" className="btn btn-info btn-block">
                  <i className="fas fa-home"></i> {t('backToHome')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
