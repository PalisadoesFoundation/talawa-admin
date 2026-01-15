import type { IPluginMeta } from 'plugin';

export interface InterfaceUninstallConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  plugin: IPluginMeta | null;
}
