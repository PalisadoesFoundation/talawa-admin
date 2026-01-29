/**
 * UnassignUserTagModal component.
 *
 * This modal provides a confirmation dialog for unassigning a user tag.
 *
 * @param props - Component props defined by InterfaceUnassignUserTagModalProps.
 *
 * @remarks
 * - Uses DeleteModal template from CRUDModalTemplate for consistent UI and behavior.
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
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import { useTranslation } from 'react-i18next';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmUnassign = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await handleUnassignUserTag();
    } catch {
      NotificationToast.error(t('unassignUserTagError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DeleteModal
      open={unassignUserTagModalIsOpen}
      onClose={toggleUnassignUserTagModal}
      title={t('unassignUserTag')}
      onDelete={onConfirmUnassign}
      loading={isSubmitting}
      size="sm"
      data-testid="unassign-user-tag-modal"
    >
      <div>{t('unassignUserTagMessage')}</div>
    </DeleteModal>
  );
};

export default UnassignUserTagModal;
