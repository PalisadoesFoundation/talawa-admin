/**
 * Component representing a single row in the membership requests table.
 *
 * This component displays the details of a membership request, including the user's name,
 * email, and actions to accept or reject the request. It uses GraphQL mutations to handle
 * the acceptance or rejection of requests and provides feedback to the user via toast notifications.
 *
 * @component
 * @param props - The props for the component.
 * @param props.request - The membership request data.
 * @param props.index - The index of the request in the list.
 * @param props.resetAndRefetch - A function to reset the state and refetch the data after an action.
 *
 * @remarks
 * - Uses `useMutation` from Apollo Client for GraphQL mutations.
 * - Displays success messages using `react-toastify`.
 * - Handles errors using a custom `errorHandler` utility.
 *
 * @example
 * ```tsx
 * <RequestsTableItem
 *   request={request}
 *   index={0}
 *   resetAndRefetch={refetchFunction}
 * />
 * ```
 *
 * @returns A JSX element representing a table row with membership request details and actions.
 */
import { useMutation } from '@apollo/client';
import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { errorHandler } from 'utils/errorHandler';
import styles from '../../style/app-fixed.module.css';
import type { InterfaceRequestsListItem } from 'types/Member/interface';
import Avatar from 'components/Avatar/Avatar';

type Props = {
  request: InterfaceRequestsListItem;
  index: number;
  resetAndRefetch: () => void;
};

const RequestsTableItem = (props: Props): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'requests' });
  const { request, index, resetAndRefetch } = props;
  const [acceptUser] = useMutation(ACCEPT_ORGANIZATION_REQUEST_MUTATION);
  const [rejectUser] = useMutation(REJECT_ORGANIZATION_REQUEST_MUTATION);

  /**
   * Handles the acceptance of a membership request.
   *
   * Sends a mutation request to accept the user and shows a success message if successful.
   * It also triggers a state reset and refetch.
   *
   * @param membershipRequestId - The ID of the membership request to accept.
   */
  const handleAcceptUser = async (
    membershipRequestId: string,
  ): Promise<void> => {
    try {
      const { data } = await acceptUser({
        variables: {
          input: {
            membershipRequestId: membershipRequestId,
          },
        },
      });

      if (data) {
        toast.success(t('acceptedSuccessfully') as string);
        resetAndRefetch();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  /**
   * Handles the rejection of a membership request.
   *
   * Sends a mutation request to reject the user and shows a success message if successful.
   * It also triggers a state reset and refetch.
   *
   * @param membershipRequestId - The ID of the membership request to reject.
   */
  const handleRejectUser = async (
    membershipRequestId: string,
  ): Promise<void> => {
    try {
      // Change this part to wrap the ID in an input object
      const { data } = await rejectUser({
        variables: {
          input: {
            membershipRequestId: membershipRequestId, // Pass ID in the input object
          },
        },
      });

      if (data) {
        toast.success(t('rejectedSuccessfully') as string);
        resetAndRefetch();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <tr>
      <th scope="row" className={styles.requestsTableItemIndex}>
        {index + 1}.
      </th>
      <td>
        {request.user.avatarURL && request.user.avatarURL !== 'null' ? (
          <img
            src={request.user.avatarURL}
            className={styles.userAvatar}
            alt={`profile picture`}
            data-testid="display-img"
            crossOrigin="anonymous"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <Avatar
            data-testid="display-img"
            size={45}
            avatarStyle={styles.avatarStyle}
            name={`${request.user.name}`}
            alt={`dummy picture`}
          />
        )}
      </td>
      <td className={styles.requestsTableItemName}>{`${request.user.name}`}</td>
      <td className={styles.requestsTableItemEmail}>
        {request.user.emailAddress}
      </td>
      <td>
        <Button
          className={`btn ${styles.requestsAcceptButton} ${styles.hoverShadowOnly}`}
          data-testid={`acceptMembershipRequestBtn${request.membershipRequestId}`}
          onClick={async (): Promise<void> => {
            await handleAcceptUser(request.membershipRequestId);
          }}
        >
          <GroupAddIcon className="me-2" />
          Accept
        </Button>
      </td>
      <td>
        <Button
          className={`btn ${styles.requestsRejectButton} ${styles.hoverShadowOnly}`}
          data-testid={`rejectMembershipRequestBtn${request.membershipRequestId}`}
          onClick={async (): Promise<void> => {
            await handleRejectUser(request.membershipRequestId);
          }}
        >
          <DeleteIcon className="me-2" />
          Decline
        </Button>
      </td>
    </tr>
  );
};

export default RequestsTableItem;
