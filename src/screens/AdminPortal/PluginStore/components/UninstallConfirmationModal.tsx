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

import React, { useState } from 'react';
import Button from 'shared-components/Button/Button';
import { useTranslation } from 'react-i18next';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { InterfaceUninstallConfirmationModalProps } from 'types/AdminPortal/PluginStore/components/UninstallConfirmationModal/interface';

/**
 * UninstallConfirmationModal
 *
 * A confirmation modal displayed before uninstalling a plugin.
 * It warns the user about the action and triggers the uninstall process.
 *
 * @param show - Boolean to control modal visibility
 * @param onClose - Function to close the modal without taking action
 * @param onConfirm - Function to proceed with uninstallation
 * @param plugin - The plugin object being uninstalled
 * @returns The rendered modal component or null if no plugin is selected.
 */
const UninstallConfirmationModal: React.FC<
  InterfaceUninstallConfirmationModalProps
> = ({ show, onClose, onConfirm, plugin }) => {
  // FIX: Use only the 'translation' namespace
  const { t } = useTranslation('translation');
  const [isLoading, setIsLoading] = useState(false);

  // Guard Clause: If plugin is null, do not render anything.
  if (!plugin) {
    return null;
  }

  /**
   * Handles the confirmation action.
   * Wraps onConfirm to manage loading state.
   */
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Uninstall failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      show={show}
      onHide={onClose}
      title={t('uninstallPlugin.title')}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            data-testid="uninstall-cancel-btn"
            className="me-2"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isLoading}
            data-testid="uninstall-remove-btn"
          >
            {isLoading ? t('loading') : t('uninstallPlugin.removeBtn')}
          </Button>
        </>
      }
    >
      <div data-testid="uninstall-modal">
        <p className="mb-2" data-testid="uninstall-modal-title">
          {t('uninstallPlugin.message')}
        </p>
        <p className="text-secondary small">{t('uninstallPlugin.warning')}</p>
      </div>
    </BaseModal>
  );
};

export default UninstallConfirmationModal;
