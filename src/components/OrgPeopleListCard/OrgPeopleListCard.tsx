import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { useParams, Navigate } from 'react-router-dom';
import { errorHandler } from 'utils/errorHandler';
import styles from '../../style/app.module.css';
import { Close } from '@mui/icons-material';

/**
 * Props for the OrgPeopleListCard component
 */
interface InterfaceOrgPeopleListCardProps {
  id: string | undefined;
  toggleRemoveModal: () => void;
}

/**
 * Component for displaying a modal to remove a member from an organization
 *
 * This component shows a modal that confirms the removal of a member from the organization.
 * It performs the removal action and displays success or error messages.
 *
 * @param props - The properties passed to the component
 * @returns JSX.Element representing the organization people list card modal
 */
function orgPeopleListCard(
  props: InterfaceOrgPeopleListCardProps,
): JSX.Element {
  // Get the current organization ID from the URL parameters
  const { orgId: currentUrl } = useParams();

  // If the member ID is not provided, navigate to the organization list
  if (!props.id) {
    return <Navigate to={'/orglist'} />;
  }

  // Mutation to remove a member from the organization
  const [remove] = useMutation(REMOVE_MEMBER_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPeopleListCard',
  });
  const { t: tCommon } = useTranslation('common');

  // Function to remove a member and handle success or error
  const removeMember = async (): Promise<void> => {
    try {
      const { data } = await remove({
        variables: {
          userid: props.id,
          orgid: currentUrl,
        },
      });
      if (data) {
        toast.success(t('memberRemoved') as string);
        props.toggleRemoveModal();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <div>
      {/* Modal to confirm member removal */}
      <Modal show={true} onHide={props.toggleRemoveModal}>
        <Modal.Header>
          <h5>{t('removeMember')}</h5>
          {/* Button to close the modal */}
          <Button
            variant="danger"
            onClick={props.toggleRemoveModal}
            className={styles.closeButton}
          >
            <Close className={styles.closeButton} />
          </Button>
        </Modal.Header>
        <Modal.Body>{t('removeMemberMsg')}</Modal.Body>
        <Modal.Footer>
          {/* Button to cancel the removal action */}
          <Button
            variant="danger"
            onClick={props.toggleRemoveModal}
            className={styles.closeButton}
          >
            {tCommon('no')}
          </Button>
          {/* Button to confirm the removal action */}
          <Button
            type="button"
            className={styles.yesButton}
            onClick={removeMember}
            data-testid="removeMemberBtn"
          >
            {tCommon('yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export {};
export default orgPeopleListCard;
