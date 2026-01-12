import React from 'react';
import { Form } from 'react-bootstrap';
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
import type {
  InterfaceRecurrenceRule,
  RecurrenceEndOptionType,
} from '../../utils/recurrenceUtils';
import styles from '../../style/app-fixed.module.css';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';

interface InterfaceRecurrenceEndOptionsSectionProps {
  frequency: Frequency;
  selectedRecurrenceEndOption: RecurrenceEndOptionType;
  recurrenceRuleState: InterfaceRecurrenceRule;
  localCount: number | string;
  onRecurrenceEndOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRule>,
  ) => void;
  t: (key: string) => string;
}

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
  const handleCountChange = (value: string) => {
    const syntheticEvent = {
      target: { value },
      currentTarget: { value },
    } as React.ChangeEvent<HTMLInputElement>;
    onCountChange(syntheticEvent);
  };

  return (
    <div className="mb-3">
      <span className="fw-semibold text-secondary">{t('ends')}</span>
      <div className="ms-3 mt-3">
        <Form>
          {recurrenceEndOptions
            .filter(
              (option) =>
                frequency !== Frequency.YEARLY || option !== endsNever,
            )
            .map((option, index) => (
              <div key={index} className="my-2 d-flex align-items-center">
                <Form.Check
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
                  aria-label={t(option)}
                />

                {option === endsOn && (
                  <div className="ms-3">
                    <DatePicker
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
                      type="number"
                      value={localCount}
                      onChange={handleCountChange}
                      onDoubleClick={(e) => {
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
        </Form>
      </div>
    </div>
  );
};
