/**
 * CRUD Modal Template Components
 *
 * This module provides a set of reusable modal templates for common CRUD operations.
 * These templates standardize modal behavior, styling, and accessibility across the application.
 *
 * @example
 * ```tsx
 * import { CreateModal, EditModal, DeleteModal, ViewModal } from 'shared-components/CRUDModalTemplate';
 *
 * <CreateModal
 *   open={showCreateModal}
 *   title="Create Campaign"
 *   onClose={handleClose}
 *   onSubmit={handleCreate}
 *   loading={isCreating}
 * >
 *   <Form.Group>
 *     <TextField label="Name" value={name} onChange={setName} />
 *   </Form.Group>
 * </CreateModal>
 * ```
 */

export { CRUDModalTemplate } from './CRUDModalTemplate';
export { CreateModal } from './CreateModal';
export { EditModal } from './EditModal';
export { DeleteModal } from './DeleteModal';
export { ViewModal } from './ViewModal';

export { useModalState, useFormModal, useMutationModal } from './hooks';

export type {
  InterfaceCrudModalBaseProps,
  InterfaceCRUDModalTemplateProps,
  InterfaceCreateModalProps,
  InterfaceEditModalProps,
  InterfaceDeleteModalProps,
  InterfaceViewModalProps,
  InterfaceModalFormState,
  InterfaceRecurringEventProps,
  InterfaceUseModalStateReturn,
  InterfaceUseFormModalReturn,
  InterfaceUseMutationModalReturn,
  ModalSize,
} from 'types/shared-components/CRUDModalTemplate/interface';
