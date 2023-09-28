import { useMutation } from '@apollo/client';
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import React, { useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { errorHandler } from 'utils/errorHandler';
import styles from './DeleteOrg.module.css';

function deleteOrg(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'deleteOrg',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const currentUrl = window.location.href.split('=')[1];
  const canDelete = localStorage.getItem('UserType') === 'SUPERADMIN';
  const toggleDeleteModal = (): void => setShowDeleteModal(!showDeleteModal);
  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);

  const deleteOrg = async (): Promise<void> => {
    try {
      const { data } = await del({
        variables: {
          id: currentUrl,
        },
      });
      /* istanbul ignore next */
      if (data) {
        window.location.replace('/orglist');
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  return (
    <>
      {canDelete && (
        <Card border="0" className="rounded-4 mb-4">
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>{t('deleteOrganization')}</div>
          </div>
          <Card.Body className={styles.cardBody}>
            <div className={styles.textBox}>{t('longDelOrgMsg')}</div>
            <Button
              variant="danger"
              className={styles.deleteButton}
              onClick={toggleDeleteModal}
              data-testid="openDeleteModalBtn"
            >
              {t('deleteOrganization')}
            </Button>
          </Card.Body>
        </Card>
      )}
      {/* Delete Organization Modal */}
      {canDelete && (
        <Modal
          show={showDeleteModal}
          onHide={toggleDeleteModal}
          data-testid="orgDeleteModal"
        >
          <Modal.Header className="bg-danger" closeButton>
            <h5 className="text-white fw-bold">{t('deleteOrganization')}</h5>
          </Modal.Header>
          <Modal.Body>{t('deleteMsg')}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={toggleDeleteModal}
              data-testid="closeDelOrgModalBtn"
            >
              {t('no')}
            </Button>
            <Button
              variant="success"
              onClick={deleteOrg}
              data-testid="deleteOrganizationBtn"
            >
              {t('yes')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default deleteOrg;
