import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { FormCheckField } from 'shared-components/FormFieldGroup/FormCheckField';
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
    <FormFieldGroup label={t('applyTo')} className="mb-3" name={name}>
      <FormCheckField
        type="radio"
        label={t('entireSeries')}
        name={name}
        id={seriesId}
        checked={applyTo === 'series'}
        onChange={() => onChange('series')}
      />
      <FormCheckField
        type="radio"
        label={t('thisEventOnly')}
        name={name}
        id={instanceId}
        checked={applyTo === 'instance'}
        onChange={() => onChange('instance')}
      />
    </FormFieldGroup>
  );
};

export default ApplyToSelector;
