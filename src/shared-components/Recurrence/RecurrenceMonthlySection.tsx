import React, { useMemo } from 'react';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import { Frequency, getMonthlyOptions } from '../../utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from '../../utils/recurrenceUtils';
import styles from './RecurrenceMonthlySection.module.css';

interface InterfaceRecurrenceMonthlySectionProps {
  frequency: Frequency;
  recurrenceRuleState: InterfaceRecurrenceRule;
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRule>,
  ) => void;
  startDate: Date;
  t: (key: string) => string;
}

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
  if (frequency !== Frequency.MONTHLY) {
    return null;
  }

  const monthlyOptions = getMonthlyOptions(startDate);

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
      }));
    } else {
      setRecurrenceRuleState((prev) => ({
        ...prev,
        byDay: [monthlyOptions.weekdayValue.day],
        byMonthDay: undefined,
      }));
    }
  };

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
