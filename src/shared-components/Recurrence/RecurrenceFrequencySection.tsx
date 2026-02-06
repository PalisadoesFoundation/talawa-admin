import React from 'react';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
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
        onChange={(value: string) =>
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
      <DropDownButton
        id="dropdown-basic"
        options={[
          { value: Frequency.DAILY, label: t('day') },
          { value: Frequency.WEEKLY, label: t('week') },
          { value: Frequency.MONTHLY, label: t('month') },
          { value: Frequency.YEARLY, label: t('year') },
        ]}
        selectedValue={frequency}
        onSelect={(val: string) => onFrequencyChange(val as Frequency)}
        variant="outline-secondary"
        buttonLabel={frequencies[frequency]}
        ariaLabel={t('frequency')}
        dataTestIdPrefix="custom"
        parentContainerStyle="ms-3 d-inline-block"
        btnStyle={styles.dropdown}
      />
    </div>
  );
};
