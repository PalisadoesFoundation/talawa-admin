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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import styles from './AgendaItemsDeleteModal.module.css';
import type { InterfaceAgendaItemsDeleteModalProps } from 'types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface';

/**
 * AgendaItemsDeleteModal
 *
 * A modal component for confirming the deletion of an agenda item.
 * Refactored to use CRUDModalTemplate for consistent styling and behavior.
 *
 * @param agendaItemDeleteModalIsOpen - Boolean to control modal visibility
 * @param toggleDeleteModal - Function to close the modal
 * @param deleteAgendaItemHandler - Function to execute the deletion logic
 * @returns The rendered modal component
 */
const AgendaItemsDeleteModal: React.FC<
  InterfaceAgendaItemsDeleteModalProps
> = ({
  agendaItemDeleteModalIsOpen,
  toggleDeleteModal,
  deleteAgendaItemHandler,
}) => {
  const { t } = useTranslation('translation');

  return (
    <CRUDModalTemplate
      // Base Props
      open={agendaItemDeleteModalIsOpen}
      onClose={toggleDeleteModal}
      title={t('agendaItems.deleteAgendaItem')}
      size="sm"
      className={styles.agendaItemModal}
      // Action Props
      onPrimary={deleteAgendaItemHandler}
      primaryText={t('common.yes')}
      secondaryText={t('common.no')}
      primaryVariant="danger"
    >
      <p>{t('agendaItems.deleteAgendaItemMsg')}</p>
    </CRUDModalTemplate>
  );
};

export default AgendaItemsDeleteModal;
