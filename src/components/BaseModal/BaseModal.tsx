// src/components/BaseModal/BaseModal.tsx
import React from 'react';
import { Modal } from 'react-bootstrap';

interface BaseModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const BaseModal = ({ show, onHide, title, footer, children }: BaseModalProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footer && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
};

export default BaseModal;