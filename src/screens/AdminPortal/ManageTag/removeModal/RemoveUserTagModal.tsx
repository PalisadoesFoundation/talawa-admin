/**
 * RemoveUserTagModal component.
 *
 * This modal confirms removing a user tag in the Manage Tag flow.
 *
 * @param props - Component props defined by InterfaceRemoveUserTagModalProps.
 *
 * @remarks
 * - Uses translation functions for localized button labels and messages.
 * - Disables the submit button while the removal request is in flight.
 *
 * @example
 * Example usage:
 * - removeUserTagModalIsOpen: true
 * - toggleRemoveUserTagModal: handleToggle
 * - handleRemoveUserTag: handleRemove
 *
 * @returns The rendered remove user tag modal.
 */
// translation-check-keyPrefix: manageTag
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from './RemoveUserTagModal.module.css';
import { BaseModal } from 'shared-components/BaseModal';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';

export interface InterfaceRemoveUserTagModalProps {
  removeUserTagModalIsOpen: boolean;
  toggleRemoveUserTagModal: () => void;
  handleRemoveUserTag: () => Promise<void>;
}

const RemoveUserTagModal: React.FC<InterfaceRemoveUserTagModalProps> = ({
  removeUserTagModalIsOpen,
  toggleRemoveUserTagModal,
  handleRemoveUserTag,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tCommon } = useTranslation('common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmRemove = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await handleRemoveUserTag();
    } catch (error) {
      console.error(error);
      NotificationToast.error(t('removeUserTagError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <BaseModal
      show={removeUserTagModalIsOpen}
      onHide={toggleRemoveUserTagModal}
      size="sm"
      backdrop="static"
      keyboard={false}
      title={t('removeUserTag')}
      headerClassName={`${styles.modalHeader} text-white`}
      dataTestId="remove-user-tag-modal"
      footer={
        <>
          <Button
            type="button"
            className={`btn btn-danger ${styles.removeButton}`}
            onClick={toggleRemoveUserTagModal}
            data-testid="removeUserTagModalCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            className={`btn ${styles.addButton}`}
            onClick={onConfirmRemove}
            disabled={isSubmitting}
            data-testid="removeUserTagSubmitBtn"
          >
            {tCommon('yes')}
          </Button>
        </>
      }
    >
      <p>{t('removeUserTagMessage')}</p>
    </BaseModal>
  );
};

export default RemoveUserTagModal;
