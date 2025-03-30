/**
 * MockAddPeopleToTag Component
 *
 * This is a mock component used to simulate the behavior of adding people to a tag.
 * It renders a modal dialog when `addPeopleToTagModalIsOpen` is true and provides
 * a close button to hide the modal.
 *
 * @component
 * @param {InterfaceAddPeopleToTagProps} props - The props for the component.
 * @param {boolean} props.addPeopleToTagModalIsOpen - Determines if the modal is open.
 * @param {() => void} props.hideAddPeopleToTagModal - Callback function to close the modal.
 *
 * @returns {React.FC} A React functional component that renders the modal dialog.
 *
 * @example
 * ```tsx
 * <MockAddPeopleToTag
 *   addPeopleToTagModalIsOpen={true}
 *   hideAddPeopleToTagModal={() => console.log('Modal closed')}
 * />
 * ```
 *
 * @remarks
 * - This component is primarily used for testing purposes.
 * - The modal is accessible with `role="dialog"` and `aria-modal="true"`.
 *
 * @testIds
 * - `addPeopleToTagModal`: Test ID for the modal container.
 * - `closeAddPeopleToTagModal`: Test ID for the close button.
 */
import React from 'react';
import type { InterfaceAddPeopleToTagProps } from 'types/Tag/interface';

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
