import React from 'react';
import { Frequency, Days, daysOptions } from 'utils/recurrenceUtils';
import styles from './RecurrenceWeeklySection.module.css';
import Button from 'shared-components/Button';
import { InterfaceRecurrenceWeeklySectionProps } from 'types/shared-components/Recurrence/interface';
import { useTranslation } from 'react-i18next';
/**
 * Weekly recurrence day selection section.
 *
 * Renders toggle buttons for each day of the week, allowing users to select
 * which days the event should recur on.
 *
 * @param frequency - The current recurrence frequency.
 * @param byDay - The currently selected days.
 * @param onDayClick - Callback when a day button is clicked.
 * @param onWeekdayKeyDown - Callback for keyboard navigation between day buttons.
 */
export const RecurrenceWeeklySection: React.FC<
  InterfaceRecurrenceWeeklySectionProps
> = ({ frequency, byDay, onDayClick, onWeekdayKeyDown }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const { t: tCommon } = useTranslation('common');
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
            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
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
            aria-label={`${tCommon('select')} ${day}`}
            tabIndex={0}
          >
            <span>{day}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
