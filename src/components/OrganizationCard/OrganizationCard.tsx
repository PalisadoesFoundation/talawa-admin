import React from 'react';
import styles from './OrganizationCard.module.css';
import { Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  CANCEL_MEMBERSHIP_REQUEST,
  JOIN_PUBLIC_ORGANIZATION,
  SEND_MEMBERSHIP_REQUEST,
} from 'GraphQl/Mutations/OrganizationMutations';
import { useMutation, useQuery } from '@apollo/client';
import {
  USER_JOINED_ORGANIZATIONS,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/OrganizationQueries';
import useLocalStorage from 'utils/useLocalstorage';
import Avatar from 'components/Avatar/Avatar';
import { useNavigate } from 'react-router-dom';
import type { ApolloError } from '@apollo/client';

useLocalStorage();

interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  admins: {
    id: string;
  }[];
  members: {
    id: string;
  }[];
  address: {
    city: string;
    countryCode: string;
    line1: string;
    postalCode: string;
    state: string;
  };
  membershipRequestStatus: string;
  userRegistrationRequired: boolean;
  membershipRequests: {
    _id: string;
    user: {
      _id: string;
    };
  }[];
  isjoined: boolean;
}

function OrganizationCard({
  id,
  name,
  image,
  description,
  admins,
  members,
  address,
  membershipRequestStatus,
  userRegistrationRequired,
  membershipRequests,
  isjoined,
}: InterfaceOrganizationCardProps): JSX.Element {
  const { getItem } = useLocalStorage();
  const userId: string | null = getItem('userId');

  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation();

  const navigate = useNavigate();

  // Mutations for handling organization memberships
  const [sendMembershipRequest] = useMutation(SEND_MEMBERSHIP_REQUEST, {
    refetchQueries: [
      { query: USER_ORGANIZATION_CONNECTION, variables: { id } },
    ],
  });
  const [joinPublicOrganization] = useMutation(JOIN_PUBLIC_ORGANIZATION, {
    refetchQueries: [
      { query: USER_ORGANIZATION_CONNECTION, variables: { id } },
    ],
  });
  const [cancelMembershipRequest] = useMutation(CANCEL_MEMBERSHIP_REQUEST, {
    refetchQueries: [
      { query: USER_ORGANIZATION_CONNECTION, variables: { id } },
    ],
  });
  const { refetch } = useQuery(USER_JOINED_ORGANIZATIONS, {
    variables: { id: userId },
  });

  async function joinOrganization(): Promise<void> {
    try {
      if (userRegistrationRequired) {
        await sendMembershipRequest({
          variables: {
            organizationId: id,
          },
        });
        toast.success(t('MembershipRequestSent') as string);
      } else {
        await joinPublicOrganization({
          variables: {
            organizationId: id,
          },
        });
        toast.success(t('orgJoined') as string);
      }
      refetch();
    } catch (error: unknown) {
      if (error instanceof Error) {
        const apolloError = error as ApolloError;
        const errorCode = apolloError.graphQLErrors?.[0]?.extensions?.code;
        if (errorCode === 'ALREADY_MEMBER') {
          toast.error(t('AlreadyJoined') as string);
        } else {
          toast.error(t('errorOccured') as string);
        }
      }
    }
  }

  async function withdrawMembershipRequest(): Promise<void> {
    const membershipRequest = membershipRequests.find(
      (request) => request.user._id === userId,
    );
    try {
      if (!membershipRequest) {
        toast.error(t('MembershipRequestNotFound') as string);
        return;
      }

      await cancelMembershipRequest({
        variables: {
          membershipRequestId: membershipRequest._id,
        },
      });

      toast.success(t('MembershipRequestWithdrawn') as string);
    } catch (error: unknown) {
      console.error('Failed to withdraw membership request:', error);
      toast.error(t('errorOccured') as string);
    }
  }

  return (
    <div className={styles.orgCard}>
      <div className={styles.innerContainer}>
        <div className={styles.orgImgContainer}>
          {image ? (
            <img src={image} alt={`${name} image`} />
          ) : (
            <Avatar
              name={name}
              alt={`${name} image`}
              dataTestId="emptyContainerForImage"
            />
          )}
        </div>
        <div className={styles.content}>
          <Tooltip title={name} placement="top-end">
            <h4 className={`${styles.orgName} fw-semibold`}>{name}</h4>
          </Tooltip>
          <h6 className={`${styles.orgdesc} fw-semibold`}>
            <span>{description}</span>
          </h6>
          {address && address.city && (
            <div className={styles.address}>
              <h6 className="text-secondary">
                <span className="address-line">{address.line1}, </span>
                <span className="address-line">{address.city}, </span>
                <span className="address-line">{address.countryCode}</span>
              </h6>
            </div>
          )}
          <h6 className={styles.orgadmin}>
            {tCommon('admins')}: <span>{admins?.length}</span> &nbsp; &nbsp;
            &nbsp; {tCommon('members')}: <span>{members?.length}</span>
          </h6>
        </div>
      </div>
      {isjoined && (
        <Button
          variant="success"
          data-testid="manageBtn"
          className={styles.joinedBtn}
          onClick={() => {
            navigate(`/user/organization/${id}`);
          }}
        >
          {t('visit')}
        </Button>
      )}

      {membershipRequestStatus === 'pending' && (
        <Button
          variant="danger"
          onClick={withdrawMembershipRequest}
          data-testid="withdrawBtn"
          className={styles.withdrawBtn}
        >
          {t('withdraw')}
        </Button>
      )}

      {membershipRequestStatus === '' && (
        <Button
          onClick={joinOrganization}
          data-testid="joinBtn"
          className={styles.joinBtn}
          variant="outline-success"
        >
          {t('joinNow')}
        </Button>
      )}
    </div>
  );
}

export default OrganizationCard;
