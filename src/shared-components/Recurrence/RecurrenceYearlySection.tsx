import React from 'react';
import { Frequency, monthNames } from '../../utils/recurrenceUtils';
import { useTranslation } from 'react-i18next';
import type { InterfaceRecurrenceYearlySectionProps } from 'types/shared-components/Recurrence/interface';
import styles from './RecurrenceYearlySection.module.css';

/**
 * Yearly recurrence options section.
 *
 * Displays the month and day on which the event will recur annually,
 * based on the start date of the event.
 *
 * @param frequency - The current recurrence frequency.
 * @param startDate - The start date of the event.
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
    <div className={styles.sectionContainer}>
      <span className="text-secondary">{t('yearlyOn')}</span>
      <br />
      <div className={styles.optionsMargin}>
        <span className={styles.yearlyDate}>
          {monthNames[startDate.getMonth()]} {startDate.getDate()}
        </span>
        <p className="small">{t('yearlyRecurrenceDesc')}</p>
      </div>
    </div>
  );
};
