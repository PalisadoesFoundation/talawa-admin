/**
 * OrganizationCard Component
 *
 * This component represents a card displaying information about an organization.
 * It provides functionality for users to join, withdraw membership requests, or visit
 * the organization's page based on their membership status.
 *
 * @param props - The properties for the OrganizationCard component.
 * @param props.id - The unique identifier of the organization.
 * @param props.name - The name of the organization.
 * @param props.image - The URL of the organization's image.
 * @param props.description - A brief description of the organization.
 * @param props.adminsCount - The number of admins in the organization.
 * @param props.membersCount - The number of members in the organization.
 * @param props.address - The address of the organization, including city and country code.
 * @param props.membershipRequestStatus - The current membership request status for the user.
 * @param props.userRegistrationRequired - Indicates if user registration is required to join.
 * @param props.membershipRequests - List of membership requests for the organization.
 * @param props.isJoined - Indicates if the user is already a member of the organization.
 *
 * @returns A JSX.Element representing the organization card.
 *
 * @remarks
 * - Uses GraphQL mutations and queries to handle membership actions.
 * - Displays success or error messages using `react-toastify`.
 * - Handles user ID retrieval from localStorage and manages state accordingly.
 *
 * @example
 * ```tsx
 * <OrganizationCard
 *   id="org123"
 *   name="Sample Organization"
 *   image="https://example.com/image.jpg"
 *   description="A sample organization"
 *   adminsCount={5}
 *   membersCount={100}
 *   address={{ city: "New York", countryCode: "US", line1: "123 Main St" }}
 *   membershipRequestStatus="pending"
 *   userRegistrationRequired={true}
 *   membershipRequests={[]}
 *   isJoined={false}
 * />
 * ```
 */
import { useEffect, useState } from 'react';
import styles from 'style/app-fixed.module.css';
import Button from 'react-bootstrap/Button';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  CANCEL_MEMBERSHIP_REQUEST,
  JOIN_PUBLIC_ORGANIZATION,
  SEND_MEMBERSHIP_REQUEST,
} from 'GraphQl/Mutations/OrganizationMutations';
import { useMutation } from '@apollo/client';
import { ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import Avatar from 'components/Avatar/Avatar';
import { useNavigate } from 'react-router';
import type { ApolloError } from '@apollo/client';
import type { InterfaceOrganizationCardProps } from 'types/Organization/interface';
import { getItem } from 'utils/useLocalstorage';
import { USER_JOINED_ORGANIZATIONS_PG } from 'GraphQl/Queries/OrganizationQueries';

function OrganizationCard({
  id,
  name,
  image,
  description,
  adminsCount,
  membersCount,
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
    refetchQueries: [
      { query: ORGANIZATION_LIST },
      {
        query: USER_JOINED_ORGANIZATIONS_PG,
        variables: { id: userId, first: 5 },
      },
    ],
    onCompleted: () => {
      window.location.reload(); // Force refresh after successful join
    },
  });
  const [cancelMembershipRequest] = useMutation(CANCEL_MEMBERSHIP_REQUEST, {
    refetchQueries: [{ query: ORGANIZATION_LIST }],
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

    const membershipRequest = membershipRequests.find(
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
            <img
              src={image}
              alt={`${name} image`}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            ></img>
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
              {tCommon('admins')}: <span>{adminsCount}</span>
            </div>
            <div>
              {tCommon('members')}: <span>{membersCount}</span>
            </div>
          </h6>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        {isJoined ? (
          <Button
            data-testid="manageBtn"
            className={styles.addButton}
            onClick={() => navigate(`/user/organization/${id}`)}
            style={{ width: '8rem' }}
            data-cy="manageBtn"
          >
            {t('visit')}
          </Button>
        ) : membershipRequestStatus === 'pending' ? (
          <Button
            variant="danger"
            onClick={withdrawMembershipRequest}
            data-testid="withdrawBtn"
            className={styles.withdrawBtn}
          >
            {t('withdraw')}
          </Button>
        ) : (
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
    </div>
  );
}

export default OrganizationCard;
