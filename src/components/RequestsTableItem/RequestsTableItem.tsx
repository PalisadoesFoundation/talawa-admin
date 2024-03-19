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

export interface InterfaceRequestsListItem {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

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

  const handleAcceptUser = async (
    membershipRequestId: string,
  ): Promise<void> => {
    try {
      const { data } = await acceptUser({
        variables: {
          id: membershipRequestId,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.success(t('acceptedSuccessfully'));
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  const handleRejectUser = async (
    membershipRequestId: string,
  ): Promise<void> => {
    try {
      const { data } = await rejectUser({
        variables: {
          id: membershipRequestId,
        },
      });
      /* istanbul ignore next */
      if (data) {
        toast.success(t('rejectedSuccessfully'));
        resetAndRefetch();
      }
    } catch (error: any) {
      /* istanbul ignore next */
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
