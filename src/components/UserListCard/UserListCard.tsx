/**
 * UserListCard Component.
 *
 * Renders a button that adds a user as an admin for the current organization.
 */
import React, { useRef, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';

import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './UserListCard.module.css';
import { useParams } from 'react-router';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceCreateAdminMutation } from 'utils/interfaces';
import Button from 'shared-components/Button';

interface InterfaceUserListCardProps {
  key: number;
  id: string;
}

function UserListCard({ id }: InterfaceUserListCardProps): JSX.Element {
  const { orgId: currentUrl } = useParams();
  const [adda] = useMutation<InterfaceCreateAdminMutation>(ADD_ADMIN_MUTATION);
  const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { t } = useTranslation('translation', { keyPrefix: 'userListCard' });

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, []);

  const addAdmin = async (): Promise<void> => {
    // Clear any existing timeout
    if (reloadTimeoutRef.current) {
      clearTimeout(reloadTimeoutRef.current);
      reloadTimeoutRef.current = null;
    }

    try {
      const result = await adda({
        variables: { userid: id, orgid: currentUrl },
      });

      if (result.data?.createAdmin) {
        NotificationToast.success({
          key: 'addedAsAdmin',
          namespace: 'translation',
        });

        reloadTimeoutRef.current = setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <>
      <Button
        className={styles.memberfontcreatedbtnUserListCard}
        onClick={addAdmin}
      >
        {t('addAdmin')}
      </Button>
    </>
  );
}
export {};
export default UserListCard;
