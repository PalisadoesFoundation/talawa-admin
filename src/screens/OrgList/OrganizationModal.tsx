import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';
import type { ChangeEvent } from 'react';
import styles from '../../style/app.module.css';
import type { InterfaceCurrentUserTypePG } from 'utils/interfaces';
import { countryOptions } from 'utils/formEnumFields';

// import useLocalStorage from 'utils/useLocalstorage';

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
  addressLine1: string;
  addressLine2: string;
  avatar: string | null;
  city: string;
  countryCode: string;
  description: string;
  name: string;
  postalCode: string;
  state: string;
}

/**
 * Represents the properties of the OrganizationModal component.
 */
export interface InterfaceOrganizationModalProps {
  showModal: boolean;
  toggleModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  createOrg: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  userData: InterfaceCurrentUserTypePG | undefined;
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
}) => {
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

          <Form.Label htmlFor="description">
            {tCommon('description')}
          </Form.Label>
          <Form.Control
            type="description"
            id="description"
            className={`mb-3 ${styles.inputField}`}
            placeholder={tCommon('description')}
            data-testid="modalOrganizationDescription"
            autoComplete="off"
            required
            value={formState.description}
            onChange={(e): void => {
              const descriptionText = e.target.value;
              if (descriptionText.length < 200) {
                setFormState({
                  ...formState,
                  description: e.target.value,
                });
              }
            }}
          />
          <Form.Label>{tCommon('address')}</Form.Label>
          <Row className="mb-1">
            <Col sm={6} className="mb-1">
              <Form.Control
                required
                as="select"
                data-testid="modalOrganizationCountryCode"
                value={formState.countryCode}
                onChange={(e): void => {
                  const inputText = e.target.value;
                  if (inputText.length < 50) {
                    setFormState({
                      ...formState,
                      countryCode: e.target.value,
                    });
                  }
                }}
                className={`mb-3 ${styles.inputField}`}
              >
                <option value="" disabled>
                  Select a country
                </option>
                {countryOptions.map((country) => (
                  <option
                    key={country.value.toLowerCase()}
                    value={country.value.toLowerCase()}
                  >
                    {country.label}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('state')}
                data-testid="modalOrganizationState"
                autoComplete="off"
                required
                value={formState.state}
                onChange={(e): void => {
                  const inputText = e.target.value;
                  if (inputText.length < 50) {
                    setFormState({
                      ...formState,
                      state: e.target.value,
                    });
                  }
                }}
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('city')}
                data-testid="modalOrganizationCity"
                autoComplete="off"
                required
                value={formState.city}
                onChange={(e): void => {
                  const inputText = e.target.value;
                  if (inputText.length < 50) {
                    setFormState({
                      ...formState,
                      city: e.target.value,
                    });
                  }
                }}
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('postalCode')}
                data-testid="modalOrganizationPostalCode"
                autoComplete="off"
                value={formState.postalCode}
                onChange={(e): void => {
                  const inputText = e.target.value;
                  if (inputText.length < 50) {
                    setFormState({
                      ...formState,
                      postalCode: e.target.value,
                    });
                  }
                }}
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('addressLine1')}
                data-testid="modalOrganizationAddressLine1"
                autoComplete="off"
                required
                value={formState.addressLine1}
                onChange={(e): void => {
                  const inputText = e.target.value;
                  if (inputText.length < 50) {
                    setFormState({
                      ...formState,
                      addressLine1: e.target.value,
                    });
                  }
                }}
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('addressLine2')}
                data-testid="modalOrganizationAddressLine2"
                autoComplete="off"
                value={formState.addressLine2}
                onChange={(e): void => {
                  const inputText = e.target.value;
                  if (inputText.length < 50) {
                    setFormState({
                      ...formState,
                      addressLine2: e.target.value,
                    });
                  }
                }}
                className={`mb-3 ${styles.inputField}`}
              />
            </Col>
          </Row>
          <Row className="mb-1"></Row>
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

              if (file)
                setFormState({
                  ...formState,
                  avatar: (await convertToBase64(file)) || null,
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
          </Col>
        </Modal.Body>
      </Form>
    </Modal>
  );
};

export default OrganizationModal;
