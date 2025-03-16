import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import styles from '../../style/app-fixed.module.css';
import type { InterfaceCurrentUserTypePG } from 'utils/interfaces';
import { countryOptions } from 'utils/formEnumFields';
import { useMinioUpload } from 'utils/MinioUpload';
import { toast } from 'react-toastify';
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
  const { uploadFileToMinio } = useMinioUpload();

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
            onChange={async (e: React.ChangeEvent) => {
              const target = e.target as HTMLInputElement;
              const file = target.files?.[0];

              // Reset form if no file selected
              if (!file) {
                toast.error('Please select a file to upload.');
                return;
              }

              // Validate file size (max 5MB)
              const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
              if (file.size > MAX_FILE_SIZE) {
                toast.error(
                  `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 5MB limit. Please choose a smaller file.`,
                );
                target.value = '';
                return;
              }

              // Validate file type
              const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
              ];
              if (!allowedTypes.includes(file.type)) {
                toast.error(
                  `Invalid file type: ${file.type}. Please select a valid image file (JPEG, PNG, GIF, or WebP).`,
                );
                target.value = '';
                return;
              }

              try {
                // Show loading toast with file name
                toast.info(`Uploading ${file.name}...`);

                // Upload to MinIO and get objectName
                const { objectName } = await uploadFileToMinio(
                  file,
                  'organizations',
                );

                setFormState({
                  ...formState,
                  avatar: objectName,
                });

                // Show success toast with file name
                toast.success(`${file.name} uploaded successfully!`);
              } catch (error) {
                // Show detailed error toast
                const errorMessage =
                  error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Failed to upload ${file.name}. ${errorMessage}`);
                console.error('Error uploading image to MinIO:', error);
                target.value = '';
              }
            }}
            data-testid="organisationImage"
          />
          <Col className={styles.sampleOrgSection}>
            <Button
              className="addButton"
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
