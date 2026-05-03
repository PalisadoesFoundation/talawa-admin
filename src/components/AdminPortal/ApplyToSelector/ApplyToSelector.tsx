import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  InterfaceApplyToSelectorProps,
  ApplyToType,
} from 'types/AdminPortal/ApplyToSelector/interface';

export type { ApplyToType };

/**
 * A radio group selector for choosing action item scope.
 * Allows users to apply an action item to an entire series or a single instance.
 *
 * @param props - Component props from InterfaceApplyToSelectorProps
 * @returns Radio group component for scope selection
 */
const ApplyToSelector: React.FC<InterfaceApplyToSelectorProps> = ({
  applyTo,
  onChange,
}) => {
  const uid = useId();
  const name = `applyTo-${uid}`;
  const seriesId = `${name}-series`; // i18n-ignore-line
  const instanceId = `${name}-instance`; // i18n-ignore-line
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  return (
    <fieldset style={{ marginBottom: '1rem' }}>
      <legend>{t('applyTo')}</legend>
      <div>
        <input
          type="radio"
          name={name}
          id={seriesId}
          checked={applyTo === 'series'}
          onChange={() => onChange('series')}
        />
        <label htmlFor={seriesId} style={{ marginLeft: '0.5rem' }}>
          {t('entireSeries')}
        </label>
      </div>
      <div>
        <input
          type="radio"
          name={name}
          id={instanceId}
          checked={applyTo === 'instance'}
          onChange={() => onChange('instance')}
        />
        <label htmlFor={instanceId} style={{ marginLeft: '0.5rem' }}>
          {t('thisEventOnly')}
        </label>
      </div>
    </fieldset>
  );
};

export default ApplyToSelector;
