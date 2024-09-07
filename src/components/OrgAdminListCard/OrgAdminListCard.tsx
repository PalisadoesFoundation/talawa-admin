import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { errorHandler } from 'utils/errorHandler';

interface InterfaceOrgPeopleListCardProps {
  id: string | undefined;
  toggleRemoveModal: () => void;
}
/**
 * Component to confirm and handle the removal of an admin.
 *
 * @param id - ID of the admin to be removed.
 * @param toggleRemoveModal - Function to toggle the visibility of the modal.
 * @returns JSX element for the removal confirmation modal.
 */
function orgAdminListCard(props: InterfaceOrgPeopleListCardProps): JSX.Element {
  if (!props.id) {
    return <Navigate to={'/orglist'} />;
  }
  const { orgId: currentUrl } = useParams();
  const [remove] = useMutation(REMOVE_ADMIN_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgAdminListCard',
  });
  const { t: tCommon } = useTranslation('common');

  /**
   * Function to remove the admin from the organization
   * and display a success message.
   */
  const removeAdmin = async (): Promise<void> => {
    try {
      const { data } = await remove({
        variables: {
          userid: props.id,
          orgid: currentUrl,
        },
      });
      if (data) {
        toast.success(t('adminRemoved') as string);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };
  return (
    <>
      <Modal show={true} onHide={props.toggleRemoveModal}>
        <Modal.Header>
          <h5 id={`removeAdminModalLabel${props.id}`}>{t('removeAdmin')}</h5>
          <Button variant="danger" onClick={props.toggleRemoveModal}>
            <i className="fas fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>{t('removeAdminMsg')}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.toggleRemoveModal}>
            {tCommon('no')}
          </Button>
          <Button
            variant="success"
            onClick={removeAdmin}
            data-testid="removeAdminBtn"
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default orgAdminListCard;
