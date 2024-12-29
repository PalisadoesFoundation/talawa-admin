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
}

/**
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
 * @returns The organization card component.
 */
const userId: string | null = getItem('userId');

function organizationCard(props: InterfaceOrganizationCardProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'users',
  });
  const { t: tCommon } = useTranslation('common');

  const navigate = useNavigate();

  // Mutations for handling organization memberships
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

  /**
   * Handles joining the organization. Sends a membership request if registration is required,
   * otherwise joins the public organization directly. Displays success or error messages.
   */
  async function joinOrganization(): Promise<void> {
    try {
      if (props.userRegistrationRequired) {
        await sendMembershipRequest({
          variables: {
            organizationId: props.id,
          },
        });
        toast.success(t('MembershipRequestSent') as string);
      } else {
        await joinPublicOrganization({
          variables: {
            organizationId: props.id,
          },
        });
        toast.success(t('orgJoined') as string);
      }
      refetch();
    } catch (error: unknown) {
      /* istanbul ignore next */
      if (error instanceof Error) {
        if (error.message === 'User is already a member') {
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
            {props.image ? (
              <img src={props.image} alt={`${props.name} image`} />
            ) : (
              <Avatar
                name={props.name}
                alt={`${props.name} image`}
                dataTestId="emptyContainerForImage"
              />
            )}
          </div>
          <div className={styles.content}>
            <Tooltip title={props.name} placement="top-end">
              <h4 className={`${styles.orgName} fw-semibold`}>{props.name}</h4>
            </Tooltip>
            <h6 className={`${styles.orgdesc} fw-semibold`}>
              <span>{props.description}</span>
            </h6>
            {props.address && props.address.city && (
              <div className={styles.address}>
                <h6 className="text-secondary">
                  <span className="address-line">{props.address.line1}, </span>
                  <span className="address-line">{props.address.city}, </span>
                  <span className="address-line">
                    {props.address.countryCode}
                  </span>
                </h6>
              </div>
            )}
            <h6 className={styles.orgadmin}>
              {tCommon('admins')}: <span>{props.admins?.length}</span> &nbsp;
              &nbsp; &nbsp; {tCommon('members')}:{' '}
              <span>{props.members?.length}</span>
            </h6>
          </div>
        </div>
        {props.membershipRequestStatus === 'accepted' && (
          <Button
            variant="success"
            data-testid="manageBtn"
            className={styles.joinedBtn}
            onClick={() => {
              navigate(`/user/organization/${props.id}`);
            }}
          >
            {t('visit')}
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
