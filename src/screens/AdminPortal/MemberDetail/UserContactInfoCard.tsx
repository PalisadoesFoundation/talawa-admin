import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { countryOptions } from 'utils/formEnumFields';
import { phoneFieldConfigs, addressFieldConfigs } from './fieldConfigs';
import styles from './UserContactDetails.module.css';
import type { UserContactFormState } from './UserContactDetails';

interface UserContactInfoCardProps {
  formState: UserContactFormState;
  onFieldChange: (fieldName: string, value: string) => void;
  emailAddress: string;
}

export const UserContactInfoCard: React.FC<UserContactInfoCardProps> = ({
  formState,
  onFieldChange,
  emailAddress,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const { t: tCommon } = useTranslation('common');

  return (
    <Card className={styles.allRound}>
      <Card.Header className={`py-3 px-4 ${styles.topRadius}`}>
        <h3 className="m-0 font-black">{t('contactInfoHeading')}</h3>
      </Card.Header>
      <Card.Body className="py-3 px-3">
        <Row className="g-3">
          <Col md={12}>
            <label htmlFor="email" className="form-label">
              {tCommon('email')}
            </label>
            <input
              id="email"
              value={emailAddress}
              className={`form-control ${styles.inputColor}`}
              type="email"
              name="email"
              data-testid="inputEmail"
              disabled
              placeholder={tCommon('email')}
            />
          </Col>

          {phoneFieldConfigs.map((field) => (
            <Col md={12} key={field.id}>
              <label htmlFor={field.id} className="form-label">
                {t(field.key)}
              </label>
              <input
                id={field.id}
                value={
                  (formState[field.key as keyof typeof formState] as string) ||
                  ''
                }
                className={`form-control ${styles.inputColor}`}
                type="tel"
                data-testid={field.testId}
                name={field.id}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                placeholder={tCommon('memberDetailNumberExample')}
              />
            </Col>
          ))}

          {addressFieldConfigs.map((field) => (
            <Col md={field.colSize} key={field.id}>
              <label htmlFor={field.id} className="form-label">
                {t(field.key)}
              </label>
              <input
                id={field.id}
                value={
                  (formState[field.key as keyof typeof formState] as string) ||
                  ''
                }
                className={`form-control ${styles.inputColor}`}
                type="text"
                name={field.id}
                data-testid={field.testId}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                placeholder={
                  field.key === 'postalCode'
                    ? tCommon('postalCode')
                    : field.key.includes('city')
                      ? tCommon('enterCity')
                      : tCommon('memberDetailExampleLane')
                }
              />
            </Col>
          ))}

          <Col md={12}>
            <FormFieldGroup name="country" label={tCommon('country')}>
              <select
                id="country"
                className={`form-control ${styles.inputColor}`}
                value={formState.countryCode}
                data-testid="inputCountry"
                onChange={(e) => onFieldChange('countryCode', e.target.value)}
              >
                <option value="" disabled>
                  {tCommon('select')} {tCommon('country')}
                </option>

                {[...countryOptions]
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((country) => (
                    <option
                      key={country.value.toUpperCase()}
                      value={country.value.toLowerCase()}
                    >
                      {String(country.label)}
                    </option>
                  ))}
              </select>
            </FormFieldGroup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
