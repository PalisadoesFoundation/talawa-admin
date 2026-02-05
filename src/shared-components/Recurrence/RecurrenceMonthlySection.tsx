// translation-check-keyPrefix: organizationEvents
import React from 'react';
import DropDownButton from 'shared-components/DropDownButton';
import { Frequency, getMonthlyOptions } from '../../utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from '../../utils/recurrenceUtils';

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

  const options = [
    {
      label: monthlyOptions.byDate,
      value: 'BY_DATE',
    },
  ];

  return (
    <div className="mb-4">
      <span className="fw-semibold text-secondary">{t('monthlyOn')}</span>
      <br />
      <div className="mx-2 mt-3">
        <DropDownButton
          options={options}
          selectedValue="BY_DATE"
          onSelect={() => {
            setRecurrenceRuleState((prev) => ({
              ...prev,
              byMonthDay: [monthlyOptions.dateValue],
              byDay: undefined,
            }));
          }}
          ariaLabel={t('monthlyOn')}
          dataTestIdPrefix="monthlyRecurrence"
          variant="outline-secondary"
          buttonLabel={
            recurrenceRuleState.byDay
              ? monthlyOptions.byWeekday
              : monthlyOptions.byDate
          }
        />
      </div>
    </div>
  );
};
