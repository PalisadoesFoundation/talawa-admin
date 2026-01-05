/**
 * UnassignUserTagModal component.
 *
 * This modal provides a confirmation dialog for unassigning a user tag.
 *
 * @param props - Component props defined by InterfaceUnassignUserTagModalProps.
 *
 * @remarks
 * - Uses translation functions for localized labels and messages.
 * - Disables the submit button while the unassign request is in flight.
 * - Uses accessible labels for the confirmation buttons.
 *
 * @example
 * Example usage:
 * - unassignUserTagModalIsOpen: true
 * - toggleUnassignUserTagModal: toggleUnassign
 * - handleUnassignUserTag: handleUnassign
 *
 * @returns The rendered unassign user tag modal.
 */
// translation-check-keyPrefix: manageTag
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from './UnassignUserTagModal.module.css';
import { BaseModal } from 'shared-components/BaseModal';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';

export interface InterfaceUnassignUserTagModalProps {
  unassignUserTagModalIsOpen: boolean;
  toggleUnassignUserTagModal: () => void;
  handleUnassignUserTag: () => Promise<void>;
}

const UnassignUserTagModal: React.FC<InterfaceUnassignUserTagModalProps> = ({
  unassignUserTagModalIsOpen,
  toggleUnassignUserTagModal,
  handleUnassignUserTag,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tCommon } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmUnassign = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await handleUnassignUserTag();
    } catch (error) {
      console.error(error);
      NotificationToast.error(t('unassignUserTagError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <BaseModal
      show={unassignUserTagModalIsOpen}
      onHide={toggleUnassignUserTagModal}
      size="sm"
      backdrop="static"
      keyboard={false}
      title={t('unassignUserTag')}
      headerClassName={`${styles.modalHeader} text-white`}
      dataTestId="unassign-user-tag-modal"
      footer={
        <>
          <Button
            type="button"
            className={`btn btn-danger ${styles.removeButton}`}
            onClick={toggleUnassignUserTagModal}
            data-testid="unassignTagModalCloseBtn"
            aria-label={tCommon('no')}
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className={`btn ${styles.addButton}`}
            onClick={onConfirmUnassign}
            disabled={isSubmitting}
            data-testid="unassignTagModalSubmitBtn"
            aria-label={tCommon('yes')}
          >
            {tCommon('yes')}
          </Button>
        </>
      }
    >
      <div>{t('unassignUserTagMessage')}</div>
    </BaseModal>
  );
};

export default UnassignUserTagModal;
