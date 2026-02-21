import React from 'react';

type ModalStubProps = {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

/**
 * Renders a minimal form wrapper for modal test mocks.
 *
 * @param props - Modal content and submit handler.
 * @returns Form wrapper used in tests.
 */
export default function ModalStub({
  children,
  onSubmit,
}: ModalStubProps): JSX.Element {
  return (
    <form data-testid="actionItemModal" onSubmit={onSubmit}>
      {children}
    </form>
  );
}
