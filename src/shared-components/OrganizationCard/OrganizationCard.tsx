/**
 * Renders a card displaying an organization's details including name, description, address, avatar,
 * membership information, and action buttons.
 *
 * @param data - The organization card data.
 *
 * @returns A JSX element representing the organization card.
 *
 * @remarks
 * - `props.data` contains:
 *   - `id`, `name`, `description`, `avatarURL`, `addressLine1`
 *   - `members` (edges array) and optional `membersCount`
 *   - `adminsCount`, `membershipRequestStatus`, `userRegistrationRequired`, `membershipRequests`, `isJoined`, `role`
 * - Membership state can be `'member'`, `'pending'`, or `'notMember'`.
 * - Uses the shared Button component, `@mui/material` for tooltips, and `react-router-dom` for navigation.
 * - Uses `useTranslation` from `react-i18next` for localization.
 * - Uses GraphQL mutations to handle membership requests and joining organizations.
 *
 * @example
 * ```tsx
 * <OrganizationCard
 *   data={{
 *     id: '1',
 *     name: 'Example Org',
 *     description: 'An example organization',
 *     members: { edges: [{ node: { id: '1' } }, { node: { id: '2' } }] },
 *     membersCount: 2,
 *     addressLine1: '123 Main St',
 *     avatarURL: 'https://example.com/avatar.png',
 *     adminsCount: 1,
 *     membershipRequestStatus: 'pending',
 *     userRegistrationRequired: true,
 *     membershipRequests: [],
 *     isJoined: false,
 *     role: 'admin',
 *   }}
 * />
 * ```
 */
import React from 'react';
import TruncatedText from 'shared-components/TruncatedText/TruncatedText';
import { useTranslation } from 'react-i18next';
import styles from './OrganizationCard.module.css';
import { Tooltip } from '@mui/material';
import Avatar from 'shared-components/Avatar/Avatar';
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
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import useLocalStorage from 'utils/useLocalstorage';
import Button from 'shared-components/Button';

export interface InterfaceOrganizationCardPropsPG {
  data: InterfaceOrganizationCardProps;
}

function OrganizationCard({
  data,
}: InterfaceOrganizationCardPropsPG): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation('translation');
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();
  const userId = getItem<string>('userId');

  const {
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
  } = data;
  type MembershipState = 'member' | 'pending' | 'notMember';
  const membershipState: MembershipState = isJoined
    ? 'member'
    : membershipRequestStatus === 'pending'
      ? 'pending'
      : 'notMember';
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
        NotificationToast.success(t('users.MembershipRequestSent'));
      } else {
        await joinPublicOrganization({
          variables: { input: { organizationId: id } },
        });
        NotificationToast.success(t('users.orgJoined'));
      }
    } catch (error: unknown) {
      if (error instanceof ApolloError) {
        const apolloError = error;
        const errorCode = apolloError.graphQLErrors?.[0]?.extensions?.code;
        if (errorCode === 'ALREADY_MEMBER') {
          NotificationToast.error(t('users.AlreadyJoined'));
        } else {
          NotificationToast.error(t('users.errorOccurred'));
        }
      } else {
        NotificationToast.error(t('users.errorOccurred'));
      }
    }
  }
  /**
   * Handles withdrawing a membership request. Finds the request for the current user and cancels it.
   */
  async function withdrawMembershipRequest(): Promise<void> {
    const currentUserId = userId;
    if (!currentUserId) {
      NotificationToast.error(t('users.UserIdNotFound'));
      return;
    }
    const membershipRequest = membershipRequests?.find(
      (request) => request.user.id === currentUserId,
    );
    try {
      if (!membershipRequest) {
        NotificationToast.error(t('users.MembershipRequestNotFound'));
        return;
      }
      await cancelMembershipRequest({
        variables: { membershipRequestId: membershipRequest.id },
      });
      NotificationToast.success(t('users.MembershipRequestWithdrawn'));
    } catch {
      NotificationToast.error(t('users.errorOccurred'));
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
              <span
                role="status"
                className={[
                  styles.statusChip,
                  membershipState === 'member'
                    ? styles.member
                    : membershipState === 'pending'
                      ? styles.pendingMembership
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
              </span>
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
                onClick={() => navigate(`/admin/orgdash/${id}`)}
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
                    className={`${styles.manageBtn} ${styles.buttonWidth8rem}`}
                    onClick={() => navigate(`/user/organization/${id}`)}
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
