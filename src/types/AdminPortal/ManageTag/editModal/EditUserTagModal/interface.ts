import type { TFunction } from 'i18next';
import type { FormEvent } from 'react';
import React from 'react';

/**
 * Interface for the EditUserTagModal component props.
 * Defines the properties required for modal visibility, state management,
 * and event handling for editing a user tag.
 */
export interface InterfaceEditUserTagModalProps {
  /** Controls whether the edit modal is currently visible */
  editUserTagModalIsOpen: boolean;

  /** Function to close the modal */
  hideEditUserTagModal: () => void;

  /** The current value of the tag name being edited */
  newTagName: string;

  /** State setter function to update the tag name */
  setNewTagName: (state: React.SetStateAction<string>) => void;

  /** Event handler to save the edited tag changes */
  handleEditUserTag: (e: FormEvent<HTMLFormElement>) => Promise<void>;

  /** Translation function for the 'manageTag' namespace */
  t: TFunction<'translation', 'manageTag'>;

  /** Common translation function for shared terms */
  tCommon: TFunction<'common', undefined>;
}
