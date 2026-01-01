/**
 * A React functional component that renders a modal for unassigning a user tag.
 * This modal provides a confirmation dialog with "Yes" and "No" options.
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
 * @remarks
 * - The modal is styled using Bootstrap and custom CSS classes from `app-fixed.module.css`.
 * - The "Yes" button is disabled while the `handleUnassignUserTag` function is executing.
 * - Accessibility attributes such as `aria-label` are used for better screen reader support.
 *
 * @example
 * ```tsx
 * <UnassignUserTagModal
 *   unassignUserTagModalIsOpen={true}
 *   toggleUnassignUserTagModal={() => console.log('Toggle modal')}
 *   handleUnassignUserTag={async () => console.log('Unassign user tag')}
 *   t={(key) => key}
 *   tCommon={(key) => key}
 * />
 * ```
 */
// translation-check-keyPrefix: manageTag
import type { TFunction } from 'i18next';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import { BaseModal } from 'shared-components/BaseModal';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
