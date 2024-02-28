import React from 'react';
import styles from './OrganizationCard.module.css';
import { Button } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
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
    refetchQueries: [USER_ORGANIZATION_CONNECTION],
  });
  const [joinPublicOrganization] = useMutation(JOIN_PUBLIC_ORGANIZATION, {
    refetchQueries: [USER_ORGANIZATION_CONNECTION],
  });
  const [cancelMembershipRequest] = useMutation(CANCEL_MEMBERSHIP_REQUEST, {
    refetchQueries: [USER_ORGANIZATION_CONNECTION],
  });
  const { refetch } = useQuery(USER_JOINED_ORGANIZATIONS, {
    variables: { id: userId },
  });

  async function joinOrganization(): Promise<void> {
    if (props.userRegistrationRequired) {
      await sendMembershipRequest({
        variables: {
          organizationId: props.id,
        },
      });
    } else {
      await joinPublicOrganization({
        variables: {
          organizationId: props.id,
        },
      });
    }
    refetch();
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
            variant="outline-success"
            data-testid="manageBtn"
            className={styles.joinedBtn}
          >
            <CheckIcon fontSize="inherit" className="fs-5" />
            {t('joined')}
          </Button>
        )}

        {props.membershipRequestStatus === 'pending' && (
          <Button
            variant="outline-danger"
            onClick={withdrawMembershipRequest}
            data-testid="manageBtn"
            className={styles.withdrawBtn}
          >
            <CloseIcon fontSize="inherit" className="fs-5" />
            {t('withdraw')}
          </Button>
        )}
        {props.membershipRequestStatus === '' && (
          <Button
            onClick={joinOrganization}
            data-testid="manageBtn"
            className={styles.joinBtn}
          >
            {t('join')}
          </Button>
        )}
      </div>
    </>
  );
}

export default organizationCard;
