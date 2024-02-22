import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { ADD_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './UserListCard.module.css';
import { Link } from 'react-router-dom';
import defaultImg from 'assets/images/blank.png';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceUserListCardProps {
  key: number;
  id: string;
  memberName: string;
  joinDate: string;
  memberImage: string;
  memberEmail: string;
}

function userListCard(props: InterfaceUserListCardProps): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];
  const [adda] = useMutation(ADD_ADMIN_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'userListCard',
  });

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
        toast.success(t('addedAsAdmin'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  return (
    <>
      <Button className={styles.memberfontcreatedbtn} onClick={addAdmin}>
        {t('addAdmin')}
      </Button>
    </>
  );
}
export {};
export default userListCard;
