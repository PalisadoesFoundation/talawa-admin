import React, { useEffect } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import type { CrudModalBaseProps } from './types';

export interface CRUDModalTemplateProps extends CrudModalBaseProps {
  children?: React.ReactNode;
  onPrimary?: () => void;
}

const CRUDModalTemplate: React.FC<CRUDModalTemplateProps> = ({
  open,
  title,
  onClose,
  onPrimary,
  loading = false,
  error,
  primaryText = 'Save',
  secondaryText = 'Cancel',
  children,
}) => {
  // Keyboard: Enter triggers primary action
  useEffect(() => {
    if (!open || !onPrimary) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onPrimary();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onPrimary]);

  return (
    <Modal
      show={open}
      onHide={onClose}
      centered
      aria-labelledby="crud-modal-title"
      backdrop="static"
      keyboard
    >
      <Modal.Header closeButton>
        <Modal.Title id="crud-modal-title">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading && <Spinner animation="border" role="status" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && children}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {secondaryText}
        </Button>

        {onPrimary && (
          <Button
            variant="primary"
            onClick={onPrimary}
            disabled={loading}
          >
            {primaryText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CRUDModalTemplate;
