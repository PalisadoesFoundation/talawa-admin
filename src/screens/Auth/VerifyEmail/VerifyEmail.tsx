/**
 * VerifyEmail Component
 *
 * This component handles email verification using a token from the URL.
 * It provides three states: loading, success, and error, with the ability
 * to resend verification emails if needed.
 *
 * Features:
 * - Automatically verifies email on component mount using URL token parameter
 * - Displays appropriate UI for loading, success, and error states
 * - Allows users to resend verification email
 * - Provides navigation back to login
 *
 * @returns The VerifyEmail component
 */
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  VERIFY_EMAIL_MUTATION,
  RESEND_VERIFICATION_EMAIL_MUTATION,
} from 'GraphQl/Mutations/mutations';
import TalawaLogo from 'assets/svgs/talawa.svg?react';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from './VerifyEmail.module.css';

type VerificationState = 'loading' | 'success' | 'error';

const VerifyEmail = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'verifyEmail' });
  const { t: tCommon } = useTranslation('common');

  document.title = t('title');

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [verificationState, setVerificationState] =
    useState<VerificationState>('loading');
  const [resendEmail, setResendEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);

  const [verifyEmail, { loading: verifyLoading }] = useMutation(
    VERIFY_EMAIL_MUTATION,
  );
  const [resendVerification, { loading: resendLoading }] = useMutation(
    RESEND_VERIFICATION_EMAIL_MUTATION,
  );

  // Verify email on component mount
  useEffect(() => {
    const verifyEmailToken = async (): Promise<void> => {
      if (!token) {
        setVerificationState('error');
        return;
      }

      try {
        const { data } = await verifyEmail({
          variables: { token },
        });

        if (data?.verifyEmail?.success) {
          setVerificationState('success');
          NotificationToast.success(t('success'));
        } else {
          setVerificationState('error');
        }
      } catch (error: unknown) {
        setVerificationState('error');
        errorHandler(t, error);
      }
    };

    verifyEmailToken();
  }, [token, verifyEmail, t]);

  /**
   * Handles resending verification email
   */
  const handleResendEmail = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!resendEmail.trim()) {
      NotificationToast.warning(tCommon('required'));
      return;
    }

    try {
      const { data } = await resendVerification();

      if (data?.sendVerificationEmail?.success) {
        NotificationToast.success(t('resendSuccess'));
        setShowResendForm(false);
        setResendEmail('');
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <LoadingState isLoading={verifyLoading || resendLoading} variant="spinner">
      <div className={styles.pageWrapper}>
        <div className="row container-fluid d-flex justify-content-center items-center">
          <div className="col-12 col-lg-4 px-0">
            <div className={styles.cardTemplate}>
              <TalawaLogo className={styles.logo} />

              {verificationState === 'loading' && (
                <div className={styles.stateContainer}>
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    data-testid="loading-spinner"
                  >
                    <span className="visually-hidden">{t('verifying')}</span>
                  </div>
                  <h3 className="text-center fw-bold mt-4">{t('verifying')}</h3>
                </div>
              )}

              {verificationState === 'success' && (
                <div
                  className={styles.stateContainer}
                  data-testid="success-state"
                >
                  <CheckCircleOutline
                    className={styles.successIcon}
                    data-testid="success-icon"
                  />
                  <h3 className="text-center fw-bold mt-3">{t('success')}</h3>
                  <p className="text-center text-muted mt-2">
                    {t('successMessage')}
                  </p>
                  <Link to="/" className="w-100">
                    <Button
                      className={`mt-4 w-100 ${styles.actionBtn}`}
                      data-testid="goToLoginBtn"
                    >
                      {t('goToLogin')}
                    </Button>
                  </Link>
                </div>
              )}

              {verificationState === 'error' && (
                <div
                  className={styles.stateContainer}
                  data-testid="error-state"
                >
                  <ErrorOutline
                    className={styles.errorIcon}
                    data-testid="error-icon"
                  />
                  <h3 className="text-center fw-bold mt-3">{t('error')}</h3>
                  <p className="text-center text-muted mt-2">
                    {t('invalidToken')}
                  </p>

                  {!showResendForm ? (
                    <Button
                      variant="outline-primary"
                      className="mt-4 w-100"
                      onClick={() => setShowResendForm(true)}
                      data-testid="showResendFormBtn"
                    >
                      {t('resendButton')}
                    </Button>
                  ) : (
                    <Form onSubmit={handleResendEmail} className="mt-4 w-100">
                      <Form.Label htmlFor="resendEmail">
                        {t('enterEmail')}
                      </Form.Label>
                      <Form.Control
                        type="email"
                        id="resendEmail"
                        placeholder={t('emailPlaceholder')}
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        required
                        data-testid="resendEmailInput"
                      />
                      <Button
                        type="submit"
                        className={`mt-3 w-100 ${styles.actionBtn}`}
                        data-testid="resendEmailBtn"
                      >
                        {t('resendButton')}
                      </Button>
                    </Form>
                  )}

                  <div className="d-flex justify-content-center mt-4">
                    <Link
                      to="/"
                      className="d-flex align-items-center text-secondary"
                      data-testid="backToLoginLink"
                    >
                      <ArrowRightAlt
                        fontSize="medium"
                        sx={{ transform: 'rotate(180deg)' }}
                      />
                      {tCommon('login')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LoadingState>
  );
};

export default VerifyEmail;
