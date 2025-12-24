/**
 * OrganizationCard Component
 *
 * Displays information about an organization inside the User Portal.
 * Allows users to join an organization, withdraw a pending request,
 * or visit the organization based on their membership status.
 *
 * @component
 * @param props - Props for the OrganizationCard component.
 * @param props.id - Unique identifier of the organization.
 * @param props.name - Name of the organization.
 * @param props.description - Short description of the organization.
 * @param props.addressLine1 - Primary address line of the organization.
 * @param props.adminsCount - Total number of administrators.
 * @param props.membersCount - Total number of members.
 * @param props.membershipRequestStatus - Current membership request status.
 * @param props.membershipRequests - List of membership requests.
 * @param props.isJoined - Whether the current user is already a member.
 *
 * @returns JSX.Element representing an organization card.
 *
 * @remarks
 * - Uses GraphQL mutations to send and cancel membership requests.
 * - Displays success or error feedback using `react-toastify`.
 * - Layout is provided by the reusable `UserPortalCard`.
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
import { Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import UserPortalCard from 'components/UserPortal/UserPortalCard/UserPortalCard';

import {
  SEND_MEMBERSHIP_REQUEST,
  CANCEL_MEMBERSHIP_REQUEST,
} from 'GraphQl/Mutations/OrganizationMutations';

import styles from './OrganizationCard.module.css';
import type { InterfaceOrganizationCardProps } from 'types/OrganizationCard/interface';

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
  const { t } = useTranslation();

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
      toast.success(t('organization.join_success', 'Request sent'));
    } catch {
      toast.error(
        t('organization.join_error', 'Failed to send membership request'),
      );
    }
  };

  const handleWithdraw = async (): Promise<void> => {
    if (!pendingRequest) return;

    try {
      await cancelRequest({
        variables: { membershipRequestId: pendingRequest.id },
      });

      toast.success(t('organization.withdraw_success', 'Request withdrawn'));
    } catch {
      toast.error(
        t('organization.withdraw_error', 'Failed to withdraw request'),
      );
    }
  };

  const actionsSlot = (() => {
    if (isJoined) {
      return (
        <Button size="sm" data-testid="manageBtn">
          {t('organization.visit', 'Visit')}
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
          {t('organization.withdraw', 'Withdraw')}
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
        {t('organization.join', 'Join')}
      </Button>
    );
  })();

  return (
    <UserPortalCard
      variant="compact"
      ariaLabel={t('organization.card_aria', 'Organization card')}
      dataTestId={t('organization.card_test_id', {
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
            {t('organization.admins', 'Admins')}: {adminsCount}
          </span>
          <span>
            {t('organization.members', 'Members')}: {membersCount}
          </span>
        </div>
      </div>
    </UserPortalCard>
  );
};

export default OrganizationCard;
