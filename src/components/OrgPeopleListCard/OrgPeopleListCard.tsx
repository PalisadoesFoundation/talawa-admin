/**
 * Component representing a card for managing organization members.
 *
 * This component displays a modal to confirm the removal of a member from an organization.
 * It uses GraphQL mutation to handle the removal process and provides feedback to the user
 * through toast notifications. The modal includes options to confirm or cancel the removal.
 *
 * @module OrgPeopleListCard
 * @file OrgPeopleListCard.tsx
 * @see {@link REMOVE_MEMBER_MUTATION_PG} for the GraphQL mutation used to remove a member.
 *
 * @param {InterfaceOrgPeopleListCardProps} props - The props for the component.
 * @param {string} props.id - The ID of the member to be removed.
 * @param {() => void} props.toggleRemoveModal - Function to toggle the visibility of the modal.
 *
 * @returns {JSX.Element} A React component that renders the modal for member removal.
 *
 * @remarks
 * - If the `id` prop is not provided, the user is redirected to the organization list.
 * - The `useParams` hook is used to retrieve the current organization ID from the URL.
 * - The `useMutation` hook is used to execute the GraphQL mutation for member removal.
 * - The `useTranslation` hook is used for internationalization of text content.
 *
 * @example
 * ```tsx
 * <OrgPeopleListCard
 *   id="member123"
 *   toggleRemoveModal={() => setShowModal(false)}
 * />
 * ```
 */
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { REMOVE_MEMBER_MUTATION_PG } from 'GraphQl/Mutations/mutations';
import { useParams, Navigate } from 'react-router-dom';
import { errorHandler } from 'utils/errorHandler';
import styles from 'style/app-fixed.module.css';
import { Close } from '@mui/icons-material';
import type { InterfaceOrgPeopleListCardProps } from 'types/Organization/interface';

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
  const [remove] = useMutation(REMOVE_MEMBER_MUTATION_PG);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgPeopleListCard',
  });
  const { t: tCommon } = useTranslation('common');

  // Function to remove a member and handle success or error
  const removeMember = async (): Promise<void> => {
    try {
      const { data } = await remove({
        variables: { memberId: props.id, organizationId: currentUrl },
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
          <h5 data-testid="removeMemberModal">{t('removeMember')}</h5>
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
          <Button
            type="button"
            className={styles.addButton}
            onClick={removeMember}
            data-testid="removeMemberBtn"
          >
            {tCommon('yes')}
          </Button>
          <Button
            type="button"
            onClick={props.toggleRemoveModal}
            className={styles.removeButton}
            data-testid="closeRemoveId"
          >
            {tCommon('no')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export {};
export default orgPeopleListCard;
