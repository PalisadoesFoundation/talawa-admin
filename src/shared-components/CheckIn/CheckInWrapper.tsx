/**
 * A wrapper component for managing the "Check-In Members" functionality.
 *
 * This component renders a button that, when clicked, opens a modal for
 * checking in members for a specific event. The modal is controlled
 * using a local state to toggle its visibility.
 *
 * @param props - Component props of type InterfaceCheckInWrapperProps.
 * The props include:
 * - eventId: The unique identifier of the event for which members are being checked in.
 * - onCheckInUpdate: Optional callback invoked after check-in updates.
 * @returns The rendered CheckInWrapper component.
 *
 * @remarks
 * - The `CheckInModal` component is used to handle the modal functionality.
 * - The button includes an image and text for user interaction.
 * - The `style.createButton` class is applied to the button for styling.
 *
 * @example
 * ```tsx
 * <CheckInWrapper eventId="12345" />
 * ```
 */
import React from 'react';
import { CheckInModal } from './Modal/CheckInModal';
import Button from 'shared-components/Button';
import style from './CheckInWrapper.module.css';
import { useTranslation } from 'react-i18next';
import { useModalState } from 'shared-components/CRUDModalTemplate/hooks/useModalState';
import type { InterfaceCheckInWrapperProps } from 'types/shared-components/CheckInWrapper/interface';

export const CheckInWrapper = ({
  eventId,
  onCheckInUpdate,
}: InterfaceCheckInWrapperProps): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'checkIn' });
  const { t: tCommon } = useTranslation('common');

  const { isOpen: showModal, open, close } = useModalState();

  return (
    <>
      <Button
        data-testid="stats-modal"
        className={style.createButton}
        aria-label={t('checkInMembers')}
        type="button"
        onClick={open}
      >
        <img
          src="/images/svg/options-outline.svg"
          width={30.63}
          height={30.63}
          alt={tCommon('sort')}
        />
        {t('checkInMembers')}
      </Button>

      {showModal && (
        <CheckInModal
          show={showModal}
          handleClose={close}
          eventId={eventId}
          onCheckInUpdate={onCheckInUpdate}
        />
      )}
    </>
  );
};
