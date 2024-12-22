import { Button, Modal } from 'react-bootstrap';
import styles from '../../../style/app.module.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import type { InterfaceEventVolunteerInfo } from 'utils/interfaces';
import { toast } from 'react-toastify';
import { DELETE_VOLUNTEER } from 'GraphQl/Mutations/EventVolunteerMutation';

export interface InterfaceDeleteVolunteerModal {
  isOpen: boolean;
  hide: () => void;
  volunteer: InterfaceEventVolunteerInfo;
  refetchVolunteers: () => void;
}

/**
 * A modal dialog for confirming the deletion of a volunteer.
 *
 * @param  isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param  volunteer - The volunteer object to be deleted.
 * @param refetchVolunteers - Function to refetch the volunteers after deletion.
 *
 * @returns  The rendered modal component.
 *
 *
 * The `VolunteerDeleteModal` component displays a confirmation dialog when a user attempts to delete a volunteer.
 * It allows the user to either confirm or cancel the deletion.
 * On confirmation, the `deleteVolunteer` mutation is called to remove the pledge from the database,
 * and the `refetchVolunteers` function is invoked to update the list of volunteers.
 * A success or error toast notification is shown based on the result of the deletion operation.
 *
 * The modal includes:
 * - A header with a title and a close button.
 * - A body with a message asking for confirmation.
 * - A footer with "Yes" and "No" buttons to confirm or cancel the deletion.
 *
 * The `deleteVolunteer` mutation is used to perform the deletion operation.
 */

const VolunteerDeleteModal: React.FC<InterfaceDeleteVolunteerModal> = ({
  isOpen,
  hide,
  volunteer,
  refetchVolunteers,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });
  const { t: tCommon } = useTranslation('common');

  const [deleteVolunteer] = useMutation(DELETE_VOLUNTEER);

  const deleteHandler = async (): Promise<void> => {
    try {
      await deleteVolunteer({
        variables: {
          id: volunteer._id,
        },
      });
      refetchVolunteers();
      hide();
      toast.success(t('volunteerRemoved'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };
  return (
    <>
      <Modal className={styles.volunteerModal} onHide={hide} show={isOpen}>
        <Modal.Header>
          <p className={styles.titlemodal}> {t('removeVolunteer')}</p>
          <Button
            variant="danger"
            onClick={hide}
            className={styles.modalCloseBtn}
            data-testid="modalCloseBtn"
          >
            {' '}
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p> {t('removeVolunteerMsg')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={deleteHandler}
            data-testid="deleteyesbtn"
          >
            {tCommon('yes')}
          </Button>
          <Button variant="secondary" onClick={hide} data-testid="deletenobtn">
            {tCommon('no')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default VolunteerDeleteModal;
