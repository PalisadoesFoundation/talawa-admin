/**
 * Confirmation modal for plugin uninstallation.
 *
 * @param props - The properties for the component.
 * @returns The rendered UninstallConfirmationModal component.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { Button } from 'shared-components/Button';
import { IUninstallConfirmationModalProps } from 'types/AdminPortal/PluginStore/UninstallConfirmationModal/interface';
import styles from './UninstallConfirmationModal.module.css';

export default function UninstallConfirmationModal({
  show,
  onClose,
  onConfirm,
  plugin,
}: IUninstallConfirmationModalProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'pluginStore' });
  const { t: tCommon } = useTranslation('common');

  const customFooter = (
    <div className={styles.footer}>
      <Button
        variant="secondary"
        onClick={onClose}
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
    </div>
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
        <div data-testid="uninstall-modal-title" className={styles.modalTitle}>
          {t('uninstallPluginMsg', {
            pluginName: plugin?.name || '',
          })}
        </div>
        <div className={styles.warningText}>{t('uninstallPluginWarning')}</div>
      </div>
    </BaseModal>
  );
}
