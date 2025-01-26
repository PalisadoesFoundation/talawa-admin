import React from 'react';
import { countryOptions } from 'utils/formEnumFields';
import { Col, Form, Row } from 'react-bootstrap';
import styles from './common.module.css';

interface InterfaceUserAddressFieldsProps {
  tCommon: (key: string) => string;
  t: (key: string) => string;
  handleFieldChange: (field: string, value: string) => void;
  userDetails: {
    address: string;
    state: string;
    country: string;
  };
}
/**
 * Form component containing address-related input fields for user profile
 * Includes fields for address, city, state, and country
 * @param {Object} props - Component props
 * @param {function} props.tCommon - Translation function for common strings
 * @param {function} props.t - Translation function for component-specific strings
 * @param {function} props.handleFieldChange - Callback for field value changes
 * @param {Object} props.userDetails - User's address information
 * @returns Form group with address input fields
 */
export const UserAddressFields: React.FC<InterfaceUserAddressFieldsProps> = ({
  tCommon,
  t,
  handleFieldChange,
  userDetails,
}) => {
  return (
    <Row className="mb-1">
      <Col lg={4}>
        <Form.Label htmlFor="address" className={styles.cardLabel}>
          {tCommon('address')}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Eg: lane 123, Main Street"
          id="address"
          value={userDetails.address}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          className={styles.cardControl}
          data-testid="inputAddress"
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="inputState" className={styles.cardLabel}>
          {t('state')}
        </Form.Label>
        <Form.Control
          type="text"
          id="inputState"
          placeholder={t('enterState')}
          value={userDetails.state}
          onChange={(e) => handleFieldChange('state', e.target.value)}
          className={styles.cardControl}
          data-testid="inputState"
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="country" className={styles.cardLabel}>
          {t('country')}
        </Form.Label>
        <Form.Control
          as="select"
          id="country"
          value={userDetails.country}
          onChange={(e) => handleFieldChange('country', e.target.value)}
          className={styles.cardControl}
          data-testid="inputCountry"
        >
          <option value="" disabled>
            {t('selectCountry')}
          </option>
          {[...countryOptions]
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((country) => (
              <option
                key={country.value.toUpperCase()}
                value={country.value.toUpperCase()}
                aria-label={`Select ${country.label} as your country`}
              >
                {country.label}
              </option>
            ))}
        </Form.Control>
      </Col>
    </Row>
  );
};

export default UserAddressFields;
