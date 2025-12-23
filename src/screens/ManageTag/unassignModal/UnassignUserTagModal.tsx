/**
 * UnassignUserTagModal Component
 *
 * Renders a confirmation modal for unassigning a user tag.
 * Provides "Yes" and "No" options to confirm or cancel the action.
 *
 * @component
 * @param {InterfaceUnassignUserTagModalProps} props - The props for the component.
 * @param {boolean} props.unassignUserTagModalIsOpen - Determines if the modal is open or closed.
 * @param {() => void} props.toggleUnassignUserTagModal - Function to toggle the modal's visibility.
 * @param {() => Promise<void>} props.handleUnassignUserTag - Async function to handle the unassigning of a user tag.
 * @param {TFunction<'translation', 'manageTag' | 'memberDetail'>} props.t - Translation function for localized strings specific to the modal.
 * @param {TFunction<'common', undefined>} props.tCommon - Translation function for common localized strings.
 *
 * @returns {JSX.Element} The rendered modal component.
 *
 * @example
 * <UnassignUserTagModal
 *   unassignUserTagModalIsOpen={true}
 *   toggleUnassignUserTagModal={handleToggle}
 *   handleUnassignUserTag={handleUnassign}
 *   t={tFunction}
 *   tCommon={tCommonFunction}
 * />
 */
import type { TFunction } from 'i18next';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { BaseModal } from 'shared-components/BaseModal';

export interface InterfaceUnassignUserTagModalProps {
  unassignUserTagModalIsOpen: boolean;
  toggleUnassignUserTagModal: () => void;
  handleUnassignUserTag: () => Promise<void>;
  t: TFunction<'translation', 'manageTag' | 'memberDetail'>;
  tCommon: TFunction<'common', undefined>;
}

const UnassignUserTagModal: React.FC<InterfaceUnassignUserTagModalProps> = ({
  unassignUserTagModalIsOpen,
  toggleUnassignUserTagModal,
  handleUnassignUserTag,
  t,
  tCommon,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirmUnassign = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await handleUnassignUserTag();
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
      headerClassName={styles.modalHeader}
      headerContent={
        <h5 className="modal-title text-white" id="unassignTag">
          {t('unassignUserTag')}
        </h5>
      }
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
