import type { IPluginMeta } from 'plugin';

/**
 * Interface for the UninstallConfirmationModal component props.
 * Defines the properties required to control the modal's visibility,
 * handle user actions, and pass the selected plugin data.
 */
export interface InterfaceUninstallConfirmationModalProps {
  /** Controls whether the uninstall confirmation modal is visible */
  show: boolean;

  /** Function to close the modal without taking action */
  onClose: () => void;

  /** Function to proceed with the uninstallation process */
  onConfirm: () => Promise<void>;

  /** The metadata of the plugin selected for uninstallation, or null if none selected */
  plugin: IPluginMeta | null;
}
