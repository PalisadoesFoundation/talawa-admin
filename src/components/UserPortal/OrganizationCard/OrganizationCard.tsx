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

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  description: string;
  addressLine1: string;
  role: string;
  membersCount: number;
  adminsCount: number;
  isJoined?: boolean;
  membershipRequestStatus?: string;
  membershipRequests?: { id: string; user: { id: string } }[];
  userRegistrationRequired?: boolean;
}

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

  const [sendRequest] = useMutation(SEND_MEMBERSHIP_REQUEST);
  const [cancelRequest] = useMutation(CANCEL_MEMBERSHIP_REQUEST);

  const pendingRequest = membershipRequests[0];

  const handleJoin = async (): Promise<void> => {
    await sendRequest({ variables: { organizationId: id } });
    toast.success(t('organization.join_success', 'Request sent'));
  };

  const handleWithdraw = async (): Promise<void> => {
    if (!pendingRequest) return;

    await cancelRequest({
      variables: { membershipRequestId: pendingRequest.id },
    });

    toast.success(t('organization.withdraw_success', 'Request withdrawn'));
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
        >
          {t('organization.withdraw', 'Withdraw')}
        </Button>
      );
    }

    return (
      <Button size="sm" data-testid="joinBtn" onClick={handleJoin}>
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
