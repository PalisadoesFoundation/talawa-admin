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
import React, { useEffect, useRef, useState } from 'react';
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

  const [verificationState, setVerificationState] = useState<VerificationState>(
    () => {
      return token ? 'loading' : 'error';
    },
  );

  const verificationInitiatedRef = useRef(false);
  const isMountedRef = useRef(true);
  const [isResending, setIsResending] = useState(false);

  const [verifyEmail, { loading: verifyLoading }] = useMutation(
    VERIFY_EMAIL_MUTATION,
    {
      // Prevent caching issues
      fetchPolicy: 'no-cache',
    },
  );
  const [resendVerification, { loading: resendLoading }] = useMutation(
    RESEND_VERIFICATION_EMAIL_MUTATION,
    {
      fetchPolicy: 'no-cache',
    },
  );

  // Verify email on component mount
  useEffect(() => {
    // Prevent duplicate verification requests
    if (verificationInitiatedRef.current) {
      return () => {
        isMountedRef.current = false;
      };
    }

    if (!token) {
      return () => {
        isMountedRef.current = false;
      };
    }

    verificationInitiatedRef.current = true;
    isMountedRef.current = true;

    const verifyEmailToken = async (): Promise<void> => {
      try {
        const { data } = await verifyEmail({
          variables: { token },
        });

        if (data?.verifyEmail?.success) {
          setVerificationState('success');
          NotificationToast.success(t('success'));
          removeItem('emailNotVerified');
          removeItem('unverifiedEmail');
        } else {
          setVerificationState('error');
          NotificationToast.error(
            data?.verifyEmail?.message || t('verificationFailed'),
          );
        }
      } catch (error: unknown) {
        setVerificationState('error');
        const err = error as {
          message?: string;
          graphQLErrors?: { extensions?: { code?: string } }[];
        };
        if (
          err.message?.toLowerCase().includes('authenticated') ||
          err.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED'
        ) {
          NotificationToast.error(t('loginRequired'));
        } else if (err.message?.toLowerCase().includes('invalid arguments')) {
          NotificationToast.error(t('invalidToken'));
        } else {
          errorHandler(t, error);
        }
      }
    };

    void verifyEmailToken();
    return () => {
      isMountedRef.current = false;
    };
  }, [token, verifyEmail, t, removeItem]);

  /**
   * Handles resending verification email
   */
  const handleResendEmail = async (): Promise<void> => {
    setIsResending(true);
    try {
      const { data } = await resendVerification();
      if (!isMountedRef.current) {
        return;
      }

      if (data?.sendVerificationEmail?.success) {
        NotificationToast.success(t('resendSuccess'));
      } else {
        NotificationToast.error(
          data?.sendVerificationEmail?.message || t('resendFailed'),
        );
      }
    } catch (error: unknown) {
      if (!isMountedRef.current) {
        return;
      }
      errorHandler(t, error);
    } finally {
      if (isMountedRef.current) {
        setIsResending(false);
      }
    }
  };

  return (
    <LoadingState
      isLoading={verifyLoading || resendLoading || isResending}
      variant="spinner"
    >
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
                    {token ? t('invalidToken') : t('noToken')}
                  </p>

                  <Button
                    variant="outline-primary"
                    className="mt-4 w-100"
                    onClick={handleResendEmail}
                    disabled={verifyLoading || resendLoading || isResending}
                    data-testid="resendVerificationBtn"
                  >
                    {verifyLoading || resendLoading || isResending
                      ? tCommon('loading')
                      : t('resendButton')}
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
