/**
 * UserAddressFields Component
 *
 * This component renders a form for capturing user address details. It includes
 * fields for address line 1, address line 2, state, city, country, and postal code.
 * Each field is tied to a `userDetails` object and updates its value via the
 * `handleFieldChange` callback.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {(key: string) => string} props.t - Translation function for localizing labels and placeholders.
 * @param {(field: string, value: string) => void} props.handleFieldChange - Callback to handle changes in form fields.
 * @param {Object} props.userDetails - Object containing user address details.
 * @param {string} props.userDetails.addressLine1 - First line of the user's address.
 * @param {string} props.userDetails.addressLine2 - Second line of the user's address.
 * @param {string} props.userDetails.state - State or region of the user's address.
 * @param {string} props.userDetails.city - City of the user's address.
 * @param {string} props.userDetails.countryCode - Country code of the user's address.
 * @param {string} props.userDetails.postalCode - Postal or ZIP code of the user's address.
 *
 * @returns {JSX.Element} A form with input fields for user address details.
 *
 * @example
 * <UserAddressFields
 *   t={(key) => translations[key]}
 *   handleFieldChange={(field, value) => updateUserDetails(field, value)}
 *   userDetails={{
 *     addressLine1: '',
 *     addressLine2: '',
 *     state: '',
 *     city: '',
 *     countryCode: '',
 *     postalCode: '',
 *   }}
 * />
 */
import React from 'react';
import { countryOptions } from 'utils/formEnumFields';
import { Col, Form, Row } from 'react-bootstrap';
import styles from './common.module.css';

interface InterfaceUserAddressFieldsProps {
  t: (key: string) => string;
  handleFieldChange: (field: string, value: string) => void;
  userDetails: {
    addressLine1: string;
    addressLine2: string;
    state: string;
    countryCode: string;
    city: string;
    postalCode: string;
  };
}

export const UserAddressFields: React.FC<InterfaceUserAddressFieldsProps> = ({
  t,
  handleFieldChange,
  userDetails,
}) => {
  return (
    <Row className="mb-1">
      <Col lg={4}>
        <Form.Label htmlFor="addressLine1" className={styles.cardLabel}>
          {t('addressLine1')}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Eg: lane 123, Main Street"
          id="addressLine1"
          value={userDetails.addressLine1}
          onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
          className={styles.cardControl}
          data-testid="inputAddress1"
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="addressLine2" className={styles.cardLabel}>
          {t('addressLine2')}
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Eg: lane 123, Main Street"
          id="addressLine2"
          value={userDetails.addressLine2}
          onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
          className={styles.cardControl}
          data-testid="inputAddress2"
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
        <Form.Label htmlFor="inputCity" className={styles.cardLabel}>
          {t('city')}
        </Form.Label>
        <Form.Control
          type="text"
          id="inputCity"
          placeholder={t('enterCity')}
          value={userDetails.city}
          onChange={(e) => handleFieldChange('city', e.target.value)}
          className={styles.cardControl}
          data-testid="inputCity"
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="countrySelect" className={styles.cardLabel}>
          {t('country')}
        </Form.Label>
        <Form.Control
          as="select"
          id="countrySelect"
          value={userDetails.countryCode}
          onChange={(e) => handleFieldChange('countryCode', e.target.value)}
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
                value={country.value.toLowerCase()}
                aria-label={`Select ${country.label} as your country`}
              >
                {country.label}
              </option>
            ))}
        </Form.Control>
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="postalCode" className={styles.cardLabel}>
          {t('postalCode')}
        </Form.Label>
        <Form.Control
          type="text"
          id="postalCode"
          placeholder={t('postalCode')}
          pattern="[0-9]{5,10}"
          value={userDetails.postalCode}
          onChange={(e) => handleFieldChange('postalCode', e.target.value)}
          className={styles.cardControl}
          data-testid="postalCode"
        />
      </Col>
    </Row>
  );
};

export default UserAddressFields;
