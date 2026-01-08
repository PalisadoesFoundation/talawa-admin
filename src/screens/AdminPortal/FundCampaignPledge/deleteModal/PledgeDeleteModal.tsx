/**
 * PledgeDeleteModal Component
 *
 * This component renders a modal for deleting a pledge. It provides a confirmation
 * dialog to the user, allowing them to either confirm or cancel the deletion of a pledge.
 *
 * @remarks
 * - The component uses BaseModal for modal styling.
 * - It utilizes the `useTranslation` hook from `react-i18next` for internationalization.
 * - The `useMutation` hook from `@apollo/client` is used to perform the `DELETE_PLEDGE` GraphQL mutation.
 * - Notifications are displayed using `NotificationToast` to indicate success or error during the deletion process.
 *
 * @example
 * ```tsx
 * <PledgeDeleteModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   pledge={selectedPledge}
 *   refetchPledge={fetchPledges}
 * />
 * ```
 */
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { DELETE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import type { InterfacePledgeInfo } from 'utils/interfaces';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { BaseModal } from 'shared-components/BaseModal';

export interface InterfaceDeletePledgeModal {
  isOpen: boolean;
  hide: () => void;
  pledge: InterfacePledgeInfo | null;
  refetchPledge: () => void;
}

const PledgeDeleteModal: React.FC<InterfaceDeletePledgeModal> = ({
  isOpen,
  hide,
  pledge,
  refetchPledge,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'pledges' });
  const { t: tCommon } = useTranslation('common');

  const [deletePledge] = useMutation(DELETE_PLEDGE);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmDelete = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await deletePledge({ variables: { id: pledge?.id } });
      refetchPledge();
      hide();
      NotificationToast.success(t('pledgeDeleted') as string);
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      title={t('deletePledge')}
      className={styles.pledgeModal}
      closeButtonVariant="danger"
      dataTestId="pledge-delete-modal"
      footer={
        <>
          <Button
            variant="danger"
            onClick={onConfirmDelete}
            disabled={isSubmitting}
            data-testid="deleteyesbtn"
          >
            {tCommon('yes')}
          </Button>

          <Button variant="secondary" onClick={hide} data-testid="deletenobtn">
            {tCommon('no')}
          </Button>
        </>
      }
    >
      <p>{t('deletePledgeMsg')}</p>
    </BaseModal>
  );
};

export default PledgeDeleteModal;
