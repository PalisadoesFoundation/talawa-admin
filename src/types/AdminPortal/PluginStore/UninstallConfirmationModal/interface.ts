import type { IPluginMeta } from 'plugin';

/**
 * Interface for the UninstallConfirmationModal component props.
 *
 * @param show - Boolean to control the visibility of the modal.
 * @param onClose - Callback function to handle the closing of the modal.
 * @param onConfirm - Callback function to handle the confirmation action.
 * @param plugin - The plugin metadata object to be uninstalled, or null if none selected.
 */
export interface IUninstallConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plugin: IPluginMeta | null;
}
