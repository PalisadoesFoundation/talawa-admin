import React from 'react';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import DropDownButton from 'shared-components/DropDownButton';
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
          e.currentTarget.select();
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
      <div className="ms-3 d-inline-block">
        <DropDownButton
          options={[
            { label: t('day'), value: Frequency.DAILY.toString() },
            { label: t('week'), value: Frequency.WEEKLY.toString() },
            { label: t('month'), value: Frequency.MONTHLY.toString() },
            { label: t('year'), value: Frequency.YEARLY.toString() },
          ]}
          selectedValue={frequency.toString()}
          onSelect={(value) => onFrequencyChange(value as Frequency)}
          ariaLabel={t('frequency')}
          dataTestIdPrefix="customRecurrenceFrequency"
          variant="outline-secondary"
          btnStyle={styles.dropdown}
          buttonLabel={frequencies[frequency]}
        />
      </div>
    </div>
  );
};
