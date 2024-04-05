import React, { useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { errorHandler } from 'utils/errorHandler';
import { toast } from 'react-toastify';
<<<<<<< HEAD
import {
  DELETE_ORGANIZATION_MUTATION,
  REMOVE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import styles from './DeleteOrg.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
=======
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { REMOVE_SAMPLE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import styles from './DeleteOrg.module.css';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

function deleteOrg(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'deleteOrg',
  });
<<<<<<< HEAD
  const { orgId: currentUrl } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { getItem } = useLocalStorage();
  const canDelete = getItem('SuperAdmin');
=======
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const currentUrl = window.location.href.split('=')[1];
  const canDelete = localStorage.getItem('UserType') === 'SUPERADMIN';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  const toggleDeleteModal = (): void => setShowDeleteModal(!showDeleteModal);

  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);
  const [removeSampleOrganization] = useMutation(
<<<<<<< HEAD
    REMOVE_SAMPLE_ORGANIZATION_MUTATION,
=======
    REMOVE_SAMPLE_ORGANIZATION_MUTATION
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
          toast.success(t('successfullyDeletedSampleOrganization'));
          setTimeout(() => {
            navigate('/orglist');
          }, 1000);
=======
          toast.success('Successfully deleted sample Organization');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        })
        .catch((error) => {
          toast.error(error.message);
        });
<<<<<<< HEAD
=======
      window.location.replace('/orglist');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    } else {
      try {
        await del({
          variables: {
            id: currentUrl,
          },
        });
<<<<<<< HEAD
        navigate('/orglist');
      } catch (error) {
=======
        window.location.replace('/orglist');
      } catch (error: any) {
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        errorHandler(t, error);
      }
    }
  };

  return (
    <>
      {canDelete && (
<<<<<<< HEAD
        <Card className="rounded-4 shadow-sm mb-4 border border-light-subtle">
=======
        <Card border="0" className="rounded-4 mb-4">
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
          <Modal.Header className="bg-primary" closeButton>
=======
          <Modal.Header className="bg-danger" closeButton>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
