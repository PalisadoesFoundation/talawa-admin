/**
 * OrganizationCard Component
 *
 * Displays information about an organization inside the User Portal.
 * Allows users to join an organization, withdraw a pending request,
 * or visit the organization based on their membership status.
 *
 * @param props - Component props containing organization details and membership information
 *
 * @returns JSX.Element representing an organization card
 *
 * @remarks
 * **Props:**
 * - `id` - Unique identifier of the organization
 * - `name` - Name of the organization
 * - `description` - Short description of the organization
 * - `addressLine1` - Primary address line of the organization
 * - `adminsCount` - Total number of administrators
 * - `membersCount` - Total number of members
 * - `membershipRequestStatus` - Current membership request status
 * - `membershipRequests` - List of membership requests
 * - `isJoined` - Whether the current user is already a member
 *
 * Uses GraphQL mutations to send and cancel membership requests.
 * Displays success or error feedback using NotificationToast.
 * Layout is provided by the reusable UserPortalCard.
 *
 * @example
 * ```tsx
 * <OrganizationCard
 *   id="org-1"
 *   name="Sample Organization"
 *   description="An example organization"
 *   addressLine1="123 Main Street"
 *   adminsCount={2}
 *   membersCount={10}
 *   membershipRequestStatus="pending"
 *   membershipRequests={[]}
 *   isJoined={false}
 * />
 * ```
 */
import React from 'react';
import Button from 'shared-components/Button';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import UserPortalCard from 'components/UserPortal/UserPortalCard/UserPortalCard';

import {
  SEND_MEMBERSHIP_REQUEST,
  CANCEL_MEMBERSHIP_REQUEST,
} from 'GraphQl/Mutations/OrganizationMutations';

import styles from './OrganizationCard.module.css';
import type { InterfaceOrganizationCardProps } from 'types/OrganizationCard/interface';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

const OrganizationCard: React.FC<InterfaceOrganizationCardProps> = ({
  id,
  name,
  description,
  addressLine1,
  membersCount,
  adminsCount,
  isJoined = false,
  membershipRequestStatus = '',
  membershipRequests = [],
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationCard',
  });

  const { t: tErrors } = useTranslation('errors');

  const [sendRequest, { loading: sendLoading }] = useMutation(
    SEND_MEMBERSHIP_REQUEST,
  );
  const [cancelRequest, { loading: cancelLoading }] = useMutation(
    CANCEL_MEMBERSHIP_REQUEST,
  );

  const pendingRequest = membershipRequests[0];

  const handleJoin = async (): Promise<void> => {
    try {
      await sendRequest({ variables: { organizationId: id } });
      NotificationToast.success(t('join_success'));
    } catch {
      NotificationToast.error(t('join_error'));
    }
  };

  const handleWithdraw = async (): Promise<void> => {
    if (!pendingRequest) return;

    try {
      await cancelRequest({
        variables: { membershipRequestId: pendingRequest.id },
      });

      NotificationToast.success(t('withdraw_success'));
    } catch {
      NotificationToast.error(t('withdraw_error'));
    }
  };

  const actionsSlot = (() => {
    if (isJoined) {
      return (
        <Button size="sm" data-testid="manageBtn">
          {t('visit')}
        </Button>
      );
    }

    if (membershipRequestStatus === 'pending') {
      return (
        <Button
          size="sm"
          variant="danger"
          data-testid="withdrawBtn"
          onClick={handleWithdraw}
          disabled={cancelLoading}
        >
          {t('withdraw', 'Withdraw')}
        </Button>
      );
    }

    return (
      <Button
        size="sm"
        data-testid="joinBtn"
        onClick={handleJoin}
        disabled={sendLoading}
      >
        {t('join')}
      </Button>
    );
  })();

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <UserPortalCard
        variant="compact"
        ariaLabel={t('card_aria', 'Organization card')}
        dataTestId={t('card_test_id', {
          defaultValue: 'organization-card-{{id}}',
          id,
        })}
        imageSlot={<div className={styles.orgAvatar} aria-hidden="true" />}
        actionsSlot={actionsSlot}
      >
        <div className={styles.content}>
          <div className={styles.name}>{name}</div>

          <div className={styles.description}>{description}</div>

          <div className={styles.address}>{addressLine1}</div>

          <div className={styles.actions}>
            <span>
              {t('admins')}: {adminsCount}
            </span>
            <span>
              {t('members')}: {membersCount}
            </span>
          </div>
        </div>
      </UserPortalCard>
    </ErrorBoundaryWrapper>
  );
};

export default OrganizationCard;
