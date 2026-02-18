import React from 'react';
import { Frequency, Days, daysOptions, WeekDays } from 'utils/recurrenceUtils';
import styles from './RecurrenceWeeklySection.module.css';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';

interface InterfaceRecurrenceWeeklySectionProps {
  frequency: Frequency;
  byDay?: WeekDays[];
  onDayClick: (day: WeekDays) => void;
  onWeekdayKeyDown: (
    e: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => void;
  t: (key: string) => string;
}

/**
 * Weekly recurrence day selection section
 */
export const RecurrenceWeeklySection: React.FC<
  InterfaceRecurrenceWeeklySectionProps
> = ({ frequency, byDay, onDayClick, onWeekdayKeyDown }) => {
  const { t: tr } = useTranslation('translation', {
    keyPrefix: 'recurrenceWeeklySection',
  });

  if (frequency !== Frequency.WEEKLY) {
    return null;
  }

  return (
    <div className="mb-4">
      <span className="fw-semibold text-secondary">{tr('repeatsOn')}</span>
      <br />
      <div
        className="mx-2 mt-3 d-flex gap-1"
        role="group"
        aria-label={tr('repeatsOn')}
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
            aria-label={`${tr('select')} ${day}`}
            tabIndex={0}
          >
            <span>{day}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
