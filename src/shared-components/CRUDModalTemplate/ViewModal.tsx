import React from 'react';
import { Button } from 'react-bootstrap';
import { CRUDModalTemplate } from './CRUDModalTemplate';
import type { InterfaceViewModalProps } from 'types/CRUDModalTemplate/interface';
import styles from './CRUDModalTemplate.module.css';
import { useTranslation } from 'react-i18next';

/**
 * ViewModal Component
 *
 * Specialized modal template for viewing entity details in read-only mode.
 * No form submission, only displays data with optional custom actions.
 *
 * Features:
 * - Read-only data display
 * - Loading state for data fetching
 * - Optional custom action buttons (e.g., Edit, Delete)
 * - Clean, consistent layout for viewing entities
 *
 * @example
 * ```tsx
 * <ViewModal
 *   open={showModal}
 *   title="Campaign Details"
 *   onClose={handleClose}
 *   data={campaignData}
 *   loadingData={isLoading}
 * >
 *   <div className="details-grid">
 *     <div>
 *       <strong>Name:</strong> {campaignData?.name}
 *     </div>
 *     <div>
 *       <strong>Start Date:</strong> {formatDate(campaignData?.startDate)}
 *     </div>
 *   </div>
 * </ViewModal>
 * ```
 *
 * @example With custom actions
 * ```tsx
 * <ViewModal
 *   open={showModal}
 *   title="User Profile"
 *   onClose={handleClose}
 *   data={userData}
 *   customActions={
 *     <>
 *       <Button onClick={() => setEditMode(true)}>Edit</Button>
 *       <Button variant="danger" onClick={handleDelete}>Delete</Button>
 *     </>
 *   }
 * >
 *   <UserProfile user={userData} />
 * </ViewModal>
 * ```
 */
export const ViewModal = <T,>({
  open,
  show,
  title,
  onClose,
  children,
  loading = false,
  loadingData = false,
  error,
  size,
  className,
  centered = true,
  'data-testid': dataTestId,
  customActions,
}: InterfaceViewModalProps<T>): JSX.Element => {
  const { t: tCommon } = useTranslation('common');
  const isOpen = open ?? show ?? false;
  const isLoading = loading || loadingData;

  const customFooter = (
    <div className={styles.footerButtons}>
      {customActions}
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={isLoading}
        data-testid="modal-close-btn"
      >
        {tCommon('close')}
      </Button>
    </div>
  );

  return (
    <CRUDModalTemplate
      open={isOpen}
      title={title}
      onClose={onClose}
      loading={isLoading}
      error={error}
      size={size}
      className={className}
      centered={centered}
      data-testid={dataTestId}
      customFooter={customFooter}
    >
      <div className={styles.formContainer}>{children}</div>
    </CRUDModalTemplate>
  );
};
