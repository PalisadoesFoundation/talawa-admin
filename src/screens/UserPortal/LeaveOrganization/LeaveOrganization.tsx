import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  ORGANIZATIONS_LIST_BASIC,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { Button } from 'shared-components/Button';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useParams, useNavigate } from 'react-router';
import { getItem } from 'utils/useLocalstorage';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import styles from './LeaveOrganization.module.css';

const userEmail = (() => {
  try {
    return getItem('Talawa-admin', 'email') ?? '';
  } catch (e) {
    console.error('Failed to access localStorage:', e);
    return '';
  }
})();
const userId = (() => {
  try {
    return getItem('Talawa-admin', 'userId') ?? '';
  } catch (e) {
    console.error('Failed to access localStorage:', e);
    return '';
  }
})();

export { userEmail, userId };

/**
 * LeaveOrganization Component
 *
 * This component allows a user to leave an organization they are a member of.
 * It includes email verification for confirmation and handles the removal process via GraphQL mutations.
 *
 * Features:
 * - Uses Apollo Client's `useQuery` to fetch organization details.
 * - Uses Apollo Client's `useMutation` to remove the user from the organization.
 * - Displays a modal for user confirmation and email verification.
 * - Handles errors and loading states gracefully.
 *
 * @example
 * ```tsx
 * <LeaveOrganization />
 * ```
 *
 * @returns The rendered LeaveOrganization component.
 */
const LeaveOrganization = (): JSX.Element => {
  const navigate = useNavigate();
  const { orgId: organizationId } = useParams();
  const { t } = useTranslation(['translation', 'common']);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    isOpen: showModal,
    open: openModal,
    close: closeModal,
  } = useModalState();
  const [verificationStep, setVerificationStep] = useState(false);

  /**
   * Query to fetch the organization data.
   */
  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
  } = useQuery(ORGANIZATIONS_LIST_BASIC, { variables: { id: organizationId } });

  /**
   * Mutation to remove the member from the organization.
   */
  const [removeMember] = useMutation(REMOVE_MEMBER_MUTATION, {
    refetchQueries: [
      { query: ORGANIZATION_LIST, variables: { id: organizationId } },
    ],
    onCompleted: () => {
      // Use a toast notification or in-app message
      closeModal();
      NotificationToast.success(t('leaveOrganization.leftOrganizationSuccess'));
      navigate(`/user/organizations`);
    },
    onError: (err) => {
      const isNetworkError = err.networkError !== null;
      setError(
        isNetworkError
          ? t('leaveOrganization.networkError')
          : t('leaveOrganization.leftOrganizationError'),
      );
      setLoading(false);
    },
  });

  /**
   * Handles the process of leaving the organization.
   */
  const handleLeaveOrganization = (): void => {
    if (!organizationId || !userId) {
      setError(t('leaveOrganization.missingRequiredInfo'));
      setLoading(false);
      return;
    }
    setError('');
    setLoading(true);
    removeMember({ variables: { orgid: organizationId, userid: userId } });
  };

  /**
   * Verifies the user's email before proceeding.
   */
  const handleVerifyAndLeave = (): void => {
    if (email.trim().toLowerCase() === (userEmail as string).toLowerCase()) {
      handleLeaveOrganization();
    } else {
      setError(t('leaveOrganization.emailMismatchError'));
    }
  };

  /**
   * Handles the 'Enter' key press on the email input to submit verification.
   * This handler is only attached to the email input which only renders
   * when verificationStep is true, so we can directly call handleVerifyAndLeave.
   */
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleVerifyAndLeave();
    }
  };

  if (orgLoading) {
    return (
      <output className={styles.loadingContainer}>
        <LoadingState isLoading={orgLoading} variant="spinner">
          <div />
        </LoadingState>
      </output>
    );
  }
  if (orgError)
    return (
      <div className={styles.alertDanger} role="alert">
        {t('common:error')}: {orgError.message}
      </div>
    );

  if (!orgData?.organizations?.length) {
    return <p>{t('leaveOrganization.organizationNotFound')}</p>;
  }

  const organization = orgData?.organizations[0];

  return (
    <div className={styles.leaveWrapper}>
      <div className={styles.leaveCard}>
        <div className={styles.leaveIcon}>
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            stroke="var(--red-500)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className={styles.leaveTitle}>
          {t('leaveOrganization.confirmLeaveOrganization')} {organization?.name}
          ?
        </h1>
        <p className={styles.leaveDesc}>
          {t('leaveOrganization.leaveOrganizationConfirmation', {
            orgName: organization?.name,
          })}
        </p>

        <div className={styles.leaveActions}>
          <Button
            variant="plain"
            className={styles.btnLeave}
            type="button"
            onClick={openModal}
          >
            {t('leaveOrganization.leaveOrganization')}
          </Button>
          <Button
            variant="plain"
            className={styles.btnCancel}
            type="button"
            onClick={() => navigate(`/user/organization/${organizationId}`)}
          >
            {t('common:cancel')}
          </Button>
        </div>
      </div>

      <CRUDModalTemplate
        open={showModal}
        data-testid="leave-organization-modal"
        title={t('leaveOrganization.confirmLeaveOrganization')}
        onClose={() => {
          closeModal();
          setVerificationStep(false);
          setEmail('');
          setError('');
        }}
        loading={loading}
        customFooter={
          !verificationStep ? (
            <>
              <Button variant="secondary" onClick={closeModal}>
                {t('common:cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={() => setVerificationStep(true)}
              >
                {t('leaveOrganization.continue')}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setVerificationStep(false);
                  setEmail('');
                  setError('');
                }}
                disabled={loading}
              >
                {t('common:back')}
              </Button>
              <Button
                variant="danger"
                disabled={loading}
                onClick={handleVerifyAndLeave}
                aria-label={t('leaveOrganization.confirmLeaveButton')}
              >
                {t('common:confirm')}
              </Button>
            </>
          )
        }
      >
        {!verificationStep ? (
          <p>
            {t('leaveOrganization.leaveOrganizationConfirmation', {
              orgName: organization?.name,
            })}
          </p>
        ) : (
          <FormTextField
            name="confirm-email"
            label={t('leaveOrganization.enterEmailToConfirm')}
            type="email"
            placeholder={t('leaveOrganization.enterYourEmail')}
            value={email}
            onChange={(val) => setEmail(val)}
            error={error}
            touched={!!error}
            required
            onKeyDown={handleKeyPress}
          />
        )}
      </CRUDModalTemplate>
    </div>
  );
};

export default LeaveOrganization;
