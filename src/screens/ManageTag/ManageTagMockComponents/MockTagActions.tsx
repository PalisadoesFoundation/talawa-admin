import React from 'react';
import type { InterfaceTagActionsProps } from '../../../components/TagActions/TagActions';

const MockTagActions: React.FC<InterfaceTagActionsProps> = ({
  tagActionsModalIsOpen,
  hideTagActionsModal,
}) => {
  return (
    <>
      {tagActionsModalIsOpen && (
        <div data-testid="tagActionsModal">
          <button
            data-testid="closeTagActionsModalBtn"
            onClick={hideTagActionsModal}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default MockTagActions;
