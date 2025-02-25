import { Button, Modal } from 'react-bootstrap';
import styles from '../../../style/app.module.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';
import { toast } from 'react-toastify';
import { DELETE_VOLUNTEER_GROUP } from 'GraphQl/Mutations/EventVolunteerMutation';

export interface InterfaceDeleteVolunteerGroupModal {
  isOpen: boolean;
  hide: () => void;
  group: InterfaceVolunteerGroupInfo | null;
  refetchGroups: () => void;
}

/**
 * A modal dialog for confirming the deletion of a volunteer group.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param group - The volunteer group to be deleted.
 * @param refetchGroups - Function to refetch the volunteer groups after deletion.
 *
 * @returns  The rendered modal component.
 *
 *
 * The `VolunteerGroupDeleteModal` component displays a confirmation dialog when a user attempts to delete a volunteer group.
 * It allows the user to either confirm or cancel the deletion.
 * On confirmation, the `deleteVolunteerGroup` mutation is called to remove the volunteer group from the database,
 * and the `refetchGroups` function is invoked to update the list of volunteer groups.
 * A success or error toast notification is shown based on the result of the deletion operation.
 *
 * The modal includes:
 * - A header with a title and a close button.
 * - A body with a message asking for confirmation.
 * - A footer with "Yes" and "No" buttons to confirm or cancel the deletion.
 *
 * The `deleteVolunteerGroup` mutation is used to perform the deletion operation.
 */

const VolunteerGroupDeleteModal: React.FC<
  InterfaceDeleteVolunteerGroupModal
> = ({ isOpen, hide, group, refetchGroups }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventVolunteers',
  });
  const { t: tCommon } = useTranslation('common');

  const [deleteVolunteerGroup] = useMutation(DELETE_VOLUNTEER_GROUP);

  const deleteHandler = async (): Promise<void> => {
    try {
      await deleteVolunteerGroup({
        variables: {
          id: group?._id,
        },
      });
      refetchGroups();
      hide();
      toast.success(t('volunteerGroupDeleted'));
    } catch (error: unknown) {
      toast.error((error as Error).message);
    }
  };
  return (
    <>
      <Modal className={styles.volunteerModal} onHide={hide} show={isOpen}>
        <Modal.Header>
          <p className={styles.titlemodal}> {t('deleteGroup')}</p>
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
          <p> {t('deleteVolunteerGroupMsg')}</p>
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
export default VolunteerGroupDeleteModal;
