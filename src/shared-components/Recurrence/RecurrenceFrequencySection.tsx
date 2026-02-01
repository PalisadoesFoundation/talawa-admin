import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { Frequency, frequencies } from '../../utils/recurrenceUtils';
import styles from './RecurrenceFrequencySection.module.css';

import { InterfaceRecurrenceFrequencySectionProps } from 'types/shared-components/Recurrence/interface';
/**
 * Frequency and interval selection section
 */
export const RecurrenceFrequencySection: React.FC<
  InterfaceRecurrenceFrequencySectionProps
> = ({ frequency, localInterval, onIntervalChange, onFrequencyChange, t }) => {
  return (
    <div className="mb-4">
      <span className="fw-semibold text-secondary">{t('repeatsEvery')}</span>{' '}
      <FormTextField
        name="recurrenceInterval"
        type="number"
        value={localInterval.toString()}
        onChange={(value) =>
          onIntervalChange({
            target: { value },
          } as React.ChangeEvent<HTMLInputElement>)
        }
        onDoubleClick={(e: React.MouseEvent<HTMLInputElement>) => {
          (e.currentTarget as HTMLInputElement).select();
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (['-', '+', 'e', 'E'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        required
        placeholder="1"
        className={`${styles.recurrenceRuleNumberInput} ms-2 d-inline-block py-2`}
        data-testid="customRecurrenceIntervalInput"
        data-cy="customRecurrenceIntervalInput"
        aria-label={t('repeatsEvery')}
        label={t('repeatsEvery')}
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
