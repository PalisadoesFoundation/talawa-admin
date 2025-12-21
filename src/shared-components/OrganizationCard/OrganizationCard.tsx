/**
 * OrganizationCard Component
 *
 * This component represents a card displaying information about an organization.
 * It includes the organization's name, description, address, avatar, and the number of members.
 * A button is provided to navigate to the organization's dashboard for management.
 *
 * @component
 * @param {InterfaceOrganizationCardPropsPG} props - The props for the component.
 * @param {string} props.data.id - The unique identifier for the organization.
 * @param {string} props.data.avatarURL - The URL of the organization's avatar image.
 * @param {string} props.data.addressLine1 - The primary address of the organization.
 * @param {string} props.data.name - The name of the organization.
 * @param {string} props.data.description - A brief description of the organization.
 * @param {object} props.data.members - The members of the organization.
 * @param {Array} props.data.members.edges - The list of members in the organization.
 * @param {number|undefined} [props.data.membersCount] - The number of members. Optional. The component uses `membersCount ?? members?.edges.length ?? 0` as the fallback.
 *
 * @returns {JSX.Element} A JSX element representing the organization card.
 *
 * @remarks
 * - The component uses `react-bootstrap` for the button and `@mui/material` for the tooltip.
 * - The `useNavigate` hook from `react-router-dom` is used for navigation.
 * - The `useTranslation` hook from `react-i18next` is used for localization.
 *
 * @example
 * ```tsx
 * <OrganizationCard
 *   data={{
 *     id: '1',
 *     avatarURL: 'https://example.com/avatar.png',
 *     addressLine1: '123 Main St',
 *     name: 'Example Org',
 *     description: 'An example organization',
 *     members: { edges: [{ node: { id: '1' } }, { node: { id: '2' } }] },
 *   }}
 * />
 * ```
 */
import React from 'react';
import TruncatedText from 'components/OrgListCard/TruncatedText';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { Tooltip } from '@mui/material';
import Avatar from 'components/Avatar/Avatar';
import { useNavigate } from 'react-router-dom';
import { InterfaceOrganizationCardProps } from 'types/OrganizationCard/interface';
import { ApolloError, useMutation } from '@apollo/client';
import {
  CANCEL_MEMBERSHIP_REQUEST,
  JOIN_PUBLIC_ORGANIZATION,
  SEND_MEMBERSHIP_REQUEST,
} from 'GraphQl/Mutations/OrganizationMutations';
import { ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import { USER_JOINED_ORGANIZATIONS_PG } from 'GraphQl/Queries/OrganizationQueries';
import { toast } from 'react-toastify';
import useLocalStorage from 'utils/useLocalstorage';

export interface InterfaceOrganizationCardPropsPG {
  data: InterfaceOrganizationCardProps;
}

function OrganizationCard({
  data: {
    id,
    name,
    description,
    members,
    membersCount,
    addressLine1,
    avatarURL,
    adminsCount,
    membershipRequestStatus,
    userRegistrationRequired,
    membershipRequests,
    isJoined,
    role,
  },
}: InterfaceOrganizationCardPropsPG): JSX.Element {
  const navigate = useNavigate();

  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();
  const userId = getItem('userId');

  type MembershipState = 'member' | 'pending' | 'not_member';

  const membershipState: MembershipState = isJoined
    ? 'member'
    : membershipRequestStatus === 'pending'
      ? 'pending'
      : 'not_member';

  // Mutations for handling organization memberships
  const [sendMembershipRequest] = useMutation(SEND_MEMBERSHIP_REQUEST, {
    refetchQueries: [{ query: ORGANIZATION_LIST }],
  });
  const joinedRefetch =
    userId != null
      ? [
          {
            query: USER_JOINED_ORGANIZATIONS_PG,
            variables: { id: userId, first: 5 },
          },
        ]
      : [];

  const [joinPublicOrganization] = useMutation(JOIN_PUBLIC_ORGANIZATION, {
    refetchQueries: [{ query: ORGANIZATION_LIST }, ...joinedRefetch],
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
        toast.success(t('users.MembershipRequestSent') as string);
      } else {
        await joinPublicOrganization({
          variables: { input: { organizationId: id } },
        });
        toast.success(t('users.orgJoined') as string);
      }
    } catch (error: unknown) {
      if (error instanceof ApolloError) {
        const apolloError = error;
        const errorCode = apolloError.graphQLErrors?.[0]?.extensions?.code;
        if (errorCode === 'ALREADY_MEMBER') {
          toast.error(t('users.AlreadyJoined') as string);
        } else {
          toast.error(t('users.errorOccurred') as string);
        }
      } else {
        toast.error(t('users.errorOccurred') as string);
      }
    }
  }

  /**
   * Handles withdrawing a membership request. Finds the request for the current user and cancels it.
   */
  async function withdrawMembershipRequest(): Promise<void> {
    const currentUserId = userId;
    if (!currentUserId) {
      toast.error(t('users.UserIdNotFound') as string);
      return;
    }

    const membershipRequest = membershipRequests?.find(
      (request) => request.user.id === currentUserId,
    );

    try {
      if (!membershipRequest) {
        toast.error(t('users.MembershipRequestNotFound') as string);
        return;
      }

      await cancelMembershipRequest({
        variables: { membershipRequestId: membershipRequest.id },
      });

      toast.success(t('users.MembershipRequestWithdrawn') as string);
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to withdraw membership request:', error);
      }
      toast.error(t('users.errorOccurred') as string);
    }
  }

  return (
    <>
      {/* Container for the organization card */}
      <div className={styles.orgCard}>
        <div className={styles.innerContainer} data-cy="orgCardContainer">
          {/* Container for the organization image */}
          <div className={styles.orgImgContainer}>
            {avatarURL ? (
              <img
                src={avatarURL}
                alt={name}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <Avatar
                name={name}
                alt={name}
                dataTestId="emptyContainerForImage"
              />
            )}
          </div>
          <div className={styles.content}>
            <div>
              {/* Tooltip for the organization name */}
              <Tooltip title={name} placement="top-end">
                <h4 className={[styles.orgName, 'fw-semibold'].join(' ')}>
                  {name}
                </h4>
              </Tooltip>
              <output
                className={[
                  styles.statusChip,
                  membershipState === 'member'
                    ? styles.member
                    : membershipState === 'pending'
                      ? styles.pending
                      : styles.notMember,
                ].join(' ')}
                data-testid="membershipStatus"
                data-status={
                  membershipState === 'member'
                    ? 'member'
                    : membershipState === 'pending'
                      ? 'pending'
                      : 'notMember'
                }
                role="status"
                aria-label={
                  membershipState === 'member'
                    ? t('users.membershipStatus.member')
                    : membershipState === 'pending'
                      ? t('users.membershipStatus.pending')
                      : t('users.membershipStatus.notMember')
                }
              >
                {membershipState === 'member'
                  ? t('users.member')
                  : membershipState === 'pending'
                    ? t('users.pending')
                    : t('users.notMember')}
              </output>
              {/* Description of the organization */}
              <div className={[styles.orgdesc, 'fw-semibold'].join(' ')}>
                <TruncatedText text={description} />
              </div>

              {/* Display the organization address if available */}
              {addressLine1 && (
                <div className={styles.address}>
                  <TruncatedText text={`${addressLine1}`} />
                </div>
              )}
              {/* Display the number of admins and members */}
              <h6>
                {role === 'admin' ? (
                  <div>
                    <div>
                      {tCommon('admins')}: <span>{adminsCount ?? 0}</span>
                    </div>
                    <div>
                      {tCommon('members')}:{' '}
                      <span>{membersCount ?? members?.edges?.length ?? 0}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {tCommon('members')}:{' '}
                    <span>{membersCount ?? members?.edges?.length ?? 0}</span>
                  </div>
                )}
              </h6>
            </div>
            {/* Button to manage the organization */}

            {role === 'admin' ? (
              <Button
                onClick={() => navigate(`/orgdash/${id}`)}
                data-testid="manageBtn"
                data-cy="manageBtn"
                className={styles.manageBtn}
              >
                {t('orgListCard.manage')}
              </Button>
            ) : (
              <div className={styles.buttonContainer}>
                {membershipState === 'member' ? (
                  <Button
                    data-testid="manageBtn"
                    data-cy="manageBtn"
                    className={styles.manageBtn}
                    onClick={() => navigate(`/user/organization/${id}`)}
                    style={{ width: '8rem' }}
                  >
                    {t('users.visit')}
                  </Button>
                ) : membershipState === 'pending' ? (
                  <Button
                    variant="danger"
                    onClick={withdrawMembershipRequest}
                    data-testid="withdrawBtn"
                    className={styles.withdrawBtn}
                  >
                    {t('users.withdraw')}
                  </Button>
                ) : (
                  <Button
                    onClick={joinOrganization}
                    data-testid="joinBtn"
                    className={styles.outlineBtn}
                    style={{ width: '8rem' }}
                  >
                    {t('users.joinNow')}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrganizationCard;
