/**
 * A React functional component that renders a modal for removing an admin
 * from an organization. It provides a confirmation dialog with "Yes" and "No"
 * options and handles the admin removal process using a GraphQL mutation.
 *
 * @param id - The unique identifier of the admin to be removed.
 * @param toggleRemoveModal - A function to toggle the visibility of the modal.
 *
 * @returns A JSX element representing the modal for removing an admin.
 *
 * @remarks
 * - If the `id` prop is not provided, the user is redirected to the organization list page.
 * - The `removeAdmin` function executes the `REMOVE_ADMIN_MUTATION` to remove the admin
 *   and displays a success message upon completion.
 * - In case of an error during the mutation, the `errorHandler` utility is used to handle it.
 *
 * @example
 * ```tsx
 * <OrgAdminListCard
 *   id="12345"
 *   toggleRemoveModal={() => setShowModal(false)}
 * />
 * ```
 *
 * Dependencies:
 * - React
 * - shared-components (Button, BaseModal)
 * - `@apollo/client` (useMutation)
 * - react-toastify (toast)
 * - react-i18next (useTranslation)
 * - react-router-dom (Navigate, useParams)
 * - utils/errorHandler
 *
 */
import React from 'react';
import { BaseModal } from 'shared-components/BaseModal';
import Button from 'shared-components/Button';
import { useMutation } from '@apollo/client';
import { REMOVE_ADMIN_MUTATION } from 'GraphQl/Mutations/mutations';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router';
import { errorHandler } from 'utils/errorHandler';
import type { InterfaceOrgPeopleListCardProps } from 'types/AdminPortal/Organization/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

function orgAdminListCard({
  id,
  toggleRemoveModal,
}: InterfaceOrgPeopleListCardProps): JSX.Element {
  if (!id) {
    return <Navigate to={'/admin/orglist'} />;
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
          userid: id,
          orgid: currentUrl,
        },
      });
      if (data) {
        NotificationToast.success(t('adminRemoved') as string);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    }
  };
  return (
    <BaseModal
      show={true}
      onHide={toggleRemoveModal}
      title={t('removeAdmin')}
      footer={
        <>
          <Button variant="danger" onClick={toggleRemoveModal}>
            {tCommon('no')}
          </Button>
          <Button
            variant="success"
            onClick={removeAdmin}
            data-testid="removeAdminBtn"
          >
            {tCommon('yes')}
          </Button>
        </>
      }
    >
      {t('removeAdminMsg')}
    </BaseModal>
  );
}
export default orgAdminListCard;
