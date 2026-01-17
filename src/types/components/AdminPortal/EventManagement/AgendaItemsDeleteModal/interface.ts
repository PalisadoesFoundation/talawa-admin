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
/**
 * Interface for the AgendaItemsDeleteModal component props.
 * Defines the visibility state, event handlers, and translation functions required by the modal.
 */
export interface InterfaceAgendaItemsDeleteModalProps {
  /** Controls whether the delete confirmation modal is visible */
  agendaItemDeleteModalIsOpen: boolean;

  /** Function to toggle or close the modal visibility */
  toggleDeleteModal: () => void;

  /** Event handler to execute the logic for deleting an agenda item */
  deleteAgendaItemHandler: () => void;

  /** Translation function for specific namespaces */
  t: (key: string) => string;

  /** Common translation function for shared strings */
  tCommon: (key: string) => string;
}
