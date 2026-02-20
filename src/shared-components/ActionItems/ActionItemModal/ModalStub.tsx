import React from 'react';

type ModalStubProps = {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

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
