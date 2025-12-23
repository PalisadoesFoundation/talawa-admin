/**
 * RemoveUserTagModal Component
 *
 * Renders a confirmation modal for removing a user tag in the Manage Tag section.
 *
 * @component
 * @param {InterfaceRemoveUserTagModalProps} props - The props for the component.
 * @param {boolean} props.removeUserTagModalIsOpen - Determines whether the modal is visible.
 * @param {() => void} props.toggleRemoveUserTagModal - Function to toggle the visibility of the modal.
 * @param {() => Promise<void>} props.handleRemoveUserTag - Async function to handle the removal of a user tag.
 * @param {TFunction<'translation', 'manageTag'>} props.t - Translation function for the "manageTag" namespace.
 * @param {TFunction<'common', undefined>} props.tCommon - Translation function for common terms.
 *
 * @returns {JSX.Element} The rendered modal component.
 *
 * @example
 * <RemoveUserTagModal
 *   removeUserTagModalIsOpen={true}
 *   toggleRemoveUserTagModal={handleToggle}
 *   handleRemoveUserTag={handleRemove}
 *   t={tFunction}
 *   tCommon={tCommonFunction}
 * />
 */
import type { TFunction } from 'i18next';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { BaseModal } from 'shared-components/BaseModal';

export interface InterfaceRemoveUserTagModalProps {
  removeUserTagModalIsOpen: boolean;
  toggleRemoveUserTagModal: () => void;
  handleRemoveUserTag: () => Promise<void>;
  t: TFunction<'translation', 'manageTag'>;
  tCommon: TFunction<'common', undefined>;
}

const RemoveUserTagModal: React.FC<InterfaceRemoveUserTagModalProps> = ({
  removeUserTagModalIsOpen,
  toggleRemoveUserTagModal,
  handleRemoveUserTag,
  t,
  tCommon,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmRemove = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await handleRemoveUserTag();
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
      headerClassName={styles.modalHeader}
      headerContent={
        <h5 className={`modal-title text-white`} id="removeUserTag">
          {t('removeUserTag')}
        </h5>
      }
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
      <p id="removeUserTagMessage">{t('removeUserTagMessage')}</p>
    </BaseModal>
  );
};

export default RemoveUserTagModal;
