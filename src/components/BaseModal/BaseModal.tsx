// src/components/BaseModal/BaseModal.tsx
import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Modal } from 'react-bootstrap';
import type { ModalProps } from 'react-bootstrap';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface BaseModalProps extends ModalProps {
  show: boolean;
  onHide: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  customHeader?: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({
  show,
  onHide,
  title,
  footer,
  children,
  customHeader,
  ...props
}) => {
  return (
    <Modal show={show} onHide={onHide} centered {...props}>
      <Modal.Header closeButton={!customHeader}>
        {customHeader ? customHeader : <Modal.Title>{title}</Modal.Title>}
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footer && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
};

export default BaseModal;
