import React from 'react';
<<<<<<< HEAD
=======
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

<<<<<<< HEAD
import {
  REMOVE_ADMIN_MUTATION,
  UPDATE_USERTYPE_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceOrgPeopleListCardProps {
  id: string | undefined;
  toggleRemoveModal: () => void;
}

function orgAdminListCard(props: InterfaceOrgPeopleListCardProps): JSX.Element {
  if (!props.id) {
    return <Navigate to={'/orglist'} />;
  }
  const { orgId: currentUrl } = useParams();
  const [remove] = useMutation(REMOVE_ADMIN_MUTATION);
  const [updateUserType] = useMutation(UPDATE_USERTYPE_MUTATION);
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgAdminListCard',
  });

<<<<<<< HEAD
  const removeAdmin = async (): Promise<void> => {
    try {
      const { data } = await updateUserType({
        variables: {
          id: props.id,
          userType: 'USER',
=======
  const toggleRemoveAdminModal = (): void =>
    setShowRemoveAdminModal(!showRemoveAdminModal);

  const removeAdmin = async (): Promise<void> => {
    try {
      const { data } = await remove({
        variables: {
          userid: props.id,
          orgid: currentUrl,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        },
      });

      /* istanbul ignore next */
      if (data) {
<<<<<<< HEAD
        try {
          const { data } = await remove({
            variables: {
              userid: props.id,
              orgid: currentUrl,
            },
          });
          if (data) {
            toast.success(t('adminRemoved'));
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        } catch (error: unknown) {
          /* istanbul ignore next */
          errorHandler(t, error);
        }
      }
    } catch (error: unknown) {
=======
        toast.success(t('adminRemoved'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };
  return (
<<<<<<< HEAD
    <>
      <Modal show={true} onHide={props.toggleRemoveModal}>
        <Modal.Header>
          <h5 id={`removeAdminModalLabel${props.id}`}>{t('removeAdmin')}</h5>
          <Button variant="danger" onClick={props.toggleRemoveModal}>
=======
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
            <i className="fas fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>{t('removeAdminMsg')}</Modal.Body>
        <Modal.Footer>
<<<<<<< HEAD
          <Button variant="danger" onClick={props.toggleRemoveModal}>
=======
          <Button variant="danger" onClick={toggleRemoveAdminModal}>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
    </>
=======
    </div>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );
}
export default orgAdminListCard;
