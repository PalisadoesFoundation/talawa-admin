import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import Button from 'shared-components/Button';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { errorHandler } from 'utils/errorHandler';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  DELETE_ORGANIZATION_MUTATION,
  REMOVE_SAMPLE_ORGANIZATION_MUTATION,
} from 'GraphQl/Mutations/mutations';
import DeleteIcon from '@mui/icons-material/Delete';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import styles from './DeleteOrg.module.css';
import { useNavigate, useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';

/**
 * A component for deleting an organization.
 *
 * It displays a card with a delete button. When the delete button is clicked,
 * a modal appears asking for confirmation. Depending on the type of organization
 * (sample or regular), it performs the delete operation and shows appropriate
 * success or error messages.
 *
 * @returns JSX.Element - The rendered component with delete functionality.
 */
function deleteOrg(): JSX.Element {
  // Translation hook for localization
  const { t } = useTranslation('translation', { keyPrefix: 'deleteOrg' });
  const { t: tCommon } = useTranslation('common');

  // Get the current organization ID from the URL
  const { orgId: currentUrl } = useParams();
  // Navigation hook for redirecting
  const navigate = useNavigate();
  // State to control the visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Hook for accessing local storage
  const { getItem } = useLocalStorage();
  const canDelete = getItem('SuperAdmin') || true;

  // Check if the user has super admin privileges
  // const canDelete = getItem('SuperAdmin');
  /**
   * Toggles the visibility of the delete confirmation modal.
   */
  const toggleDeleteModal = (): void => setShowDeleteModal(!showDeleteModal);

  // GraphQL mutations for deleting organizations
  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);
  const [removeSampleOrganization] = useMutation(
    REMOVE_SAMPLE_ORGANIZATION_MUTATION,
  );

  // Query to check if the organization is a sample organization
  const { data } = useQuery(IS_SAMPLE_ORGANIZATION_QUERY, {
    variables: { id: currentUrl },
  });

  /**
   * Deletes the organization. It handles both sample and regular organizations.
   * Displays success or error messages based on the operation result.
   */
  const deleteOrg = async (): Promise<void> => {
    if (data && data.isSampleOrganization) {
      // If it's a sample organization, use a specific mutation
      removeSampleOrganization()
        .then(() => {
          NotificationToast.success(
            t('successfullyDeletedSampleOrganization') as string,
          );
          setTimeout(() => {
            navigate('/admin/orglist');
          }, 1000);
        })
        .catch((error) => {
          NotificationToast.error(error.message);
        });
    } else {
      // For regular organizations, use a different mutation
      try {
        await del({ variables: { input: { id: currentUrl || '' } } });
        navigate('/admin/orglist');
      } catch (error) {
        errorHandler(t, error);
      }
    }
  };

  return (
    <>
      {canDelete && (
        <Card className={styles.DeleteOrgCard}>
          <Card.Header className={styles.deleteCardHeader}>
            <h5 className="mb-0 fw-semibold">{t('deleteOrganization')}</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <div className={styles.textBox}>{t('longDelOrgMsg')}</div>
            <Button
              variant="danger"
              className={styles.deleteButton}
              onClick={toggleDeleteModal}
              data-testid="openDeleteModalBtn"
            >
              <DeleteIcon className={styles.icon} />
              {data?.isSampleOrganization
                ? t('deleteSampleOrganization')
                : t('delete')}
            </Button>
          </Card.Body>
        </Card>
      )}
      {/* Delete Organization Modal */}
      {canDelete && (
        <BaseModal
          show={showDeleteModal}
          onHide={toggleDeleteModal}
          title={t('deleteOrganization')}
          dataTestId="orgDeleteModal"
          headerClassName={styles.modalHeaderDelete}
          footer={
            <>
              <Button
                onClick={toggleDeleteModal}
                data-testid="closeDelOrgModalBtn"
                className={styles.btnDelete}
              >
                {tCommon('cancel')}
              </Button>
              <Button
                className={styles.btnConfirmDelete}
                onClick={deleteOrg}
                data-testid="deleteOrganizationBtn"
              >
                {t('confirmDelete')}
              </Button>
            </>
          }
        >
          {t('deleteMsg')}
        </BaseModal>
      )}
    </>
  );
}

export default deleteOrg;
