/*
 * Copyright 2025 Palisadoes Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
