/**
 * VolunteerGroupDeleteModal Component
 *
 * This component renders a modal for deleting a volunteer group. It provides
 * confirmation options to either proceed with the deletion or cancel the action.
 *
 * @component
 * @param {InterfaceDeleteVolunteerGroupModal} props - The props for the component.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {() => void} props.hide - Function to close the modal.
 * @param {InterfaceVolunteerGroupInfo | null} props.group - The volunteer group to be deleted.
 * @param {() => void} props.refetchGroups - Function to refetch the list of volunteer groups after deletion.
 *
 * @returns {React.FC} A React functional component that renders the delete confirmation modal.
 *
 * @remarks
 * - The modal uses `react-bootstrap` for styling and structure.
 * - The `useMutation` hook from Apollo Client is used to perform the deletion operation.
 * - Translations are handled using `react-i18next`.
 * - Notifications for success or error are displayed using `react-toastify`.
 *
 * @example
 * ```tsx
 * <VolunteerGroupDeleteModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   group={selectedGroup}
 *   refetchGroups={fetchGroups}
 * />
 * ```
 *
 * @see {@link DELETE_VOLUNTEER_GROUP} for the GraphQL mutation used.
 */
import { Button, Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
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

const VolunteerGroupDeleteModal: React.FC<
  InterfaceDeleteVolunteerGroupModal
> = ({ isOpen, hide, group, refetchGroups }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');

  const [deleteVolunteerGroup] = useMutation(DELETE_VOLUNTEER_GROUP);

  const deleteHandler = async (): Promise<void> => {
    try {
      await deleteVolunteerGroup({ variables: { id: group?.id } });
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
