import React from 'react';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { CRUDModalTemplate } from './CRUDModalTemplate';
import type { InterfaceDeleteModalProps } from 'types/shared-components/CRUDModalTemplate/interface';

/**
 * DeleteModal Component
 *
 * Specialized modal template for delete confirmations.
 * Displays warning UI and handles delete operations.
 *
 * Features:
 * - Warning icon for visual emphasis
 * - Highlighted entity name in confirmation message
 * - Support for recurring event deletion patterns
 * - Danger-styled delete button
 * - Loading state prevents duplicate delete requests
 *
 * @example
 * ```tsx
 * <DeleteModal
 *   open={showModal}
 *   title="Delete Campaign"
 *   onClose={handleClose}
 *   onDelete={handleDelete}
 *   loading={isDeleting}
 *   entityName="Summer Campaign 2024"
 *   confirmationMessage="Are you sure you want to delete this campaign?"
 * />
 * ```
 *
 * @example Recurring event deletion
 * ```tsx
 * <DeleteModal
 *   open={showModal}
 *   title="Delete Recurring Event"
 *   onClose={handleClose}
 *   onDelete={handleDelete}
 *   loading={isDeleting}
 *   entityName="Weekly Meeting"
 *   recurringEventContent={
 *     <Form.Group>
 *       <Form.Check
 *         type="radio"
 *         label="Delete this instance only"
 *         checked={deleteMode === 'instance'}
 *         onChange={() => setDeleteMode('instance')}
 *       />
 *       <Form.Check
 *         type="radio"
 *         label="Delete all future instances"
 *         checked={deleteMode === 'series'}
 *         onChange={() => setDeleteMode('series')}
 *       />
 *     </Form.Group>
 *   }
 * />
 * ```
 */
export const DeleteModal: React.FC<InterfaceDeleteModalProps> = ({
  open,
  title,
  onClose,
  children,
  onDelete,
  loading = false,
  error,
  size,
  className,
  centered = true,
  'data-testid': dataTestId,
  entityName,
  showWarning = true,
  recurringEventContent,
}) => {
  const { t: tCommon } = useTranslation('common');
  const isOpen = open ?? false;

  const handleDelete = () => {
    if (!loading) {
      return onDelete();
    }
  };

  const customFooter = (
    <div>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={loading}
        data-testid="modal-cancel-btn"
      >
        {tCommon('cancel')}
      </Button>
      <Button
        variant="danger"
        onClick={handleDelete}
        disabled={loading}
        data-testid="modal-delete-btn"
      >
        {tCommon('delete')}
      </Button>
    </div>
  );

  return (
    <CRUDModalTemplate
      open={isOpen}
      title={title}
      onClose={onClose}
      loading={loading}
      error={error}
      size={size}
      className={className}
      centered={centered}
      data-testid={dataTestId}
      customFooter={customFooter}
    >
      {showWarning && (
        <div>
          <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
        </div>
      )}

      {children ? (
        children
      ) : (
        <p>
          {entityName
            ? tCommon('deleteEntityConfirmation', { entityName })
            : tCommon('deleteConfirmation')}
        </p>
      )}

      {recurringEventContent && <div>{recurringEventContent}</div>}
    </CRUDModalTemplate>
  );
};
