import React, { useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { errorHandler } from 'utils/errorHandler';
import { toast } from 'react-toastify';
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { REMOVE_SAMPLE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import styles from './DeleteOrg.module.css';
import { useHistory } from 'react-router-dom';

function deleteOrg(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'deleteOrg',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const currentUrl = window.location.href.split('=')[1];
  const canDelete = localStorage.getItem('UserType') === 'SUPERADMIN';
  const toggleDeleteModal = (): void => setShowDeleteModal(!showDeleteModal);

  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);
  const [removeSampleOrganization] = useMutation(
    REMOVE_SAMPLE_ORGANIZATION_MUTATION
  );

  const { data } = useQuery(IS_SAMPLE_ORGANIZATION_QUERY, {
    variables: {
      isSampleOrganizationId: currentUrl,
    },
  });

  const history = useHistory();

  const deleteOrg = async (): Promise<void> => {
    if (data && data.isSampleOrganization) {
      try {
        await removeSampleOrganization();
        toast.success('Successfully deleted sample Organization');
        history.push('/orglist');
      } catch (error: any) {
        errorHandler(t, error);
      }
    } else {
      try {
        await del({
          variables: {
            id: currentUrl,
          },
        });
        toast.success('Successfully deleted Organization');
        history.push('/orglist');
      } catch (error: any) {
        errorHandler(t, error);
      }
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
              {data && data.isSampleOrganization
                ? t('deleteSampleOrganization')
                : t('deleteOrganization')}
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
              variant="secondary"
              onClick={toggleDeleteModal}
              data-testid="closeDelOrgModalBtn"
            >
              {t('cancel')}
            </Button>
            <Button
              variant="danger"
              onClick={deleteOrg}
              data-testid="deleteOrganizationBtn"
            >
              {t('confirmDelete')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default deleteOrg;
