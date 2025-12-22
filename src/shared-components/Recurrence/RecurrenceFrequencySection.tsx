import React from 'react';
import { Dropdown, FormControl } from 'react-bootstrap';
import { Frequency, frequencies } from '../../utils/recurrenceUtils';
import styles from '../../style/app-fixed.module.css';

interface InterfaceRecurrenceFrequencySectionProps {
  frequency: Frequency;
  localInterval: number | string;
  onIntervalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFrequencyChange: (newFrequency: Frequency) => void;
  t: (key: string) => string;
}

/**
 * Frequency and interval selection section
 */
export const RecurrenceFrequencySection: React.FC<
  InterfaceRecurrenceFrequencySectionProps
> = ({ frequency, localInterval, onIntervalChange, onFrequencyChange, t }) => {
  return (
    <div className="mb-4">
      <span className="fw-semibold text-secondary">{t('repeatsEvery')}</span>{' '}
      <FormControl
        type="number"
        value={localInterval}
        onChange={onIntervalChange}
        onDoubleClick={(e) => {
          (e.target as HTMLInputElement).select();
        }}
        onKeyDown={(e) => {
          if (
            e.key === '-' ||
            e.key === '+' ||
            e.key === 'e' ||
            e.key === 'E'
          ) {
            e.preventDefault();
          }
        }}
        min="1"
        className={`${styles.recurrenceRuleNumberInput} ms-2 d-inline-block py-2`}
        data-testid="customRecurrenceIntervalInput"
        data-cy="customRecurrenceIntervalInput"
        aria-label={t('repeatsEvery')}
        aria-required="true"
        placeholder="1"
      />
      <Dropdown className="ms-3 d-inline-block">
        <Dropdown.Toggle
          className={`${styles.dropdown}`}
          variant="outline-secondary"
          id="dropdown-basic"
          data-testid="customRecurrenceFrequencyDropdown"
          data-cy="customRecurrenceFrequencyDropdown"
          aria-label={t('frequency')}
        >
          {frequencies[frequency]}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => onFrequencyChange(Frequency.DAILY)}
            data-testid="customDailyRecurrence"
            data-cy="customDailyRecurrence"
          >
            {t('day')}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onFrequencyChange(Frequency.WEEKLY)}
            data-testid="customWeeklyRecurrence"
            data-cy="customWeeklyRecurrence"
          >
            {t('week')}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onFrequencyChange(Frequency.MONTHLY)}
            data-testid="customMonthlyRecurrence"
            data-cy="customMonthlyRecurrence"
          >
            {t('month')}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => onFrequencyChange(Frequency.YEARLY)}
            data-testid="customYearlyRecurrence"
            data-cy="customYearlyRecurrence"
          >
            {t('year')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
