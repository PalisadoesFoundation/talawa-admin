import { useEffect, useState } from 'react';
import styles from 'style/app-fixed.module.css';
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
  ORGANIZATION_LIST,
  USER_JOINED_ORGANIZATIONS_PG,
} from 'GraphQl/Queries/Queries';
import Avatar from 'components/Avatar/Avatar';
import { useNavigate } from 'react-router-dom';
import type { ApolloError } from '@apollo/client';
import type { InterfaceOrganizationCardProps } from 'types/Organization/interface';
import { getItem } from 'utils/useLocalstorage';

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

  useEffect(() => {
    try {
      const storedUserId = getItem('Talawa-admin', 'id');
      setUserId(storedUserId as string | null);
    } catch (error) {
      // Handle localStorage error silently
      console.error('Failed to get userId from localStorage:', error);
    }
  }, []);

  const { t } = useTranslation('translation', { keyPrefix: 'users' });
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();

  // Mutations for handling organization memberships
  const [sendMembershipRequest] = useMutation(SEND_MEMBERSHIP_REQUEST, {
    refetchQueries: [{ query: ORGANIZATION_LIST }],
  });
  const [joinPublicOrganization] = useMutation(JOIN_PUBLIC_ORGANIZATION, {
    refetchQueries: [{ query: ORGANIZATION_LIST }],
  });
  const [cancelMembershipRequest] = useMutation(CANCEL_MEMBERSHIP_REQUEST, {
    refetchQueries: [{ query: ORGANIZATION_LIST }],
  });
  const { refetch } = useQuery(USER_JOINED_ORGANIZATIONS_PG, {
    variables: { id: userId, first: 5 },
    skip: !userId,
  });

  /**
   * Handles joining the organization. Sends a membership request if registration is required,
   * otherwise joins the public organization directly. Displays success or error messages.
   */
  async function joinOrganization(): Promise<void> {
    try {
      if (userRegistrationRequired) {
        await sendMembershipRequest({ variables: { organizationId: id } });
        toast.success(t('MembershipRequestSent') as string);
      } else {
        await joinPublicOrganization({
          variables: { input: { organizationId: id } },
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

  /**
   * Handles withdrawing a membership request. Finds the request for the current user and cancels it.
   */
  async function withdrawMembershipRequest(): Promise<void> {
    if (!userId) {
      toast.error(t('UserIdNotFound') as string);
      return;
    }

    const membershipRequest = (membershipRequests ?? []).find(
      (request) => request.user.id === userId,
    );

    try {
      if (!membershipRequest) {
        toast.error(t('MembershipRequestNotFound') as string);
        return;
      }

      await cancelMembershipRequest({
        variables: { membershipRequestId: membershipRequest.id },
      });

      toast.success(t('MembershipRequestWithdrawn') as string);
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
            <div>
              {tCommon('admins')}: <span>{admins?.length}</span>
            </div>
            <div>
              {tCommon('members')}: <span>{members?.length}</span>
            </div>
          </h6>
        </div>
      </div>

      {isJoined && (
        <Button
          data-testid="manageBtn"
          className={styles.addButton}
          onClick={() => {
            navigate(`/user/organization/${id}`);
          }}
          style={{ width: '8rem' }}
        >
          {t('visit')}
        </Button>
      )}

      {membershipRequestStatus === 'pending' && !isJoined && (
        <Button
          variant="danger"
          onClick={withdrawMembershipRequest}
          data-testid="withdrawBtn"
          className={styles.withdrawBtn}
        >
          {t('withdraw')}
        </Button>
      )}

      {membershipRequestStatus === '' && !isJoined && (
        <Button
          onClick={joinOrganization}
          data-testid="joinBtn"
          className={styles.outlineBtn}
          style={{ width: '8rem' }}
        >
          {t('joinNow')}
        </Button>
      )}
    </div>
  );
}

export default OrganizationCard;
