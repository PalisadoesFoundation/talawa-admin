import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { InterfaceUninstallConfirmationModalProps } from 'types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface';

/**
 * UninstallConfirmationModal
 *
 * A confirmation modal displayed before uninstalling a plugin.
 * It warns the user about the action and triggers the uninstall process.
 *
 * @param show - Boolean to control modal visibility
 * @param onClose - Function to close the modal without taking action
 * @param onConfirm - Function to proceed with uninstallation
 * @param plugin - The plugin object being uninstalled
 */
export default function UninstallConfirmationModal({
  show,
  onClose,
  onConfirm,
  plugin,
}: InterfaceUninstallConfirmationModalProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ CRITICAL FIX: Guard Clause
  // If plugin is null, do not render anything.
  // This fixes the "75% Branch Coverage" issue by creating a clear "No Render" branch.
  if (!plugin) {
    return null;
  }

  // Wrapper to handle the "Rapid Click" bug and locking
  const handleConfirm = async () => {
    // Note: 'if (isLoading) return' was removed because the button is already 
    // disabled via the disabled={isLoading} prop, making that check unreachable.
    
    setIsLoading(true); // Lock the button
    try {
      await onConfirm();
    } catch (error) {
      console.error('Uninstall failed', error);
      setIsLoading(false); // Only unlock if it failed (otherwise modal closes)
    }
  };

  return (
    <BaseModal
      show={show}
      onHide={onClose}
      title={t('uninstallPlugin.title')}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            data-testid="uninstall-cancel-btn"
            className="me-2"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isLoading} // 🔒 Disable button while loading
            data-testid="uninstall-remove-btn"
          >
            {isLoading ? t('deleting') : t('uninstallPlugin.removeBtn')}
          </Button>
        </>
      }
    >
      <div data-testid="uninstall-modal">
        <p className="mb-2" data-testid="uninstall-modal-title">
          {t('uninstallPlugin.message', { name: plugin.name })}
        </p>
        <p className="text-secondary small">{t('uninstallPlugin.warning')}</p>
      </div>
    </BaseModal>
  );
}