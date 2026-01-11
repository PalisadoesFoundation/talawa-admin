import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import styles from '../../style/app-fixed.module.css';
import {
  Days,
  Frequency,
  daysOptions,
  endsAfter,
  endsNever,
  endsOn,
} from '../../utils/recurrenceUtils';
import type {
  InterfaceRecurrenceRule,
  RecurrenceEndOptionType,
  WeekDays,
} from '../../utils/recurrenceUtils';
import { RecurrenceFrequencySection } from './RecurrenceFrequencySection';
import { RecurrenceWeeklySection } from './RecurrenceWeeklySection';
import { RecurrenceMonthlySection } from './RecurrenceMonthlySection';
import { RecurrenceYearlySection } from './RecurrenceYearlySection';
import { RecurrenceEndOptionsSection } from './RecurrenceEndOptionsSection';
import type { InterfaceCustomRecurrenceModalProps } from 'types/Recurrence/interface';

/**
 * CustomRecurrenceModal Component
 *
 * A shared modal component for configuring custom recurrence rules for events.
 * This component is used by both Admin and User portals via the shared EventForm.
 *
 * @param recurrenceRuleState - Current recurrence rule state
 * @param setRecurrenceRuleState - Function to update recurrence rule state
 * @param endDate - Event end date
 * @param setEndDate - Function to set event end date
 * @param customRecurrenceModalIsOpen - Whether the modal is open
 * @param hideCustomRecurrenceModal - Function to hide the modal
 * @param setCustomRecurrenceModalIsOpen - Function to set modal open state
 * @param t - Translation function
 * @param startDate - Event start date
 *
 * @returns The rendered CustomRecurrenceModal component
 *
 * @remarks
 * - Supports daily, weekly, monthly, and yearly recurrence frequencies
 * - Allows configuration of interval (every N days/weeks/months/years)
 * - Weekly recurrence supports day-of-week selection
 * - Monthly recurrence supports by-date or by-weekday options
 * - End conditions: never, on specific date, or after N occurrences
 * - Includes comprehensive ARIA attributes for accessibility
 * - Supports keyboard navigation for weekday selection
 * - Includes data-cy attributes for E2E testing
 *
 * @example
 * ```tsx
 * <CustomRecurrenceModal
 *   recurrenceRuleState={recurrenceRule}
 *   setRecurrenceRuleState={setRecurrenceRule}
 *   endDate={eventEndDate}
 *   setEndDate={setEventEndDate}
 *   customRecurrenceModalIsOpen={isOpen}
 *   hideCustomRecurrenceModal={() => setIsOpen(false)}
 *   setCustomRecurrenceModalIsOpen={setIsOpen}
 *   t={t}
 *   startDate={eventStartDate}
 * />
 * ```
 */
const CustomRecurrenceModal: React.FC<InterfaceCustomRecurrenceModalProps> = ({
  recurrenceRuleState,
  setRecurrenceRuleState,
  endDate,
  customRecurrenceModalIsOpen,
  hideCustomRecurrenceModal,
  setCustomRecurrenceModalIsOpen,
  t,
  startDate,
}) => {
  const { frequency, byDay, interval = 1, count, never } = recurrenceRuleState;
  const [selectedRecurrenceEndOption, setSelectedRecurrenceEndOption] =
    useState<RecurrenceEndOptionType>(() => {
      // Initialize based on current recurrence state
      if (never) return endsNever;
      if (recurrenceRuleState.endDate) return endsOn;
      if (count) return endsAfter;
      // Default to "after" for yearly frequency, "never" for others
      return frequency === Frequency.YEARLY ? endsAfter : endsNever;
    });

  const [localInterval, setLocalInterval] = useState<number | string>(interval);
  const [localCount, setLocalCount] = useState<number | string>(
    count || (frequency === Frequency.YEARLY ? 5 : 1),
  );

  /**
   * Synchronizes the selected recurrence end option when the recurrence rule's endDate changes
   * Automatically selects "endsOn" option if endDate is set and neither never nor count are set
   */
  useEffect(() => {
    // Update selected end option when recurrence rule's endDate changes
    if (recurrenceRuleState.endDate && !never && !count) {
      setSelectedRecurrenceEndOption(endsOn);
    }
  }, [recurrenceRuleState.endDate, never, count]);

  /**
   * Handles changes to the recurrence end option (never, on date, after count)
   * @param e - The change event from the radio button input
   */
  const handleRecurrenceEndOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const selectedOption = e.target.value as RecurrenceEndOptionType;
    setSelectedRecurrenceEndOption(selectedOption);
    if (selectedOption === endsNever) {
      setRecurrenceRuleState((prev) => ({
        ...prev,
        never: true,
        count: undefined,
        endDate: undefined,
      }));
    } else if (selectedOption === endsOn) {
      const defaultRecurrenceEndDate = endDate
        ? new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      setRecurrenceRuleState((prev) => ({
        ...prev,
        never: false,
        count: undefined,
        endDate: defaultRecurrenceEndDate,
      }));
    } else if (selectedOption === endsAfter) {
      const totalCount =
        typeof localCount === 'string' ? parseInt(localCount) : localCount;
      setRecurrenceRuleState((prev) => ({
        ...prev,
        never: false,
        endDate: undefined,
        count: totalCount,
      }));
    }
  };

  /**
   * Handles changes to the recurrence frequency (daily, weekly, monthly, yearly)
   * @param newFrequency - The new frequency to set
   */
  const handleFrequencyChange = (newFrequency: Frequency): void => {
    const eventDate = new Date(startDate);
    const currentDay = Days[eventDate.getDay()];
    const currentMonth = eventDate.getMonth() + 1;
    const currentMonthDay = eventDate.getDate();

    let updatedRule: Partial<InterfaceRecurrenceRule> = {
      frequency: newFrequency,
      byDay: undefined,
      byMonth: undefined,
      byMonthDay: undefined,
    };
    switch (newFrequency) {
      case Frequency.WEEKLY:
        updatedRule.byDay = [currentDay];
        break;
      case Frequency.MONTHLY:
        updatedRule.byMonthDay = [currentMonthDay];
        break;
      case Frequency.YEARLY:
        updatedRule.byMonth = [currentMonth];
        updatedRule.byMonthDay = [currentMonthDay];
        updatedRule.count = 5;
        updatedRule.never = false;
        updatedRule.endDate = undefined;
        break;
      case Frequency.DAILY:
      default:
        break;
    }

    setRecurrenceRuleState((prev) => ({
      ...prev,
      ...updatedRule,
    }));

    if (newFrequency === Frequency.YEARLY) {
      setSelectedRecurrenceEndOption(endsAfter);
      setLocalCount(5);
    }
  };

  /**
   * Handles changes to the recurrence interval (every N days/weeks/months/years)
   * @param e - The change event from the interval input
   */
  const handleIntervalChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const inputValue = e.target.value;
    setLocalInterval(inputValue);

    const newInterval = Math.max(1, parseInt(inputValue) || 1);
    setRecurrenceRuleState((prev) => ({
      ...prev,
      interval: newInterval,
    }));
  };

  /**
   * Handles changes to the occurrence count for "ends after" option
   * @param e - The change event from the count input
   */
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    setLocalCount(inputValue);

    if (selectedRecurrenceEndOption === endsAfter) {
      const newCount = Math.max(1, parseInt(inputValue) || 1);
      setRecurrenceRuleState((prev) => ({
        ...prev,
        count: newCount,
        never: false,
        endDate: undefined,
      }));
    }
  };

  /**
   * Handles clicking on day buttons for weekly recurrence
   * @param day - The day that was clicked
   */
  const handleDayClick = (day: WeekDays): void => {
    if (byDay?.includes(day)) {
      setRecurrenceRuleState((prev) => ({
        ...prev,
        byDay: byDay.filter((d) => d !== day),
      }));
    } else {
      setRecurrenceRuleState((prev) => ({
        ...prev,
        byDay: [...(byDay || []), day],
      }));
    }
  };

  /**
   * Handles keyboard navigation for weekday buttons
   * @param e - The keyboard event
   * @param currentIndex - The current day button index
   */
  const handleWeekdayKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ): void => {
    const total = daysOptions.length;
    let newIndex = currentIndex;

    if (e.key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + total) % total;
    } else if (e.key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % total;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = total - 1;
    } else {
      return; // Not a navigation key, let default behavior handle it
    }

    e.preventDefault();
    const button = document.querySelector(
      `[data-cy="recurrenceWeekDay-${newIndex}"]`,
    ) as HTMLButtonElement;
    if (button) {
      button.focus();
    }
  };

  /**
   * Handles submission of the custom recurrence modal
   * Validates inputs and updates the recurrence rule state
   */
  const handleCustomRecurrenceSubmit = (): void => {
    let finalRule = { ...recurrenceRuleState };

    const parsedInterval =
      typeof localInterval === 'string'
        ? parseInt(localInterval)
        : localInterval;
    if (isNaN(parsedInterval) || parsedInterval < 1) {
      console.error('Invalid interval:', localInterval);
      NotificationToast.error(
        t('invalidDetailsMessage') ||
          'Please enter a valid interval (must be at least 1)',
      );
      return;
    }
    finalRule.interval = parsedInterval;

    // Validate weekly recurrence has at least one day selected
    if (frequency === Frequency.WEEKLY && (!byDay || byDay.length === 0)) {
      NotificationToast.error(
        t('selectAtLeastOneDay') ||
          'Please select at least one day for weekly recurrence',
      );
      return;
    }

    if (selectedRecurrenceEndOption === endsNever) {
      finalRule = {
        ...finalRule,
        never: true,
        count: undefined,
        endDate: undefined,
      };
    } else if (selectedRecurrenceEndOption === endsOn) {
      const recurrenceEndDate =
        recurrenceRuleState.endDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      finalRule = {
        ...finalRule,
        never: false,
        count: undefined,
        endDate: recurrenceEndDate,
      };
    } else if (selectedRecurrenceEndOption === endsAfter) {
      const parsedCount =
        typeof localCount === 'string' ? parseInt(localCount) : localCount;
      if (isNaN(parsedCount) || parsedCount < 1) {
        console.error('Invalid count:', localCount);
        NotificationToast.error(
          t('invalidDetailsMessage') ||
            'Please enter a valid occurrence count (must be at least 1)',
        );
        return;
      }

      finalRule = {
        ...finalRule,
        never: false,
        endDate: undefined,
        count: parsedCount,
      };
    }

    setRecurrenceRuleState(finalRule);
    setCustomRecurrenceModalIsOpen(false);
  };

  return (
    <>
      <BaseModal
        show={customRecurrenceModalIsOpen}
        onHide={hideCustomRecurrenceModal}
        centered
        dataTestId="customRecurrenceModal"
        title={t('customRecurrence')}
        showCloseButton={true}
        bodyClassName="pb-2"
      >
        <RecurrenceFrequencySection
          frequency={frequency}
          localInterval={localInterval}
          onIntervalChange={handleIntervalChange}
          onFrequencyChange={handleFrequencyChange}
          t={t}
        />

        <RecurrenceWeeklySection
          frequency={frequency}
          byDay={byDay}
          onDayClick={handleDayClick}
          onWeekdayKeyDown={handleWeekdayKeyDown}
          t={t}
        />

        <RecurrenceMonthlySection
          frequency={frequency}
          recurrenceRuleState={recurrenceRuleState}
          setRecurrenceRuleState={setRecurrenceRuleState}
          startDate={startDate}
          t={t}
        />

        <RecurrenceYearlySection
          frequency={frequency}
          startDate={startDate}
          t={t}
        />

        <RecurrenceEndOptionsSection
          frequency={frequency}
          selectedRecurrenceEndOption={selectedRecurrenceEndOption}
          recurrenceRuleState={recurrenceRuleState}
          localCount={localCount}
          onRecurrenceEndOptionChange={handleRecurrenceEndOptionChange}
          onCountChange={handleCountChange}
          setRecurrenceRuleState={setRecurrenceRuleState}
          t={t}
        />

        <hr className="mt-4 mb-2 mx-2" />

        <div className="mx w-100 position-relative">
          <Button
            className={styles.recurrenceRuleSubmitBtn}
            data-testid="customRecurrenceSubmitBtn"
            data-cy="customRecurrenceSubmitBtn"
            onClick={handleCustomRecurrenceSubmit}
            aria-label={t('done')}
          >
            {t('done')}
          </Button>
        </div>
      </BaseModal>
    </>
  );
};

export default CustomRecurrenceModal;
