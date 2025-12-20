/**
 * UserDetailsForm component provides a form interface for updating user details.
 *
 * @remarks
 * This component is designed to handle user profile updates, including personal
 * information, contact details, and address. It supports localization through
 * translation functions and ensures proper input handling with validation and
 * sanitization where necessary.
 *
 * @param props - The properties required by the component.
 * @param props.userDetails - The current user details to populate the form fields.
 * @param props.handleFieldChange - Callback function to handle changes in form fields.
 * @param props.isUpdated - A flag indicating if the user details have been modified.
 * @param props.handleResetChanges - Function to reset any unsaved changes in the form.
 * @param props.handleUpdateUserDetails - Function to save the updated user details.
 * @param props.t - Translation function for localized strings specific to the form.
 * @param props.tCommon - Translation function for common localized strings.
 *
 * @component
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
 * @dependencies
 * - React
 * - react-bootstrap for UI components
 * - @mui/x-date-pickers for date selection
 * - dayjs for date manipulation
 * - sanitize-html for sanitizing user input
 *
 * @returns A React functional component rendering the user details form.
 */
import React, { useState } from 'react';
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Check, Clear } from '@mui/icons-material';

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

type PasswordValidation = {
  lowercaseChar: boolean;
  uppercaseChar: boolean;
  numericValue: boolean;
  specialChar: boolean;
};

const PASSWORD_VALIDATION_PATTERNS  = {
  lowercaseCharRegExp: new RegExp('[a-z]'),
  uppercaseCharRegExp: new RegExp('[A-Z]'),
  numericalValueRegExp: new RegExp('\\d'),
  specialCharRegExp: new RegExp('[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-]'),
};

const UserDetailsForm: React.FC<InterfaceUserDetailsFormProps> = ({
  userDetails,
  handleFieldChange,
  isUpdated,
  handleResetChanges,
  handleUpdateUserDetails,
  t,
  tCommon,
}) => {

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [pass, setPass] = useState<string>('');
  const [showAlert, setShowAlert] = useState<PasswordValidation>({
    lowercaseChar: true,
    uppercaseChar: true,
    numericValue: true,
    specialChar: true,
  });

  const togglePassword = (): void => setShowPassword(!showPassword);

  const handlePasswordCheck = (pass: string): void => {
    setShowAlert({
      lowercaseChar: !PASSWORD_VALIDATION_PATTERNS.lowercaseCharRegExp.test(pass),
      uppercaseChar: !PASSWORD_VALIDATION_PATTERNS.uppercaseCharRegExp.test(pass),
      numericValue: !PASSWORD_VALIDATION_PATTERNS.numericalValueRegExp.test(pass),
      specialChar: !PASSWORD_VALIDATION_PATTERNS.specialCharRegExp.test(pass)
    });
  };

  return (
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
        <Col lg={12}>
          <Row className="w-100 gx-4">
            <Col lg={5}>
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
            <Col lg={7}>
              <div>
                <Form.Label
                  htmlFor="inputPassword"
                  className={styles.cardLabel}
                >
                  {tCommon('password')}
                </Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    id="inputPassword"
                    data-testid="inputPassword"
                    placeholder={t('enterNewPassword')}
                    value={userDetails.password}
                    onChange={(e): void => {
                      handlePasswordCheck(e.target.value);
                      handleFieldChange('password', e.target.value);
                      setPass(e.target.value);
                    }}
                    className={styles.cardControl}
                    onFocus={(): void => setIsInputFocused(true)}
                    onBlur={(): void => setIsInputFocused(false)}
                  />
                  <Button
                    onClick={togglePassword}
                    data-testid="showPassword"
                    className="h-100"
                  >
                    {showPassword ? (
                      <i className="fas fa-eye"></i>
                    ) : (
                      <i className="fas fa-eye-slash"></i>
                    )}
                  </Button>
                </div>
              </div>
              <div>
                {isInputFocused && (
                  <div>
                    <p
                      className={`form-text ${
                        pass.length >= 0 && pass.length < 8
                          ? 'text-danger'
                          : 'text-success'
                      }`}
                    >
                      {pass.length >= 0 && pass.length < 8 ? (
                        <span>
                          <Clear aria-label={t('validationFailed')} />
                        </span>
                      ) : (
                        <span>
                          <Check aria-label={t('validationPassed')} />
                        </span>
                      )}
                      {t('atleast_8_char_long')}
                    </p>
                    <p
                      className={`form-text ${
                        showAlert.lowercaseChar ? 'text-danger' : 'text-success'
                      }`}
                    >
                      {showAlert.lowercaseChar ? (
                        <span>
                          <Clear aria-label={t('validationFailed')} />
                        </span>
                      ) : (
                        <span>
                          <Check aria-label={t('validationPassed')} />
                        </span>
                      )}
                      {t('lowercase_check')}
                    </p>
                    <p
                      className={`form-text ${
                        showAlert.uppercaseChar ? 'text-danger' : 'text-success'
                      }`}
                    >
                      {showAlert.uppercaseChar ? (
                        <span>
                          <Clear aria-label={t('validationFailed')} />
                        </span>
                      ) : (
                        <span>
                          <Check aria-label={t('validationPassed')} />
                        </span>
                      )}
                      {t('uppercase_check')}
                    </p>
                    <p
                      className={`form-text ${
                        showAlert.numericValue ? 'text-danger' : 'text-success'
                      }`}
                    >
                      {showAlert.numericValue ? (
                        <span>
                          <Clear aria-label={t('validationFailed')} />
                        </span>
                      ) : (
                        <span>
                          <Check aria-label={t('validationPassed')} />
                        </span>
                      )}
                      {t('numeric_value_check')}
                    </p>
                    <p
                      className={`form-text ${
                        showAlert.specialChar ? 'text-danger' : 'text-success'
                      }`}
                    >
                      {showAlert.specialChar ? (
                        <span>
                          <Clear aria-label={t('validationFailed')} />
                        </span>
                      ) : (
                        <span>
                          <Check aria-label={t('validationPassed')} />
                        </span>
                      )}
                      {t('special_char_check')}
                    </p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
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
            onChange={(e) =>
              handleFieldChange('homePhoneNumber', e.target.value)
            }
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
            onChange={(e) =>
              handleFieldChange('workPhoneNumber', e.target.value)
            }
            className={styles.cardControl}
            data-testid="inputWorkPhoneNumber"
          />
        </Col>
        <Col lg={4}>
          <Form.Label htmlFor="birthDate" className={styles.cardLabel}>
            {t('birthDate')}
          </Form.Label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="YYYY-MM-DD"
              value={
                userDetails.birthDate ? dayjs(userDetails.birthDate) : null
              }
              onChange={(date) =>
                handleFieldChange(
                  'birthDate',
                  date ? date.format('YYYY-MM-DD') : '',
                )
              }
              className={`${styles.cardLabel} w-100`}
              maxDate={dayjs().startOf('day')}
              slotProps={{
                textField: {
                  inputProps: {
                    'data-testid': 'birth-date-input',
                    'aria-label': t('birthDate'),
                    max: dayjs().format('YYYY-MM-DD'),
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Col>
        <Col lg={4}>
          <Form.Label htmlFor="grade" className={styles.cardLabel}>
            {t('grade')}
          </Form.Label>
          <Form.Control
            as="select"
            id="grade"
            value={userDetails.educationGrade}
            onChange={(e) =>
              handleFieldChange('educationGrade', e.target.value)
            }
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
};

export default UserDetailsForm;
