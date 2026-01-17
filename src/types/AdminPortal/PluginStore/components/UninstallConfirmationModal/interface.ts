import type { IPluginMeta } from 'plugin';

/**
 * Interface for the UninstallConfirmationModal component props.
 */
export interface InterfaceUninstallConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  plugin: IPluginMeta | null;
}

