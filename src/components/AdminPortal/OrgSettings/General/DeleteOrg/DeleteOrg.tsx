import { Card } from 'react-bootstrap';
import Button from 'shared-components/Button';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { errorHandler } from 'utils/errorHandler';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './DeleteOrg.module.css';
import { useNavigate, useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import { useModalState } from 'shared-components/CRUDModalTemplate';

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
function DeleteOrg(): JSX.Element {
  // Translation hook for localization
  const { t } = useTranslation('translation', { keyPrefix: 'deleteOrg' });
  const { t: tCommon } = useTranslation('common');

  // Get the current organization ID from the URL
  const { orgId: currentUrl } = useParams();
  // Navigation hook for redirecting
  const navigate = useNavigate();

  const { isOpen, toggle, close } = useModalState();

  // Hook for accessing local storage
  const { getItem } = useLocalStorage();
  const canDelete = getItem('SuperAdmin') || true;

  // GraphQL mutations for deleting organizations
  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);

  /**
   * Deletes the organization. It handles both sample and regular organizations.
   * Displays success or error messages based on the operation result.
   */
  const deleteOrg = async (): Promise<void> => {
    try {
      await del({ variables: { input: { id: currentUrl || '' } } });
      NotificationToast.success(t('successfullyDeletedOrganization') as string);
      navigate('/admin/orglist');
    } catch (error) {
      errorHandler(t, error);
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
              onClick={toggle}
              data-testid="openDeleteModalBtn"
            >
              <DeleteIcon className={styles.icon} />
              {t('delete')}
            </Button>
          </Card.Body>
        </Card>
      )}
      {/* Delete Organization Modal */}
      {canDelete && (
        <BaseModal
          show={isOpen}
          onHide={toggle}
          title={t('deleteOrganization')}
          dataTestId="orgDeleteModal"
          headerClassName={styles.modalHeaderDelete}
          footer={
            <>
              <Button
                onClick={close}
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

export default DeleteOrg;
