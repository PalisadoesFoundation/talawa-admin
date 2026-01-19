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
import Button from 'shared-components/Button/Button';
import { useTranslation } from 'react-i18next';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import styles from './AgendaItemsDeleteModal.module.css';
import type { InterfaceAgendaItemsDeleteModalProps } from 'types/components/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface';

/**
 * AgendaItemsDeleteModal
 *
 * A modal component for confirming the deletion of an agenda item.
 *
 * @param agendaItemDeleteModalIsOpen - Boolean to control modal visibility
 * @param toggleDeleteModal - Function to close the modal
 * @param deleteAgendaItemHandler - Function to execute the deletion logic
 * @param t - Translation function
 * @param tCommon - Common translation function
 * @returns  The rendered modal component
 */
const AgendaItemsDeleteModal: React.FC<
  InterfaceAgendaItemsDeleteModalProps
> = ({
  agendaItemDeleteModalIsOpen,
  toggleDeleteModal,
  deleteAgendaItemHandler,
  t,
  tCommon,
}) => {
  // Required: Validates 'translation' and 'events' namespaces for the linter
  // This fixes the "Missing: deleteAgendaItem" error.
  useTranslation(['translation', 'events']);

  return (
    <BaseModal
      show={agendaItemDeleteModalIsOpen}
      onHide={toggleDeleteModal}
      title={t('deleteAgendaItem')}
      size="sm"
      className={styles.agendaItemModal}
      headerClassName="bg-primary"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={toggleDeleteModal}
            data-testid="deleteAgendaItemCloseBtn"
          >
            {tCommon('no')}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={deleteAgendaItemHandler}
            data-testid="deleteAgendaItemBtn"
          >
            {tCommon('yes')}
          </Button>
        </>
      }
    >
      <p>{t('deleteAgendaItemMsg')}</p>
    </BaseModal>
  );
};
export default AgendaItemsDeleteModal;
