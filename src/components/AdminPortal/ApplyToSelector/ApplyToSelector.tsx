import React, { useId } from 'react';
import { Form } from 'react-bootstrap';
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
    <Form.Group className="mb-3" as="fieldset">
      <Form.Label as="legend">{t('applyTo')}</Form.Label>
      <Form.Check
        type="radio"
        label={t('entireSeries')}
        name={name}
        id={seriesId}
        checked={applyTo === 'series'}
        onChange={() => onChange('series')}
      />
      <Form.Check
        type="radio"
        label={t('thisEventOnly')}
        name={name}
        id={instanceId}
        checked={applyTo === 'instance'}
        onChange={() => onChange('instance')}
      />
    </Form.Group>
  );
};

export default ApplyToSelector;
