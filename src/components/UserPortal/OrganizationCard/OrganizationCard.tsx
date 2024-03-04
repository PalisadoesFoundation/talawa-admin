import React from 'react';
import styles from './OrganizationCard.module.css';
import { Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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

const { getItem } = useLocalStorage();

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
}

const userId: string | null = getItem('userId');

function organizationCard(props: InterfaceOrganizationCardProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'users',
  });
  const [sendMembershipRequest] = useMutation(SEND_MEMBERSHIP_REQUEST, {
    refetchQueries: [
      { query: USER_ORGANIZATION_CONNECTION, variables: { id: props.id } },
    ],
  });
  const [joinPublicOrganization] = useMutation(JOIN_PUBLIC_ORGANIZATION, {
    refetchQueries: [
      { query: USER_ORGANIZATION_CONNECTION, variables: { id: props.id } },
    ],
  });
  const [cancelMembershipRequest] = useMutation(CANCEL_MEMBERSHIP_REQUEST, {
    refetchQueries: [
      { query: USER_ORGANIZATION_CONNECTION, variables: { id: props.id } },
    ],
  });
  const { refetch } = useQuery(USER_JOINED_ORGANIZATIONS, {
    variables: { id: userId },
  });

  async function joinOrganization(): Promise<void> {
    try {
      if (props.userRegistrationRequired) {
        await sendMembershipRequest({
          variables: {
            organizationId: props.id,
          },
        });
        toast.success(t('MembershipRequestSent'));
      } else {
        await joinPublicOrganization({
          variables: {
            organizationId: props.id,
          },
        });
        toast.success(t('orgJoined'));
      }
      refetch();
    } catch (error: any) {
      /* istanbul ignore next */
      if (error.message === 'User is already a member') {
        toast.error(t('AlreadyJoined'));
      } else {
        toast.error(t('errorOccured'));
      }
    }
  }

  async function withdrawMembershipRequest(): Promise<void> {
    const membershipRequest = props.membershipRequests.find(
      (request) => request.user._id === userId,
    );

    await cancelMembershipRequest({
      variables: {
        membershipRequestId: membershipRequest?._id,
      },
    });
  }

  return (
    <>
      <div className={styles.orgCard}>
        <div className={styles.innerContainer}>
          <div className={styles.orgImgContainer}>
            <img
              src={
                props.image
                  ? props.image
                  : `https://api.dicebear.com/5.x/initials/svg?seed=${props.name
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .slice(0, 2)
                      .join('')}`
              }
              alt={`${props.name} image`}
              data-testid={props.image ? '' : 'emptyContainerForImage'}
            />
          </div>
          <div className={styles.content}>
            <Tooltip title={props.name} placement="top-end">
              <h4 className={styles.orgName}>{props.name}</h4>
            </Tooltip>
            {props.address && props.address.city && (
              <div>
                <h6 className="text-secondary">
                  <LocationOnIcon fontSize="inherit" className="fs-5" />
                  <span className="address-line">{props.address.city}, </span>
                  <span className="address-line">{props.address.state}</span>
                  <br />
                  <LocationOnIcon fontSize="inherit" className="fs-5" />
                  <span className="address-line">
                    {props.address.postalCode},{' '}
                  </span>
                  <span className="address-line">
                    {props.address.countryCode}
                  </span>
                </h6>
              </div>
            )}
            <h6>
              {t('admins')}: <span>{props.admins?.length}</span>
            </h6>
            <h6>
              {t('members')}: <span>{props.members?.length}</span>
            </h6>
          </div>
        </div>
        {props.membershipRequestStatus === 'accepted' && (
          <Button
            variant="success"
            data-testid="manageBtn"
            className={styles.joinedBtn}
          >
            {t('joined')}
          </Button>
        )}

        {props.membershipRequestStatus === 'pending' && (
          <Button
            variant="danger"
            onClick={withdrawMembershipRequest}
            data-testid="withdrawBtn"
            className={styles.withdrawBtn}
          >
            {t('withdraw')}
          </Button>
        )}
        {props.membershipRequestStatus === '' && (
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
    </>
  );
}

export default organizationCard;
