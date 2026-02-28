import React from 'react';
import { Frequency, monthNames } from '../../utils/recurrenceUtils';
import { useTranslation } from 'react-i18next';

interface InterfaceRecurrenceYearlySectionProps {
  frequency: Frequency;
  startDate: Date;
}

/**
 * Yearly recurrence options section
 */
export const RecurrenceYearlySection: React.FC<
  InterfaceRecurrenceYearlySectionProps
> = ({ frequency, startDate }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
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
