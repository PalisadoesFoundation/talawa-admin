/**
 * OrganizationModal Component
 *
 * This component renders a modal for creating or editing an organization.
 * It includes a form with fields for organization details such as name,
 * description, address, and an option to upload a display image.
 *
 * @component
 * @param {InterfaceOrganizationModalProps} props - The properties passed to the component.
 * @param {boolean} props.showModal - Determines whether the modal is visible.
 * @param {() => void} props.toggleModal - Function to toggle the visibility of the modal.
 * @param {InterfaceFormStateType} props.formState - The current state of the form fields.
 * @param {(state: React.SetStateAction<InterfaceFormStateType>) => void} props.setFormState -
 * Function to update the form state.
 * @param {(e: ChangeEvent<HTMLFormElement>) => Promise<void>} props.createOrg -
 * Function to handle form submission for creating an organization.
 * @param {(key: string) => string} props.t - Translation function for component-specific strings.
 * @param {(key: string) => string} props.tCommon - Translation function for common strings.
 * @param {InterfaceCurrentUserTypePG | undefined} props.userData - Current user data.
 *
 * @remarks
 * - The form includes validation for input fields such as name, description, and address.
 * - The `uploadFileToMinio` function is used to handle image uploads to MinIO storage.
 * - Displays success or error messages using `react-toastify` for image upload feedback.
 *
 * @example
 * ```tsx
 * <OrganizationModal
 *   showModal={true}
 *   toggleModal={handleToggleModal}
 *   formState={formState}
 *   setFormState={setFormState}
 *   createOrg={handleCreateOrg}
 *   t={translate}
 *   tCommon={translateCommon}
 *   userData={currentUser}
 * />
 * ```
 */
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { useMinioUpload } from 'utils/MinioUpload';
import type { ChangeEvent } from 'react';
import styles from 'style/app-fixed.module.css';
import type { InterfaceCurrentUserTypePG } from 'utils/interfaces';
import { countryOptions } from 'utils/formEnumFields';
import { toast } from 'react-toastify';
import { validateFile } from 'utils/fileValidation';

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
                setFormState({ ...formState, name: e.target.value });
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
                setFormState({ ...formState, description: e.target.value });
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
                    setFormState({ ...formState, countryCode: e.target.value });
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
                    setFormState({ ...formState, state: e.target.value });
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
                    setFormState({ ...formState, city: e.target.value });
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
                    setFormState({ ...formState, postalCode: e.target.value });
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

              if (file) {
                const validation = validateFile(file);

                if (!validation.isValid) {
                  toast.error(validation.errorMessage);
                  return;
                }

                try {
                  const { objectName: avatarobjectName } =
                    await uploadFileToMinio(file, 'organization');
                  setFormState({ ...formState, avatar: avatarobjectName });
                  toast.success(t('imageUploadSuccess'));
                } catch (error) {
                  console.error('Error uploading image:', error);
                  toast.error(t('imageUploadError'));
                }
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
