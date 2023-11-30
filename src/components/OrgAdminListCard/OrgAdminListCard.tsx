import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import styles from './OrgAdminListCard.module.css';
import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import defaultImg from 'assets/images/blank.png';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceOrgPeopleListCardProps {
  key: string;
  id: string;
  memberName: string;
  joinDate: string;
  memberImage: string;
  memberEmail: string;
}
const currentUrl = window.location.href.split('=')[1];

function orgAdminListCard(props: InterfaceOrgPeopleListCardProps): JSX.Element {
  const [remove] = useMutation(REMOVE_ADMIN_MUTATION);
  const [showRemoveAdminModal, setShowRemoveAdminModal] = React.useState(false);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgAdminListCard',
  });

  const toggleRemoveAdminModal = (): void =>
    setShowRemoveAdminModal(!showRemoveAdminModal);

  const removeAdmin = async (): Promise<void> => {
    try {
      const { data } = await remove({
        variables: {
          userid: props.id,
          orgid: currentUrl,
        },
      });

      /* istanbul ignore next */
      if (data) {
        toast.success(t('adminRemoved'));
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
    <div>
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
                onClick={toggleRemoveAdminModal}
                data-testid="removeAdminModalBtn"
              >
                {t('remove')}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      <hr></hr>
      <Modal show={showRemoveAdminModal} onHide={toggleRemoveAdminModal}>
        <Modal.Header>
          <h5 id={`removeAdminModalLabel${props.id}`}>{t('removeAdmin')}</h5>
          <Button variant="danger" onClick={toggleRemoveAdminModal}>
            <i className="fas fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>{t('removeAdminMsg')}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={toggleRemoveAdminModal}>
            {t('no')}
          </Button>
          <Button
            variant="success"
            onClick={removeAdmin}
            data-testid="removeAdminBtn"
          >
            {t('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default orgAdminListCard;
