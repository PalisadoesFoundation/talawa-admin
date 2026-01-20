/**
 * ContactInfoCard Component
 * Renders contact information and address fields
 */

import React from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import profileForm from './profileForm.module.css';
import { countryOptions } from 'utils/formEnumFields';

interface ContactInfoCardProps {
  formState: any;
  emailAddress: string;
  handleFieldChange: (fieldName: string, value: string) => void;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  formState,
  emailAddress,
  handleFieldChange,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'memberDetail' });
  const { t: tCommon } = useTranslation('common');

  return (
    <Card className={`${styles.allRound}`}>
      <Card.Header
        className={`py-3 px-4 ${styles.topRadius} ${profileForm.member_details_style}`}
      >
        <h3 className="m-0">{t('contactInfoHeading')}</h3>
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

          <Col md={12}>
            <label htmlFor="mobilePhoneNumber" className="form-label">
              {t('mobilePhoneNumber')}
            </label>
            <input
              id="mobilePhoneNumber"
              value={formState.mobilePhoneNumber}
              className={`form-control ${styles.inputColor}`}
              type="tel"
              name="mobilePhoneNumber"
              data-testid="inputMobilePhoneNumber"
              onChange={(e) =>
                handleFieldChange('mobilePhoneNumber', e.target.value)
              }
              placeholder={
                tCommon('example', { example: '+1234567890' }) as string
              }
            />
          </Col>

          <Col md={12}>
            <label htmlFor="workPhoneNumber" className="form-label">
              {t('workPhoneNumber')}
            </label>
            <input
              id="workPhoneNumber"
              value={formState.workPhoneNumber}
              className={`form-control ${styles.inputColor}`}
              type="tel"
              data-testid="inputWorkPhoneNumber"
              name="workPhoneNumber"
              onChange={(e) =>
                handleFieldChange('workPhoneNumber', e.target.value)
              }
              placeholder={
                tCommon('example', { example: '+1234567890' }) as string
              }
            />
          </Col>

          <Col md={12}>
            <label htmlFor="homePhoneNumber" className="form-label">
              {t('homePhoneNumber')}
            </label>
            <input
              id="homePhoneNumber"
              value={formState.homePhoneNumber}
              className={`form-control ${styles.inputColor}`}
              type="tel"
              data-testid="inputHomePhoneNumber"
              name="homePhoneNumber"
              onChange={(e) =>
                handleFieldChange('homePhoneNumber', e.target.value)
              }
              placeholder={
                tCommon('example', { example: '+1234567890' }) as string
              }
            />
          </Col>

          <Col md={12}>
            <label htmlFor="addressLine1" className="form-label">
              {t('addressLine1')}
            </label>
            <input
              id="addressLine1"
              value={formState.addressLine1}
              className={`form-control ${styles.inputColor}`}
              type="text"
              name="addressLine1"
              data-testid="addressLine1"
              onChange={(e) =>
                handleFieldChange('addressLine1', e.target.value)
              }
              placeholder={tCommon('example', { example: 'Lane 1' }) as string}
            />
          </Col>

          <Col md={12}>
            <label htmlFor="addressLine2" className="form-label">
              {t('addressLine2')}
            </label>
            <input
              id="addressLine2"
              value={formState.addressLine2}
              className={`form-control ${styles.inputColor}`}
              type="text"
              name="addressLine2"
              data-testid="addressLine2"
              onChange={(e) =>
                handleFieldChange('addressLine2', e.target.value)
              }
              placeholder={tCommon('example', { example: 'Lane 2' }) as string}
            />
          </Col>

          <Col md={12}>
            <label htmlFor="postalCode" className="form-label">
              {t('postalCode')}
            </label>
            <input
              id="postalCode"
              value={formState.postalCode}
              className={`form-control ${styles.inputColor}`}
              type="text"
              name="postalCode"
              data-testid="inputPostalCode"
              onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              placeholder={tCommon('example', { example: '12345' }) as string}
            />
          </Col>

          <Col md={6}>
            <label htmlFor="city" className="form-label">
              {t('city')}
            </label>
            <input
              id="city"
              value={formState.city}
              className={`form-control ${styles.inputColor}`}
              type="text"
              name="city"
              data-testid="inputCity"
              onChange={(e) => handleFieldChange('city', e.target.value)}
              placeholder={tCommon('enterCityName')}
            />
          </Col>

          <Col md={6}>
            <label htmlFor="state" className="form-label">
              {t('state')}
            </label>
            <input
              id="state"
              value={formState.state}
              className={`form-control ${styles.inputColor}`}
              type="text"
              name="state"
              data-testid="inputState"
              onChange={(e) => handleFieldChange('state', e.target.value)}
              placeholder={tCommon('enterStateName')}
            />
          </Col>

          <Col md={12}>
            <Form.Label htmlFor="country" className="form-label">
              {tCommon('country')}
            </Form.Label>
            <Form.Select
              id="country"
              value={formState.countryCode}
              className={`${styles.inputColor}`}
              data-testid="inputCountry"
              onChange={(e) => handleFieldChange('countryCode', e.target.value)}
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
                    aria-label={tCommon('selectAsYourCountry', {
                      country: country.label,
                    })}
                  >
                    {country.label}
                  </option>
                ))}
            </Form.Select>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ContactInfoCard;
