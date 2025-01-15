import React, { useEffect, useState } from 'react';
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
import Avatar from 'components/Avatar/Avatar';
import { useNavigate } from 'react-router-dom';
import type { ApolloError } from '@apollo/client';
import useLocalStorage from 'utils/useLocalstorage';
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
  isJoined: boolean;
}
/**
 * Component to display an organization's card with its image and owner details.
 * Displays an organization card with options to join or manage membership.
 *
 * Shows the organization's name, image, description, address, number of admins and members,
 * and provides buttons for joining, withdrawing membership requests, or visiting the organization page.
 *
 * @param props - The properties for the organization card.
 * @param id - The unique identifier of the organization.
 * @param name - The name of the organization.
 * @param image - The URL of the organization's image.
 * @param description - A description of the organization.
 * @param admins - The list of admins with their IDs.
 * @param members - The list of members with their IDs.
 * @param address - The address of the organization including city, country code, line1, postal code, and state.
 * @param membershipRequestStatus - The status of the membership request (accepted, pending, or empty).
 * @param userRegistrationRequired - Indicates if user registration is required to join the organization.
 * @param membershipRequests - The list of membership requests with user IDs.
 *
 * @param props - Properties for the organization card.
 * @returns JSX element representing the organization card.
 * @returns The organization card component.
 */

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
  isJoined,
}: InterfaceOrganizationCardProps): JSX.Element {
  const [userId, setUserId] = useState<string | null>(null);

  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation();

  const navigate = useNavigate();

  // Custom hook for localStorage
  const { getItem } = useLocalStorage();

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

  useEffect(() => {
    try {
      // Use the custom hook to retrieve the userId
      const id = getItem('userId'); // Adjust this line based on your actual localStorage key
      setUserId(id);
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      setUserId(null); // Handle gracefully if localStorage is not available
      toast.error('Failed to access user data');
    }
  }, [getItem]);

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

      toast.success(t('MembershipRequestWithdrawn') as string); // Ensure this gets called
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to withdraw membership request:', error);
      }
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
      {isJoined && (
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
