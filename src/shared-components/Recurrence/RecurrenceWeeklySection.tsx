import React from 'react';
import { Frequency, Days, daysOptions } from 'utils/recurrenceUtils';
import styles from './RecurrenceWeeklySection.module.css';
import Button from 'shared-components/Button';
import { InterfaceRecurrenceWeeklySectionProps } from 'types/shared-components/Recurrence/interface';

/**
 * Weekly recurrence day selection section
 */
export const RecurrenceWeeklySection: React.FC<
  InterfaceRecurrenceWeeklySectionProps
> = ({ frequency, byDay, onDayClick, onWeekdayKeyDown, t }) => {
  if (frequency !== Frequency.WEEKLY) {
    return null;
  }

  return (
    <div className="mb-4">
      <span className="fw-semibold text-secondary">{t('repeatsOn')}</span>
      <br />
      <div
        className="mx-2 mt-3 d-flex gap-1"
        role="group"
        aria-label={t('repeatsOn')}
      >
        {daysOptions.map((day, index) => (
          <Button
            key={index}
            type="button"
            className={`${styles.recurrenceDayButton} ${byDay?.includes(Days[index]) ? styles.selected : ''}`}
            onClick={() => onDayClick(Days[index])}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onDayClick(Days[index]);
              } else {
                onWeekdayKeyDown(e, index);
              }
            }}
            data-testid="recurrenceWeekDay"
            data-cy={`recurrenceWeekDay-${index}`}
            aria-pressed={byDay?.includes(Days[index])}
            aria-label={`${t('select')} ${day}`}
            tabIndex={0}
          >
            <span>{day}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
