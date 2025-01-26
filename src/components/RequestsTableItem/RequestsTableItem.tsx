import { useMutation } from '@apollo/client';
import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import styles from './RequestsTableItem.module.css';

/**
 * Represents a membership request in the requests table.
 */
export interface InterfaceRequestsListItem {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

/**
 * Props for the RequestsTableItem component.
 *
 */
type Props = {
  request: InterfaceRequestsListItem;
  index: number;
  resetAndRefetch: () => void;
};

/**
 * Renders a table row item for a membership request.
 *
 * This component displays user details and provides buttons to accept or reject
 * the membership request. It also handles showing success or error messages using
 * toast notifications.
 *
 * @param props - The props object containing request details, index, and state reset function.
 * @returns The JSX element representing the RequestsTableItem.
 */
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
          id: membershipRequestId,
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
      const { data } = await rejectUser({
        variables: {
          id: membershipRequestId,
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
    <tr className={styles.tableItem}>
      <td className={styles.index}>{index + 1}.</td>
      <td
        className={styles.name}
      >{`${request.user.firstName} ${request.user.lastName}`}</td>
      <td className={styles.email}>{request.user.email}</td>
      <td>
        <Button
          variant="success"
          data-testid={`acceptMembershipRequestBtn${request._id}`}
          onClick={async (): Promise<void> => {
            await handleAcceptUser(request._id);
          }}
          className={styles.acceptButton}
        >
          {t('accept')}
        </Button>
      </td>
      <td>
        <Button
          variant="danger"
          data-testid={`rejectMembershipRequestBtn${request._id}`}
          onClick={async (): Promise<void> => {
            await handleRejectUser(request._id);
          }}
          className={styles.rejectButton}
        >
          {t('reject')}
        </Button>
      </td>
    </tr>
  );
};

export default RequestsTableItem;
