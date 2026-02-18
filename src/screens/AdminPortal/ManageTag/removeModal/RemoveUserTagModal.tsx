/**
 * RemoveUserTagModal component.
 *
 * This modal confirms removing a user tag in the Manage Tag flow.
 *
 * @param props - Component props defined by InterfaceRemoveUserTagModalProps.
 *
 * @remarks
 * - Uses DeleteModal template from CRUDModalTemplate for consistent UI and behavior.
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
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmRemove = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await handleRemoveUserTag();
    } catch {
      NotificationToast.error(t('removeUserTagError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DeleteModal
      open={removeUserTagModalIsOpen}
      onClose={toggleRemoveUserTagModal}
      title={t('removeUserTag')}
      onDelete={onConfirmRemove}
      loading={isSubmitting}
      size="sm"
      data-testid="remove-user-tag-modal"
    >
      <p>{t('removeUserTagMessage')}</p>
    </DeleteModal>
  );
};

export default RemoveUserTagModal;
