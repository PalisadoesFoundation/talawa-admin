/**
 * OrganizationModal Component
 *
 * This component renders a modal for creating or editing an organization.
 * It includes a form with fields for organization details such as name,
 * description, address, and an option to upload a display image.
 *
 * @param showModal - Determines whether the modal is visible.
 * @param toggleModal - Function to toggle the visibility of the modal.
 * @param formState - The current state of the form fields.
 * @param setFormState - Function to update the form state.
 * @param createOrg - Function to handle form submission for creating an organization.
 * @param t - Translation function for component-specific strings.
 * @param tCommon - Translation function for common strings.
 *
 * @remarks
 * - The form includes validation for input fields such as name, description, and address.
 * - The `uploadFileToMinio` function is used to handle image uploads to MinIO storage.
 * - Displays success or error messages using `NotificationToast` for image upload feedback.
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
 * />
 * ```
 */
import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { useMinioUpload } from 'utils/MinioUpload';
import type { ChangeEvent } from 'react';
import styles from 'style/app-fixed.module.css';
import { countryOptions } from 'utils/formEnumFields';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
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
    <BaseModal
      show={showModal}
      onHide={toggleModal}
      centered
      dataTestId="modalOrganization"
      title={t('createOrganization')}
      headerClassName={styles.modalHeader}
    >
      <Form onSubmitCapture={createOrg}>
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

        <Form.Label htmlFor="description">{tCommon('description')}</Form.Label>
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
                {tCommon('selectACountry')}
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
              placeholder={tCommon('state')}
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
              placeholder={tCommon('city')}
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
              placeholder={tCommon('postalCode')}
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
              placeholder={tCommon('addressLine1')}
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
              placeholder={tCommon('addressLine2')}
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
                NotificationToast.error(
                  validation.errorMessage || t('invalidFileType'),
                );
                return;
              }

              try {
                const { objectName: avatarobjectName } =
                  await uploadFileToMinio(file, 'organization');
                setFormState({ ...formState, avatar: avatarobjectName });
                NotificationToast.success(t('imageUploadSuccess'));
              } catch {
                NotificationToast.error(t('imageUploadError'));
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
            {tCommon('createOrganization')}
          </Button>
        </Col>
      </Form>
    </BaseModal>
  );
};

export default OrganizationModal;
