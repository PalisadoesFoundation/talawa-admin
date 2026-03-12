import React, { useMemo } from 'react';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import { Frequency, getMonthlyOptions } from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceMonthlySectionProps } from 'types/shared-components/Recurrence/interface';
import styles from './RecurrenceMonthlySection.module.css';
import { useTranslation } from 'react-i18next';

/**
 * Monthly recurrence options section.
 *
 * Renders a dropdown to choose between day-of-month (e.g., "on the 15th")
 * or weekday-based (e.g., "on the third Monday") monthly recurrence.
 *
 * @param frequency - The current recurrence frequency.
 * @param recurrenceRuleState - The current recurrence rule state.
 * @param setRecurrenceRuleState - Setter for the recurrence rule state.
 * @param startDate - The start date of the event.
 */
export const RecurrenceMonthlySection: React.FC<
  InterfaceRecurrenceMonthlySectionProps
> = ({ frequency, recurrenceRuleState, setRecurrenceRuleState, startDate }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const monthlyOptions = useMemo(
    () => getMonthlyOptions(startDate),
    [startDate],
  );

  const options = useMemo(
    () => [
      { label: monthlyOptions.byDate, value: 'DATE' },
      { label: monthlyOptions.byWeekday, value: 'WEEKDAY' },
    ],
    [monthlyOptions],
  );

  const selectedValue = recurrenceRuleState.byDay ? 'WEEKDAY' : 'DATE';

  /**
   * Handles selecting between day-of-month and weekday-based recurrence.
   * @param value - 'DATE' for day-of-month or 'WEEKDAY' for weekday-based recurrence.
   */
  const handleSelect = (value: string): void => {
    if (value === 'DATE') {
      setRecurrenceRuleState((prev) => ({
        ...prev,
        byMonthDay: [monthlyOptions.dateValue],
        byDay: undefined,
        bySetPos: undefined,
      }));
    } else {
      setRecurrenceRuleState((prev) => ({
        ...prev,
        byDay: [monthlyOptions.weekdayValue.day],
        bySetPos: [monthlyOptions.weekdayValue.week],
        byMonthDay: undefined,
      }));
    }
  };

  if (frequency !== Frequency.MONTHLY) {
    return null;
  }

  return (
    <div className="mb-4">
      <span className="fw-semibold text-secondary">{t('monthlyOn')}</span>
      <br />
      <div className="mx-2 mt-3">
        <DropDownButton
          id="monthly-dropdown"
          options={options}
          selectedValue={selectedValue}
          onSelect={handleSelect}
          variant="outline-secondary"
          dataTestIdPrefix="monthlyRecurrenceDropdown"
          ariaLabel={t('monthlyOn')}
          menuClassName={styles.dropdownMenu}
          parentContainerStyle={styles.dropdown}
        />
      </div>
    </div>
  );
};
