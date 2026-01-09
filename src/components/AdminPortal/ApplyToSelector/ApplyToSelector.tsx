import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export type ApplyToType = 'series' | 'instance';

interface IApplyToSelectorProps {
  applyTo: ApplyToType;
  onChange: (value: ApplyToType) => void;
}

//The Duplicate Radio Button Function
const ApplyToSelector: React.FC<IApplyToSelectorProps> = ({
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
