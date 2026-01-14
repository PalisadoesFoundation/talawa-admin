import React from 'react';
import { Frequency, monthNames } from '../../utils/recurrenceUtils';

interface InterfaceRecurrenceYearlySectionProps {
  frequency: Frequency;
  startDate: Date;
  t: (key: string) => string;
}

/**
 * Yearly recurrence options section
 */
export const RecurrenceYearlySection: React.FC<
  InterfaceRecurrenceYearlySectionProps
> = ({ frequency, startDate, t }) => {
  if (frequency !== Frequency.YEARLY) {
    return null;
  }

  return (
    <div className="mb-4">
      <span className="fw-semibold text-secondary">{t('yearlyOn')}</span>
      <br />
      <div className="mx-2 mt-3">
        <span className="text-muted">
          {monthNames[startDate.getMonth()]} {startDate.getDate()}
        </span>
        <p className="small mt-1 text-muted mb-0">
          {t('yearlyRecurrenceDesc')}
        </p>
      </div>
    </div>
  );
};
