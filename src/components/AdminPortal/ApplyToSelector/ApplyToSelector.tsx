import React from 'react';
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
 * @param applyTo - Current selection value ('series' or 'instance')
 * @param onChange - Callback fired when selection changes
 * @returns Radio group component for scope selection
 */
const ApplyToSelector: React.FC<InterfaceApplyToSelectorProps> = ({
  applyTo,
  onChange,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  return (
    <Form.Group className="mb-3">
      <Form.Label>{t('applyTo')}</Form.Label>
      <Form.Check
        type="radio"
        label={t('entireSeries')}
        name="applyTo"
        id="applyToSeries"
        checked={applyTo === 'series'}
        onChange={() => onChange('series')}
      />
      <Form.Check
        type="radio"
        label={t('thisEventOnly')}
        name="applyTo"
        id="applyToInstance"
        checked={applyTo === 'instance'}
        onChange={() => onChange('instance')}
      />
    </Form.Group>
  );
};

export default ApplyToSelector;
