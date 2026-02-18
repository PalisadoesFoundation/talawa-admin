import React, { useMemo } from 'react';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { Frequency, frequencies } from 'utils/recurrenceUtils';
import styles from './RecurrenceFrequencySection.module.css';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';

import { InterfaceRecurrenceFrequencySectionProps } from 'types/shared-components/Recurrence/interface';
/**
 * Frequency and interval selection section
 */
export const RecurrenceFrequencySection: React.FC<
  InterfaceRecurrenceFrequencySectionProps
> = ({ frequency, localInterval, onIntervalChange, onFrequencyChange, t }) => {
  const frequencyOptions = useMemo(() => {
    return Object.values(Frequency).map((freq) => ({
      value: freq,
      label: frequencies[freq],
    }));
  }, []);

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.inlineRow}>
        <span className={styles.label}>{t('repeatsEvery')}</span>
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
          className={styles.recurrenceRuleNumberInput}
          data-testid="customRecurrenceIntervalInput"
          data-cy="customRecurrenceIntervalInput"
          aria-label={t('repeatsEvery')}
          label={t('repeatsEvery')}
          hideLabel
        />
        <DropDownButton
          id="customRecurrenceFrequencyDropdown"
          options={frequencyOptions}
          selectedValue={frequency}
          onSelect={(value) => onFrequencyChange(value as Frequency)}
          variant="outline-secondary"
          dataTestIdPrefix="customRecurrenceFrequencyDropdown"
          ariaLabel={t('frequency')}
          menuClassName={styles.dropdownMenu}
          parentContainerStyle={styles.dropdown}
        />
      </div>
    </div>
  );
};
