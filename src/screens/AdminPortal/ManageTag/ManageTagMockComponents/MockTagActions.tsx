/**
 * MockTagActions is a React functional component that simulates the behavior
 * of a modal for managing tag actions. It is primarily used for testing purposes
 * and adheres to the `InterfaceTagActionsProps` interface.
 *
 * @component
 * @param {InterfaceTagActionsProps} props - The props for the component.
 * @param {boolean} props.tagActionsModalIsOpen - A boolean indicating whether the modal is open.
 * @param {() => void} props.hideTagActionsModal - A callback function to close the modal.
 *
 * @returns {JSX.Element} A JSX element representing the mock tag actions modal.
 *
 * @example
 * ```tsx
 * <MockTagActions
 *   tagActionsModalIsOpen={true}
 *   hideTagActionsModal={() => console.log('Modal closed')}
 * />
 * ```
 *
 * @remarks
 * - The modal is rendered conditionally based on the `tagActionsModalIsOpen` prop.
 * - Includes accessibility features such as `aria-modal`, `aria-labelledby`, and `aria-label`.
 * - The `hideTagActionsModal` function is triggered when the close button is clicked.
 *
 * @file This file is located at:
 * `/src/screens/ManageTag/ManageTagMockComponents/MockTagActions.tsx`
 */
import React from 'react';
import type { InterfaceTagActionsProps } from 'components/TagActions/TagActions';
import { useTranslation } from 'react-i18next';

const MockTagActions: React.FC<InterfaceTagActionsProps> = ({
  tagActionsModalIsOpen,
  hideTagActionsModal,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const { t: tCommon } = useTranslation('common');
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
            {t('tagActions')}
          </h2>
          <button
            data-testid="closeTagActionsModalBtn"
            aria-label={tCommon('closeModal')}
            onClick={hideTagActionsModal}
          >
            {tCommon('close')}
          </button>
        </div>
      )}
    </>
  );
};

export default MockTagActions;
