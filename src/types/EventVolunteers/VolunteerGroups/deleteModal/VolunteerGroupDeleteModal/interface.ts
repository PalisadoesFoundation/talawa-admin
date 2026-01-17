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
import type { InterfaceVolunteerGroupInfo } from 'utils/interfaces';

/**
 * Interface for the VolunteerGroupDeleteModal component props.
 * Defines the properties required to control visibility, handle deletion logic,
 * and manage the specific volunteer group data.
 */
export interface InterfaceVolunteerGroupDeleteModalProps {
  /** Controls the visibility of the modal */
  isOpen: boolean;

  /** Function to close the modal */
  hide: () => void;

  /** The volunteer group object selected for deletion */
  group: InterfaceVolunteerGroupInfo | null;

  /** Callback function to refresh the groups list after deletion */
  refetchGroups: () => void;

  /** Optional flag indicating if the event is recurring */
  isRecurring?: boolean;

  /** Optional ID of the event associated with the group */
  eventId?: string;
}
