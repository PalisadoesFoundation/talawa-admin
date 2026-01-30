import React from 'react';
import { FormCheckField } from '../FormFieldGroup/FormCheckField';
import { FormTextField } from '../FormFieldGroup/FormTextField';
import DatePicker from '../DatePicker';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  Frequency,
  endsAfter,
  endsNever,
  endsOn,
  recurrenceEndOptions,
} from '../../utils/recurrenceUtils';
import styles from './RecurrenceEndOptionsSection.module.css';

import { InterfaceRecurrenceEndOptionsSectionProps } from 'types/shared-components/Recurrence/interface';

/**
 * Recurrence end options section (never, on date, after count)
 */
export const RecurrenceEndOptionsSection: React.FC<
  InterfaceRecurrenceEndOptionsSectionProps
> = ({
  frequency,
  selectedRecurrenceEndOption,
  recurrenceRuleState,
  localCount,
  onRecurrenceEndOptionChange,
  onCountChange,
  setRecurrenceRuleState,
  t,
}) => {
  return (
    <div className="mb-3">
      <span className="fw-semibold text-secondary">{t('ends')}</span>
      <div className="ms-3 mt-3">
        <div>
          {recurrenceEndOptions
            .filter(
              (option) =>
                frequency !== Frequency.YEARLY || option !== endsNever,
            )
            .map((option, index) => (
              <div key={index} className="my-2 d-flex align-items-center">
                <FormCheckField
                  type="radio"
                  id={`radio-${index}`}
                  label={t(option)}
                  name="recurrenceEndOption"
                  className="d-inline-block me-5"
                  value={option}
                  onChange={onRecurrenceEndOptionChange}
                  checked={option === selectedRecurrenceEndOption}
                  data-testid={`${option}`}
                  data-cy={`recurrenceEndOption-${option}`}
                />

                {option === endsOn && (
                  <div className="ms-3">
                    <DatePicker
                      name="recurrenceEndDate"
                      label={t('endDate')}
                      data-testid="customRecurrenceEndDatePicker"
                      data-cy="customRecurrenceEndDatePicker"
                      className={styles.recurrenceRuleDateBox}
                      disabled={selectedRecurrenceEndOption !== endsOn}
                      value={dayjs(recurrenceRuleState.endDate ?? new Date())}
                      onChange={(date: Dayjs | null): void => {
                        if (date) {
                          const newRecurrenceEndDate = date.toDate();
                          setRecurrenceRuleState((prev) => ({
                            ...prev,
                            endDate: newRecurrenceEndDate,
                            never: false,
                            count: undefined,
                          }));
                        } else {
                          // When date is cleared, also update the state accordingly
                          setRecurrenceRuleState((prev) => ({
                            ...prev,
                            endDate: undefined,
                            never: false,
                            count: undefined,
                          }));
                        }
                      }}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          'aria-label': t('endDate'),
                        },
                      }}
                    />
                  </div>
                )}
                {option === endsAfter && (
                  <>
                    <FormTextField
                      name="recurrenceCount"
                      label=""
                      hideLabel
                      type="number"
                      value={localCount.toString()}
                      onChange={(value) => {
                        // Create synthetic event to match expected interface
                        const syntheticEvent = {
                          target: { value },
                        } as React.ChangeEvent<HTMLInputElement>;
                        onCountChange(syntheticEvent);
                      }}
                      onDoubleClick={(
                        e: React.MouseEvent<HTMLInputElement>,
                      ) => {
                        (e.target as HTMLInputElement).select();
                      }}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
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
                      className={`${styles.recurrenceRuleNumberInput} ms-1 me-2 d-inline-block py-2`}
                      disabled={selectedRecurrenceEndOption !== endsAfter}
                      data-testid="customRecurrenceCountInput"
                      data-cy="customRecurrenceCountInput"
                      aria-label={t('occurrences')}
                      aria-required={selectedRecurrenceEndOption === endsAfter}
                      placeholder="1"
                    />{' '}
                    {t('occurrences')}
                  </>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
