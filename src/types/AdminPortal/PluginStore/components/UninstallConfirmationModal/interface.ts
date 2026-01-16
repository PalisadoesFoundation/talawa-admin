import type { IPluginMeta } from 'plugin';

/**
 * Interface for the UninstallConfirmationModal component props.
 *
 * @property show - Boolean to control modal visibility.
 * @property onClose - Function to close the modal.
 * @property onConfirm - Function to execute the uninstallation logic.
 * @property plugin - The plugin object to be uninstalled.
 */
export interface InterfaceUninstallConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  plugin: IPluginMeta | null;
}
