import React from 'react';
import Button from 'react-bootstrap/Button';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from '../../style/app.module.css';
import { useParams } from 'react-router-dom';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceUserListCardProps {
  key: number;
  id: string;
}

/**
 * The UserListCard component allows for adding a user as an admin in a specific organization.
 * It uses a button to trigger a mutation for updating the user's role.
 *
 * @param props - The properties for the UserListCard component.
 * @param key - The unique key for the component (although not used here).
 * @param id - The ID of the user to be promoted to admin.
 *
 * @returns The JSX element representing the user list card.
 */
function userListCard(props: InterfaceUserListCardProps): JSX.Element {
  const { orgId: currentUrl } = useParams();
  const [adda] = useMutation(ADD_ADMIN_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'userListCard',
  });

  /**
   * Handles adding a user as an admin.
   * It performs a mutation and handles success or failure accordingly.
   */
  const addAdmin = async (): Promise<void> => {
    try {
      const { data } = await adda({
        variables: {
          userid: props.id,
          orgid: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('addedAsAdmin') as string);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
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
export default userListCard;
