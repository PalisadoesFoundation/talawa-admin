import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';
import type { ChangeEvent } from 'react';
import styles from '../../style/app.module.css';
import type { InterfaceAddress } from 'utils/interfaces';
import { countryOptions } from 'utils/formEnumFields';
import useLocalStorage from 'utils/useLocalstorage';

/**
 * Represents the state of the form in the organization modal.
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.modalHeader`
 * - `.inputField`
 * - `.switch`
 * - `.addButton`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
interface InterfaceFormStateType {
  name: string;
  descrip: string;
  userRegistrationRequired: boolean;
  visible: boolean;
  address: InterfaceAddress;
  image: string;
}

/**
 * Represents a user type.
 */
interface InterfaceUserType {
  user: {
    firstName: string;
    lastName: string;
    image: string | null;
    email: string;
  };

  // Add more properties if needed
}

/**
 * Represents the properties of the OrganizationModal component.
 */
interface InterfaceOrganizationModalProps {
  showModal: boolean;
  toggleModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  createOrg: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  userData: InterfaceUserType | undefined;
  triggerCreateSampleOrg: () => void;
}

/**
 * Represents the organization modal component.
 */

const OrganizationModal: React.FC<InterfaceOrganizationModalProps> = ({
  showModal,
  toggleModal,
  formState,
  setFormState,
  createOrg,
  t,
  tCommon,
  triggerCreateSampleOrg,
}) => {
  // function to update the state of the parameters inside address.
  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');

  const handleInputChange = (fieldName: string, value: string): void => {
    setFormState((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [fieldName]: value,
      },
    }));
  };
  return (
    <Modal
      show={showModal}
      onHide={toggleModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        className={styles.modalHeader}
        closeButton
        data-testid="modalOrganizationHeader"
      >
        <Modal.Title className="text-white">
          {t('createOrganization')}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmitCapture={createOrg}>
        <Modal.Body>
          <Form.Label htmlFor="orgname">{tCommon('name')}</Form.Label>
          <Form.Control
            type="name"
            id="orgname"
            className={`mb-3 ${styles.inputField}`}
            placeholder={t('enterName')}
            data-testid="modalOrganizationName"
            autoComplete="off"
            required
            value={formState.name}
            onChange={(e): void => {
              const inputText = e.target.value;
              if (inputText.length < 50) {
                setFormState({
                  ...formState,
                  name: e.target.value,
                });
              }
            }}
          />
          <Form.Label htmlFor="descrip">{tCommon('description')}</Form.Label>
          <Form.Control
            type="descrip"
            id="descrip"
            className={`mb-3 ${styles.inputField}`}
            placeholder={tCommon('description')}
            autoComplete="off"
            required
            value={formState.descrip}
            onChange={(e): void => {
              const descriptionText = e.target.value;
              if (descriptionText.length < 200) {
                setFormState({
                  ...formState,
                  descrip: e.target.value,
                });
              }
            }}
          />
          <Form.Label>{tCommon('address')}</Form.Label>
          <Row className="mb-1">
            <Col sm={6} className="mb-3">
              <Form.Control
                required
                as="select"
                data-testid="countrycode"
                value={formState.address.countryCode}
                onChange={(e) => {
                  const countryCode = e.target.value;
                  handleInputChange('countryCode', countryCode);
                }}
                className={`mb-3 ${styles.inputField}`}
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countryOptions.map((country) => (
                  <option
                    key={country.value.toUpperCase()}
                    value={country.value.toUpperCase()}
                  >
                    {country.label}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Control
                placeholder={t('city')}
                autoComplete="off"
                required
                value={formState.address.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={6} className="mb-3">
              <Form.Control
                placeholder={t('state')}
                autoComplete="off"
                value={formState.address.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Control
                placeholder={t('dependentLocality')}
                autoComplete="off"
                value={formState.address.dependentLocality}
                onChange={(e) =>
                  handleInputChange('dependentLocality', e.target.value)
                }
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('line1')}
                autoComplete="off"
                required
                value={formState.address.line1}
                onChange={(e) => handleInputChange('line1', e.target.value)}
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('line2')}
                autoComplete="off"
                value={formState.address.line2}
                onChange={(e) => handleInputChange('line2', e.target.value)}
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('postalCode')}
                autoComplete="off"
                value={formState.address.postalCode}
                onChange={(e) =>
                  handleInputChange('postalCode', e.target.value)
                }
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('sortingCode')}
                autoComplete="off"
                value={formState.address.sortingCode}
                onChange={(e) =>
                  handleInputChange('sortingCode', e.target.value)
                }
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label htmlFor="userRegistrationRequired">
                {t('userRegistrationRequired')}
              </Form.Label>
              <Form.Switch
                id="userRegistrationRequired"
                data-testid="userRegistrationRequired"
                type="checkbox"
                defaultChecked={formState.userRegistrationRequired}
                onChange={(): void =>
                  setFormState({
                    ...formState,
                    userRegistrationRequired:
                      !formState.userRegistrationRequired,
                  })
                }
                className={styles.switch}
              />
            </Col>
            <Col>
              <Form.Label htmlFor="visibleInSearch">
                {t('visibleInSearch')}
              </Form.Label>
              <Form.Switch
                id="visibleInSearch"
                data-testid="visibleInSearch"
                type="checkbox"
                defaultChecked={formState.visible}
                onChange={(): void =>
                  setFormState({
                    ...formState,
                    visible: !formState.visible,
                  })
                }
                className={styles.switch}
              />
            </Col>
          </Row>
          <Form.Label htmlFor="orgphoto">{tCommon('displayImage')}</Form.Label>
          <Form.Control
            accept="image/*"
            id="orgphoto"
            className={`mb-3 ${styles.inputField}`}
            name="photo"
            type="file"
            multiple={false}
            onChange={async (e: React.ChangeEvent): Promise<void> => {
              const target = e.target as HTMLInputElement;
              const file = target.files && target.files[0];
              /* istanbul ignore else */
              if (file)
                setFormState({
                  ...formState,
                  image: await convertToBase64(file),
                });
            }}
            data-testid="organisationImage"
          />
          <Col className={styles.sampleOrgSection}>
            <Button
              className={styles.addButton}
              type="submit"
              value="invite"
              data-testid="submitOrganizationForm"
            >
              {t('createOrganization')}
            </Button>

            <div className="position-relative">
              <hr />
              <span className={styles.orText}>{tCommon('OR')}</span>
            </div>
            {((adminFor && adminFor.length > 0) || superAdmin) && (
              <div className={styles.sampleOrgSection}>
                <Button
                  className={styles.addButton}
                  onClick={() => triggerCreateSampleOrg()}
                  data-testid="createSampleOrganizationBtn"
                >
                  {t('createSampleOrganization')}
                </Button>
              </div>
            )}
          </Col>
        </Modal.Body>
      </Form>
    </Modal>
  );
};

export default OrganizationModal;
