import React, { useMemo } from 'react';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import { Frequency, getMonthlyOptions } from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceMonthlySectionProps } from 'types/shared-components/Recurrence/interface';
import styles from './RecurrenceMonthlySection.module.css';

/**
 * Monthly recurrence options section
 */
export const RecurrenceMonthlySection: React.FC<
  InterfaceRecurrenceMonthlySectionProps
> = ({
  frequency,
  recurrenceRuleState,
  setRecurrenceRuleState,
  startDate,
  t,
}) => {
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
