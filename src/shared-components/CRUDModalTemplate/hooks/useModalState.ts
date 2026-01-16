import { useState, useCallback } from 'react';
import type { InterfaceUseModalStateReturn } from 'types/shared-components/CRUDModalTemplate/interface';

/**
 * Custom hook for managing modal open/close state.
 *
 * Provides a simple API for controlling modal visibility with
 * open, close, and toggle functions.
 *
 * @param initialState - Initial open state (defaults to false)
 * @returns Object containing isOpen state and control functions
 *
 * @example
 * ```tsx
 * const { isOpen, open, close } = useModalState();
 *
 * return (
 *   <>
 *     <Button onClick={open}>Open Modal</Button>
 *     <CreateModal open={isOpen} onClose={close} title="Create Item">
 *       <Form.Control type="text" />
 *     </CreateModal>
 *   </>
 * );
 * ```
 */
export function useModalState(
  initialState: boolean = false,
): InterfaceUseModalStateReturn {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const open = useCallback((): void => {
    setIsOpen(true);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
