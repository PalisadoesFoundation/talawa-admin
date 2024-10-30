import React from 'react';
import type { InterfaceTagActionsProps } from '../../../components/TagActions/TagActions';

/**
 * Component that mocks the TagActions component for the Manage Tag screen.
 */

const MockTagActions: React.FC<InterfaceTagActionsProps> = ({
  tagActionsModalIsOpen,
  hideTagActionsModal,
}) => {
  return (
    <>
      {tagActionsModalIsOpen && (
        <div
          data-testid="tagActionsModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <h2 id="modalTitle" className="sr-only">
            Tag Actions
          </h2>
          <button
            data-testid="closeTagActionsModalBtn"
            aria-label="Close modal"
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
