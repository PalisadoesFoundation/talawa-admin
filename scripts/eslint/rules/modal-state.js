/**
 * Modal state restrictions - enforce useModalState hook for modal visibility management.
 * For more details refer to the useModalState hook at `src/shared-components/CRUDModalTemplate/hooks/useModalState.ts`
 *
 * Patterns caught:
 * - modalState (exact match)
 * - showModal (exact match)
 * - show*Modal (e.g., showUploadModal, showUninstallModal)
 * - *ModalIsOpen (e.g., editUserTagModalIsOpen)
 * - *modalisOpen (e.g., createEventmodalisOpen)
 */
export const modalStateRestrictions = [
  // Catch: modalState (exact match for boolean or object modal state)
  {
    selector:
      "VariableDeclarator[id.type='ArrayPattern'][init.callee.name='useState'] > ArrayPattern > Identifier[name='modalState']:first-child",
    message:
      'Prefer useModalState hook for modal visibility state. Import from shared-components/CRUDModalTemplate/hooks/useModalState.',
  },
  // Catch: showModal (exact match)
  {
    selector:
      "VariableDeclarator[id.type='ArrayPattern'][init.callee.name='useState'] > ArrayPattern > Identifier[name='showModal']:first-child",
    message:
      'Prefer useModalState hook for modal visibility state. Import from shared-components/CRUDModalTemplate/hooks/useModalState.',
  },
  // Catch: show*Modal pattern (e.g., showUploadModal, showUninstallModal, showRecurringModal)
  {
    selector:
      "VariableDeclarator[id.type='ArrayPattern'][init.callee.name='useState'] > ArrayPattern > Identifier[name=/^show[A-Z].*Modal$/]:first-child",
    message:
      'Prefer useModalState hook for modal visibility state. Import from shared-components/CRUDModalTemplate/hooks/useModalState.',
  },
  // Catch: *ModalIsOpen pattern (e.g., editUserTagModalIsOpen, addPeopleToTagModalIsOpen)
  {
    selector:
      "VariableDeclarator[id.type='ArrayPattern'][init.callee.name='useState'] > ArrayPattern > Identifier[name=/ModalIsOpen$/]:first-child",
    message:
      'Prefer useModalState hook for modal visibility state. Import from shared-components/CRUDModalTemplate/hooks/useModalState.',
  },
  // Catch: *modalisOpen pattern (e.g., createEventmodalisOpen) - lowercase variant
  {
    selector:
      "VariableDeclarator[id.type='ArrayPattern'][init.callee.name='useState'] > ArrayPattern > Identifier[name=/modalisOpen$/]:first-child",
    message:
      'Prefer useModalState hook for modal visibility state. Import from shared-components/CRUDModalTemplate/hooks/useModalState.',
  },
];
