import React from 'react';
import type { InterfaceAddPeopleToTagProps } from '../../../components/AddPeopleToTag/AddPeopleToTag';

/**
 * Component that mocks the AddPeopleToTag component for the Manage Tag screen.
 */

const TEST_IDS = {
  MODAL: 'addPeopleToTagModal',
  CLOSE_BUTTON: 'closeAddPeopleToTagModal',
} as const;
const MockAddPeopleToTag: React.FC<InterfaceAddPeopleToTagProps> = ({
  addPeopleToTagModalIsOpen,
  hideAddPeopleToTagModal,
}) => {
  return (
    <>
      {addPeopleToTagModalIsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          data-testid={TEST_IDS.MODAL}
        >
          <h2 id="modal-title" className="sr-only">
            Add People to Tag
          </h2>
          <button
            type="button"
            data-testid={TEST_IDS.CLOSE_BUTTON}
            onClick={hideAddPeopleToTagModal}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default MockAddPeopleToTag;
