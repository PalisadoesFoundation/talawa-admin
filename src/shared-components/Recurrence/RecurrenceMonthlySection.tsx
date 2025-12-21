import React from 'react';
import { Dropdown } from 'react-bootstrap';
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

  return (
    <div className="mb-4">
      <span className="fw-semibold text-secondary">{t('monthlyOn')}</span>
      <br />
      <div className="mx-2 mt-3">
        <Dropdown className="d-inline-block">
          <Dropdown.Toggle
            className="py-2"
            variant="outline-secondary"
            id="monthly-dropdown"
            data-testid="monthlyRecurrenceDropdown"
            data-cy="monthlyRecurrenceDropdown"
            aria-label={t('monthlyOn')}
          >
            {recurrenceRuleState.byDay
              ? monthlyOptions.byWeekday
              : monthlyOptions.byDate}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setRecurrenceRuleState((prev) => ({
                  ...prev,
                  byMonthDay: [monthlyOptions.dateValue],
                  byDay: undefined,
                }));
              }}
              data-testid="monthlyByDate"
              data-cy="monthlyByDate"
            >
              {monthlyOptions.byDate}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};
