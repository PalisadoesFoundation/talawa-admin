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
  key: string;
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
      <div className={styles.peoplelistdiv} data-testid="peoplelistitem">
        <Row className={styles.memberlist}>
          {props.memberImage ? (
            <img src={props.memberImage} className={styles.memberimg} />
          ) : (
            <img src={defaultImg} className={styles.memberimg} />
          )}
          <Col className={styles.singledetails}>
            <div className={styles.singledetails_data_left}>
              <Link
                className={styles.membername}
                to={{
                  pathname: `/member/id=${currentUrl}`,
                  state: { id: props.id },
                }}
              >
                {props.memberName ? <>{props.memberName}</> : <>Dogs Care</>}
              </Link>
              <p className={styles.memberfontcreated}>{props.memberEmail}</p>
            </div>
            <div className={styles.singledetails_data_right}>
              <p className={styles.memberfont}>
                {t('joined')}: <span>{props.joinDate}</span>
              </p>
              <Button
                className={styles.memberfontcreatedbtn}
                onClick={addAdmin}
              >
                {t('addAdmin')}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      <hr></hr>
    </>
  );
}
export {};
export default userListCard;
