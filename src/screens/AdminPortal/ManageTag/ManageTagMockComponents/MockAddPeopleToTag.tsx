/**
 * MockAddPeopleToTag Component
 *
 * This is a mock component used to simulate the behavior of adding people to a tag.
 * It renders a modal dialog when `addPeopleToTagModalIsOpen` is true and provides
 * a close button to hide the modal.
 *
 * @param addPeopleToTagModalIsOpen - Determines if the modal is open.
 * @param hideAddPeopleToTagModal - Callback function to close the modal.
 *
 * @returns A React functional component that renders the modal dialog.
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
 * TestIds
 * - `addPeopleToTagModal`: Test ID for the modal container.
 * - `closeAddPeopleToTagModal`: Test ID for the close button.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { InterfaceAddPeopleToTagProps } from 'types/AdminPortal/Tag/interface';

const TEST_IDS = {
  MODAL: 'addPeopleToTagModal',
  CLOSE_BUTTON: 'closeAddPeopleToTagModal',
} as const;
const MockAddPeopleToTag: React.FC<InterfaceAddPeopleToTagProps> = ({
  addPeopleToTagModalIsOpen,
  hideAddPeopleToTagModal,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tCommon } = useTranslation('common');
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
            {t('addPeopleToTag')}
          </h2>
          <button
            type="button"
            data-testid={TEST_IDS.CLOSE_BUTTON}
            onClick={hideAddPeopleToTagModal}
            aria-label={tCommon('closeModal')}
          >
            {tCommon('close')}
          </button>
        </div>
      )}
    </>
  );
};

export default MockAddPeopleToTag;
