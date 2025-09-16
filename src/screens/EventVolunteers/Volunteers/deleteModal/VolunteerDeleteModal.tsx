/**
 * VolunteerDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of a volunteer.
 * It provides options to either confirm or cancel the deletion process.
 *
 * @component
 * @param {InterfaceDeleteVolunteerModal} props - The props for the component.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {() => void} props.hide - Function to hide the modal.
 * @param {InterfaceEventVolunteerInfo} props.volunteer - The volunteer information to be deleted.
 * @param {() => void} props.refetchVolunteers - Function to refetch the list of volunteers after deletion.
 *
 * @returns {React.FC} A React functional component rendering the delete confirmation modal.
 *
 * @example
 * ```tsx
 * <VolunteerDeleteModal
 *   isOpen={isModalOpen}
 *   hide={closeModal}
 *   volunteer={selectedVolunteer}
 *   refetchVolunteers={fetchVolunteers}
 * />
 * ```
 *
 * @remarks
 * - Uses `react-bootstrap` for modal and button components.
 * - Integrates `react-i18next` for translations.
 * - Utilizes Apollo Client's `useMutation` hook to perform the delete operation.
 * - Displays success or error messages using `react-toastify`.
 *
 * @dependencies
 * - `DELETE_VOLUNTEER` GraphQL mutation for deleting a volunteer.
 * - `styles` for custom modal styling.
 */
import { Button, Modal } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
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

const VolunteerDeleteModal: React.FC<InterfaceDeleteVolunteerModal> = ({
  isOpen,
  hide,
  volunteer,
  refetchVolunteers,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });
  const { t: tCommon } = useTranslation('common');

  const [deleteVolunteer] = useMutation(DELETE_VOLUNTEER);

  const deleteHandler = async (): Promise<void> => {
    try {
      await deleteVolunteer({ variables: { id: volunteer.id } });
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
