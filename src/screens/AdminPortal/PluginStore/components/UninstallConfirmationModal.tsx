/**
 * Confirmation modal for plugin uninstallation
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { Button } from 'shared-components/Button';
import type { IPluginMeta } from 'plugin';

interface IUninstallConfirmationModalProps {
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
}: IUninstallConfirmationModalProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const { t: tCommon } = useTranslation('common');

  const customFooter = (
    <>
      <Button
        variant="secondary" // Was 'color="inherit"' in MUI, usually translates to secondary or outline-secondary in Bootstrap/BaseModal
        onClick={onClose}
        className="me-2" // sx={{ mr: 1 }}
        data-testid="uninstall-cancel-btn"
      >
        {tCommon('cancel')}
      </Button>
      <Button
        variant="danger" // Was 'color="error"' in MUI
        onClick={onConfirm}
        data-testid="uninstall-remove-btn"
      >
        {tCommon('removePermanently')}
      </Button>
    </>
  );

  return (
    <BaseModal
      show={show}
      title={t('uninstallPlugin')}
      onHide={onClose}
      footer={customFooter}
      size="sm" // maxWidth="sm" in MUI
      dataTestId="uninstall-modal"
      centered // Default in BaseModal but good to be explicit if matching MUI's likely centered behavior
    >
      <div>
        <div data-testid="uninstall-modal-title" className="mb-3">
          {t('uninstallPluginMsg', {
            pluginName: plugin?.name || '',
          })}
        </div>
        <div className="text-muted">
          This action will permanently remove the plugin and all its data. This
          action cannot be undone.
        </div>
      </div>
    </BaseModal>
  );
}
