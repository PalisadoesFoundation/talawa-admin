/**
 * Confirmation modal for plugin uninstallation
 */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import type { IPluginMeta } from 'plugin';
import { useTranslation } from 'react-i18next';

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

  return (
    <Dialog
      open={show}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      data-testid="uninstall-modal"
    >
      <DialogTitle sx={{ pb: 1 }}>{t('uninstallPlugin')}</DialogTitle>
      <DialogContent>
        <Typography
          variant="body1"
          sx={{ mb: 2 }}
          data-testid="uninstall-modal-title"
        >
          {t('uninstallPluginMsg', {
            pluginName: plugin?.name || '',
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This action will permanently remove the plugin and all its data. This
          action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ mr: 1 }}
          data-testid="uninstall-cancel-btn"
        >
          {tCommon('cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          data-testid="uninstall-remove-btn"
        >
          {tCommon('removePermanently')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
