import React, { useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { errorHandler } from 'utils/errorHandler';
import { toast } from 'react-toastify';
import {
  DELETE_ORGANIZATION_MUTATION,
  REMOVE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import styles from './DeleteOrg.module.css';
import useLocalStorage from 'utils/useLocalstorage';

function deleteOrg(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'deleteOrg',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { getItem } = useLocalStorage();
  const currentUrl = window.location.href.split('=')[1];
  const canDelete = getItem('UserType') === 'SUPERADMIN';
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

  const deleteOrg = async (): Promise<void> => {
    if (data && data.isSampleOrganization) {
      removeSampleOrganization()
        .then(() => {
          toast.success(t('successfullyDeletedSampleOrganization'));
          setTimeout(() => {
            window.location.replace('/orglist');
          }, 1000);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      try {
        await del({
          variables: {
            id: currentUrl,
          },
        });
        window.location.replace('/orglist');
      } catch (error: any) {
        errorHandler(t, error);
      }
    }
  };

  return (
    <>
      {canDelete && (
        <Card className="rounded-4 shadow-sm mb-4 border border-light-subtle">
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
          <Modal.Header className="bg-primary" closeButton>
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
