import React from 'react';
import type { InterfaceAddPeopleToTagProps } from '../../../components/AddPeopleToTag/AddPeopleToTag';

const MockAddPeopleToTag: React.FC<InterfaceAddPeopleToTagProps> = ({
  addPeopleToTagModalIsOpen,
  hideAddPeopleToTagModal,
}) => {
  return (
    <>
      {addPeopleToTagModalIsOpen && (
        <div data-testid="addPeopleToTagModal">
          <button
            data-testid="closeAddPeopleToTagModal"
            onClick={hideAddPeopleToTagModal}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default MockAddPeopleToTag;
