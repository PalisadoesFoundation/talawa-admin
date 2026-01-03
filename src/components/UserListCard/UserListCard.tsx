/**
 * UserListCard Component
 *
 * This component renders a button that allows adding a user as an admin
 * to a specific organization. It utilizes GraphQL mutation to perform
 * the operation and provides feedback to the user via toast notifications.
 *
 * @file UserListCard.tsx
 * @module components/UserListCard
 * @author Palisadoes
 *
 * @requires React
 * @requires react-bootstrap/Button
 * @requires @apollo/client - For GraphQL mutation handling
 * @requires components/NotificationToast/NotificationToast - For displaying toast notifications
 * @requires react-i18next - For internationalization and translations
 * @requires react-router-dom - For accessing route parameters
 * @requires utils/errorHandler - For handling errors
 * @requires GraphQl/Mutations/mutations - Contains the ADD_ADMIN_MUTATION
 * @requires style/app-fixed.module.css - For styling the button
 *
 * @param {InterfaceUserListCardProps} props - The props for the component
 * @param {number} props.key - Unique key for the component
 * @param {string} props.id - The ID of the user to be added as an admin
 *
 * @returns {JSX.Element} A button that triggers the add admin functionality
 *
 * @function addAdmin
 * Handles the logic for adding a user as an admin. It performs a GraphQL
 * mutation and provides feedback to the user. In case of an error, it
 * utilizes the errorHandler utility.
 *
 * @remarks
 * - The `useParams` hook is used to retrieve the current organization ID
 *   from the URL.
 * - The `useTranslation` hook is used for internationalization.
 * - The button reloads the page after a successful operation.
 */
import React, { useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { useMutation } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';

import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from 'style/app-fixed.module.css';
import { useParams } from 'react-router';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceUserListCardProps {
  key: number;
  id: string;
}

function UserListCard({ id }: InterfaceUserListCardProps): JSX.Element {
  const { orgId: currentUrl } = useParams();
  const [adda] = useMutation(ADD_ADMIN_MUTATION);
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
