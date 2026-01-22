/**
 * Component representing a card for managing organization members.
 *
 * This component displays a modal to confirm the removal of a member from an organization.
 * It uses GraphQL mutation to handle the removal process and provides feedback to the user
 * through toast notifications. The modal includes options to confirm or cancel the removal.
 *
 * Module: OrgPeopleListCard
 * File: OrgPeopleListCard.tsx
 * See REMOVE_MEMBER_MUTATION_PG for the GraphQL mutation used to remove a member.
 *
 * @param props - The props for the component.
 * @param id - The ID of the member to be removed.
 * @param toggleRemoveModal - Function to toggle the visibility of the modal.
 *
 * @returns  A React component that renders the modal for member removal.
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
import BaseModal from 'shared-components/BaseModal/BaseModal';
import Button from 'shared-components/Button';
import { useMutation } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import { REMOVE_MEMBER_MUTATION_PG } from 'GraphQl/Mutations/mutations';
import { useParams, Navigate } from 'react-router';
import { errorHandler } from 'utils/errorHandler';
import styles from './OrgPeopleListCard.module.css';
import type { InterfaceOrgPeopleListCardProps } from 'types/AdminPortal/Organization/interface';

function orgPeopleListCard(
  props: InterfaceOrgPeopleListCardProps,
): JSX.Element {
  // Get the current organization ID from the URL parameters
  const { orgId: currentUrl } = useParams();

  // If the member ID is not provided, navigate to the organization list
  if (!props.id) {
    return <Navigate to={'/admin/orglist'} />;
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
        NotificationToast.success(t('memberRemoved') as string);
        props.toggleRemoveModal();
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };

  return (
    <div>
      {/* Modal to confirm member removal */}
      <BaseModal
        show={true}
        onHide={props.toggleRemoveModal}
        title={t('removeMember')}
        headerTestId="removeMemberModal"
        footer={
          <>
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
          </>
        }
      >
        {t('removeMemberMsg')}
      </BaseModal>
    </div>
  );
}
export {};
export default orgPeopleListCard;
