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
        variant="secondary"
        onClick={onClose}
        className="me-2"
        data-testid="uninstall-cancel-btn"
      >
        {tCommon('cancel')}
      </Button>
      <Button
        variant="danger"
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
      size="sm"
      dataTestId="uninstall-modal"
      centered
    >
      <div>
        <div data-testid="uninstall-modal-title" className="mb-3">
          {t('uninstallPluginMsg', {
            pluginName: plugin?.name || '',
          })}
        </div>
        <div className="text-muted">{t('uninstallPluginWarning')}</div>
      </div>
    </BaseModal>
  );
}
