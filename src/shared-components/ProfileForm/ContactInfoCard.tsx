import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { countryOptions } from 'utils/formEnumFields';
import { IContactInfoCardProps } from '../../types/shared-components/ProfileForm/interface';
import styles from './ContactInfoCard.module.css';

/**
 * Renders the contact information section of the profile form.
 * Includes fields for email, phone numbers, and address details.
 *
 * @param props - The component props
 * @param props.formState - Current state of the form fields
 * @param props.email - The user's email address (read-only)
 * @param props.t - Translation function for member details
 * @param props.tCommon - Translation function for common terms
 * @param props.handleFieldChange - Handler for input changes
 * @returns The rendered ContactInfoCard component
 */
const ContactInfoCard: React.FC<IContactInfoCardProps> = ({
  formState,
  email,
  t,
  tCommon,
  handleFieldChange,
}) => {
  return (
    <Card className={styles.allRound}>
      <Card.Header
        className={`py-3 px-4 ${styles.topRadius} ${styles.member_details_style}`}
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
              value={email}
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
              placeholder={
                tCommon('example', {
                  example: '12345',
                }) as string
              }
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
            <label htmlFor="country" className="form-label">
              {tCommon('country')}
            </label>
            <select
              id="country"
              value={formState.countryCode}
              className={`form-select ${styles.inputColor}`}
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
            </select>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ContactInfoCard;