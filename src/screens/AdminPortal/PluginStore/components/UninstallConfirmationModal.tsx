/**
 * Confirmation modal for plugin uninstallation
 */
import React from 'react';
import { Button } from 'react-bootstrap';
import BaseModal from 'components/BaseModal/BaseModal';
import type { IPluginMeta } from 'plugin';
import { useTranslation } from 'react-i18next';

interface InterfaceUninstallConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plugin: IPluginMeta | null;
}

export default function UninstallConfirmationModal({
  show,
  onClose,
  onConfirm,
  plugin,
}: InterfaceUninstallConfirmationModalProps) {
  return (
    <BaseModal
      show={show}
      onHide={onClose}
      title="Uninstall Plugin"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            data-testid="uninstall-cancel-btn"
            className="me-2"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            data-testid="uninstall-remove-btn"
          >
            Remove Permanently
          </Button>
        </>
      }
    >
      <div data-testid="uninstall-modal">
        <p className="mb-2" data-testid="uninstall-modal-title">
          Are you sure you want to uninstall {plugin?.name}?
        </p>
        <p className="text-secondary small">
          This action will permanently remove the plugin and all its data. This
          action cannot be undone.
        </p>
      </div>
    </BaseModal>
  );
}
>>>>>>> bba2f37a4f6 (refactor: migrate 5 form modals to BaseModal (#5104)):src/screens/PluginStore/components/UninstallConfirmationModal.tsx
  );
}
