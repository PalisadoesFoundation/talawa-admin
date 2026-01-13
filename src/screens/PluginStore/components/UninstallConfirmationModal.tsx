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
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });

  return (
    <BaseModal
      show={show}
      onHide={onClose}
      title={t('uninstallPluginTitle')}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            data-testid="uninstall-cancel-btn"
            className="me-2"
          >
            {t('cancelButton')}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            data-testid="uninstall-remove-btn"
          >
            {t('removePermanentlyButton')}
          </Button>
        </>
      }
    >
      <div data-testid="uninstall-modal">
        <p className="mb-2" data-testid="uninstall-modal-title">
          {t('uninstallConfirmationTitle', { name: plugin?.name })}
        </p>
        <p className="text-secondary small">
          {t('uninstallConfirmationDescription')}
        </p>
      </div>
    </BaseModal>
  );
}
