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
import { Link, useSearchParams } from 'react-router-dom';
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

import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './VerifyEmail.module.css';

type VerificationState = 'loading' | 'success' | 'error';

/**
 * VerifyEmail Component
 *
 * This component handles the email verification process.
 * It reads the verification token from the URL, calls the verification mutation,
 * and handles success, error, and loading states.
 *
 * @returns JSX.Element - The rendered VerifyEmail component.
 */
const VerifyEmail = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'verifyEmail' });
  const { t: tCommon } = useTranslation('common');
  const { removeItem } = useLocalStorage();

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [verificationState, setVerificationState] =
    useState<VerificationState>('loading');

  const [verifyEmail, { loading: verifyLoading }] = useMutation(
    VERIFY_EMAIL_MUTATION,
  );
  const [resendVerification, { loading: resendLoading }] = useMutation(
    RESEND_VERIFICATION_EMAIL_MUTATION,
  );

  // Verify email on component mount
  useEffect(() => {
    let isActive = true;
    const verifyEmailToken = async (): Promise<void> => {
      if (!token) {
        if (isActive) {
          setVerificationState('error');
        }
        return;
      }

      try {
        const { data } = await verifyEmail({
          variables: { token },
        });

        if (!isActive) {
          return;
        }

        if (data?.verifyEmail?.success) {
          setVerificationState('success');
          NotificationToast.success(t('success'));
          removeItem('emailNotVerified');
          removeItem('unverifiedEmail');
        } else {
          setVerificationState('error');
        }
      } catch (error: unknown) {
        if (!isActive) {
          return;
        }
        setVerificationState('error');
        const err = error as {
          message?: string;
          graphQLErrors?: { extensions?: { code?: string } }[];
        };
        if (
          err.message?.toLowerCase().includes('authenticated') ||
          err.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED' ||
          err.message?.toLowerCase().includes('invalid arguments')
        ) {
          NotificationToast.error(t('loginRequired'));
        } else {
          errorHandler(t, error);
        }
      }
    };

    void verifyEmailToken();
    return () => {
      isActive = false;
    };
  }, [token, verifyEmail, t, removeItem]);

  /**
   * Handles resending verification email
   */
  const handleResendEmail = async (): Promise<void> => {
    try {
      const { data } = await resendVerification();

      if (data?.sendVerificationEmail?.success) {
        NotificationToast.success(t('resendSuccess'));
      } else {
        NotificationToast.error(
          data?.sendVerificationEmail?.message || t('resendFailed'),
        );
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
                  <output
                    className="spinner-border text-primary"
                    role="status"
                    data-testid="loading-spinner"
                  >
                    <span className="visually-hidden">{t('verifying')}</span>
                  </output>
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

                  <Button
                    variant="outline-primary"
                    className="mt-4 w-100"
                    onClick={handleResendEmail}
                    disabled={resendLoading}
                    data-testid="resendVerificationBtn"
                  >
                    {resendLoading ? tCommon('loading') : t('resendButton')}
                  </Button>

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
