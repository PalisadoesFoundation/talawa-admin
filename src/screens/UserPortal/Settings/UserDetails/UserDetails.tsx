/**
 * // translation-check-keyPrefix: settings
 * UserDetailsForm component provides a form interface for updating user details.
 *
 * @remarks
 * This component is designed to handle user profile updates, including personal
 * information, contact details, and address. It supports localization through
 * translation functions and ensures proper input handling with validation and
 * sanitization where necessary.
 *
 * @param props - The properties required by the component.
 *
 * @example
 * ```tsx
 * <UserDetailsForm
 *   userDetails={userDetails}
 *   handleFieldChange={handleFieldChange}
 *   isUpdated={isUpdated}
 *   handleResetChanges={handleResetChanges}
 *   handleUpdateUserDetails={handleUpdateUserDetails}
 *   t={t}
 *   tCommon={tCommon}
 * />
 * ```
 *
 * @returns A React functional component rendering the user details form.
 */
import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import dayjs from 'dayjs';
import {
  educationGradeEnum,
  employmentStatusEnum,
  genderEnum,
  maritalStatusEnum,
} from 'utils/formEnumFields';
import UserAddressFields from 'components/UserPortal/UserProfile/UserAddressFields';
import sanitizeHtml from 'sanitize-html';
import SyncIcon from '@mui/icons-material/Sync';
import SaveIcon from '@mui/icons-material/Save';
import DatePicker from 'shared-components/DatePicker';

interface InterfaceUserDetailsFormProps {
  userDetails: {
    name: string;
    natalSex: string;
    password: string;
    emailAddress: string;
    mobilePhoneNumber: string;
    homePhoneNumber: string;
    workPhoneNumber: string;
    birthDate: string | null;
    educationGrade: string;
    employmentStatus: string;
    maritalStatus: string;
    description: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    countryCode: string;
    city: string;
    postalCode: string;
  };
  handleFieldChange: (fieldName: string, value: string) => void;
  isUpdated: boolean;
  handleResetChanges: () => void;
  handleUpdateUserDetails: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

const UserDetailsForm: React.FC<InterfaceUserDetailsFormProps> = ({
  userDetails,
  handleFieldChange,
  isUpdated,
  handleResetChanges,
  handleUpdateUserDetails,
  t,
  tCommon,
}) => (
  <Form>
    <Row className="mb-1">
      <Col lg={12}>
        <Form.Label htmlFor="inputName" className={styles.cardLabel}>
          {tCommon('name')}
        </Form.Label>
        <Form.Control
          type="text"
          id="inputName"
          value={userDetails.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className={styles.cardControl}
          data-testid="inputName"
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="gender" className={styles.cardLabel}>
          {t('gender')}
        </Form.Label>
        <Form.Control
          as="select"
          id="gender"
          value={userDetails.natalSex}
          onChange={(e) => handleFieldChange('natalSex', e.target.value)}
          className={styles.cardControl}
          data-testid="inputGender"
        >
          <option value="" disabled>
            {t('sgender')}
          </option>
          {genderEnum.map((g) => (
            <option key={g.value.toLowerCase()} value={g.value}>
              {g.label}
            </option>
          ))}
        </Form.Control>
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="inputPassword" className={styles.cardLabel}>
          {tCommon('password')}
        </Form.Label>
        <Form.Control
          type="password"
          id="inputPassword"
          data-testid="inputPassword"
          placeholder={tCommon('enterPassword')}
          onChange={(e) => handleFieldChange('password', e.target.value)}
          className={styles.cardControl}
        />
      </Col>
    </Row>
    <Row className="mb-1">
      <Col lg={4}>
        <Form.Label htmlFor="inputEmail" className={styles.cardLabel}>
          {tCommon('emailAddress')}
        </Form.Label>
        <Form.Control
          type="email"
          id="inputEmail"
          data-testid="inputEmail"
          value={userDetails.emailAddress}
          className={styles.cardControl}
          disabled
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="phoneNo" className={styles.cardLabel}>
          {t('phoneNumber')}
        </Form.Label>
        <Form.Control
          type="tel"
          id="phoneNo"
          placeholder={t('enterPhoneNo')}
          value={userDetails.mobilePhoneNumber}
          onChange={(e) =>
            handleFieldChange('mobilePhoneNumber', e.target.value)
          }
          className={styles.cardControl}
          data-testid="inputPhoneNumber"
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="homePhoneNo" className={styles.cardLabel}>
          {t('homePhoneNumber')}
        </Form.Label>
        <Form.Control
          type="tel"
          id="homePhoneNo"
          placeholder={t('enterPhoneNo')}
          value={userDetails.homePhoneNumber}
          onChange={(e) => handleFieldChange('homePhoneNumber', e.target.value)}
          className={styles.cardControl}
          data-testid="inputHomePhoneNumber"
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="workPhoneNo" className={styles.cardLabel}>
          {t('workPhoneNumber')}
        </Form.Label>
        <Form.Control
          type="tel"
          id="workPhoneNo"
          placeholder={t('enterPhoneNo')}
          value={userDetails.workPhoneNumber}
          onChange={(e) => handleFieldChange('workPhoneNumber', e.target.value)}
          className={styles.cardControl}
          data-testid="inputWorkPhoneNumber"
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="birthDate" className={styles.cardLabel}>
          {t('birthDate')}
        </Form.Label>
        <DatePicker
          format="YYYY-MM-DD"
          value={userDetails.birthDate ? dayjs(userDetails.birthDate) : null}
          onChange={(date) =>
            handleFieldChange(
              'birthDate',
              date ? date.format('YYYY-MM-DD') : '',
            )
          }
          className="w-100"
          maxDate={dayjs().startOf('day')}
          data-testid="birth-date-input"
          slotProps={{
            textField: {
              'aria-label': t('birthDate'),
            },
          }}
        />
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="grade" className={styles.cardLabel}>
          {t('grade')}
        </Form.Label>
        <Form.Control
          as="select"
          id="grade"
          value={userDetails.educationGrade}
          onChange={(e) => handleFieldChange('educationGrade', e.target.value)}
          className={styles.cardControl}
          data-testid="inputGrade"
        >
          <option value="" disabled>
            {t('gradePlaceholder')}
          </option>
          {educationGradeEnum.map((grade) => (
            <option key={grade.value.toLowerCase()} value={grade.value}>
              {grade.label}
            </option>
          ))}
        </Form.Control>
      </Col>
    </Row>
    <Row className="mb-1">
      <Col lg={4}>
        <Form.Label htmlFor="empStatus" className={styles.cardLabel}>
          {t('empStatus')}
        </Form.Label>
        <Form.Control
          as="select"
          id="empStatus"
          value={userDetails.employmentStatus}
          onChange={(e) =>
            handleFieldChange('employmentStatus', e.target.value)
          }
          className={styles.cardControl}
          data-testid="inputEmpStatus"
        >
          <option value="" disabled>
            {t('sEmpStatus')}
          </option>
          {employmentStatusEnum.map((status) => (
            <option key={status.value.toLowerCase()} value={status.value}>
              {status.label}
            </option>
          ))}
        </Form.Control>
      </Col>
      <Col lg={4}>
        <Form.Label htmlFor="maritalStatus" className={styles.cardLabel}>
          {t('maritalStatus')}
        </Form.Label>
        <Form.Control
          as="select"
          id="maritalStatus"
          value={userDetails.maritalStatus}
          onChange={(e) => handleFieldChange('maritalStatus', e.target.value)}
          className={styles.cardControl}
          data-testid="inputMaritalStatus"
        >
          <option value="" disabled>
            {t('sMaritalStatus')}
          </option>
          {maritalStatusEnum.map((status) => (
            <option key={status.value.toLowerCase()} value={status.value}>
              {status.label}
            </option>
          ))}
        </Form.Control>
      </Col>
    </Row>
    <br />
    <h5>{tCommon('address')} :-</h5>
    <UserAddressFields
      t={t}
      handleFieldChange={handleFieldChange}
      userDetails={userDetails}
    />
    <Row className="mb-1">
      <Col lg={12}>
        <Form.Label htmlFor="description" className={styles.cardLabel}>
          {t('description')}
        </Form.Label>
        <Form.Control
          as="textarea"
          id="description"
          placeholder={t('enterDescription')}
          value={sanitizeHtml(userDetails.description)}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          className={styles.cardControl}
          rows={3}
          data-testid="inputDescription"
        />
      </Col>
    </Row>
    {isUpdated && (
      <div className="d-flex justify-content-between mt-4">
        <Button
          onClick={handleResetChanges}
          className={styles.resetChangesBtn}
          data-testid="resetChangesBtn"
        >
          <SyncIcon className={styles.syncIconStyle} />
          {tCommon('resetChanges')}
        </Button>

        <Button
          className={styles.saveChangesBtn}
          value="savechanges"
          data-testid="updateUserBtn"
          onClick={handleUpdateUserDetails}
        >
          <SaveIcon className="me-1" />
          {tCommon('saveChanges')}
        </Button>
      </div>
    )}
  </Form>
);

export default UserDetailsForm;
