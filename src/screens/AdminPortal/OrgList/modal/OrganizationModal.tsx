/**
 * OrganizationModal component.
 *
 * This component renders a modal for creating or editing an organization.
 * It includes a form with fields for organization details such as name,
 * description, address, and an option to upload a display image.
 *
 * @param props - Component props for the modal. See {@link InterfaceOrganizationModalProps}.
 *
 * @remarks
 * Props:
 * - showModal: Determines whether the modal is visible.
 * - toggleModal: Function to toggle the visibility of the modal.
 * - formState: The current state of the form fields.
 * - setFormState: Function to update the form state.
 * - createOrg: Function to handle form submission for creating an organization.
 * - t: Translation function for component-specific strings.
 * - tCommon: Translation function for common strings.
 * - userData: Current user data, if available.
 *
 * - The form includes validation for input fields such as name, description, and address.
 * - The `uploadFileToMinio` function is used to handle image uploads to MinIO storage.
 * - Displays success or error messages using `NotificationToast` for image upload feedback.
 *
 * @example
 * ```tsx
 * <OrganizationModal
 * showModal={true}
 * toggleModal={handleToggleModal}
 * formState={formState}
 * setFormState={setFormState}
 * createOrg={handleCreateOrg}
 * t={translate}
 * tCommon={translateCommon}
 * userData={currentUser}
 * />
 * ```
 *
 * @returns The rendered organization modal.
 */
import React, { type ChangeEvent } from 'react';
import Button from 'shared-components/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { useMinioUpload } from 'utils/MinioUpload';
import { countryOptions } from 'utils/formEnumFields';
import styles from './OrganizationModal.module.css';

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
      title={t('createOrganization')}
      headerClassName={styles.modalHeader}
      dataTestId="modalOrganizationHeader"
    >
      <Form onSubmitCapture={createOrg}>
        <FormTextField
          name="orgname"
          label={tCommon('name')}
          placeholder={t('enterName')}
          value={formState.name}
          onChange={(val) => {
            if (val.length <= 50) {
              setFormState({ ...formState, name: val });
            }
          }}
          required
          data-testid="modalOrganizationName"
          autoComplete="off"
        />

        <FormTextField
          name="description"
          label={tCommon('description')}
          placeholder={tCommon('description')}
          value={formState.description}
          onChange={(val) => {
            if (val.length <= 200) {
              setFormState({ ...formState, description: val });
            }
          }}
          required
          data-testid="modalOrganizationDescription"
          autoComplete="off"
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
                if (inputText.length <= 50) {
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
            <FormTextField
              name="state"
              label={tCommon('state')}
              placeholder={tCommon('state')}
              value={formState.state}
              onChange={(val) => {
                if (val.length <= 50) {
                  setFormState({ ...formState, state: val });
                }
              }}
              required
              data-testid="modalOrganizationState"
              autoComplete="off"
            />
          </Col>
        </Row>
        <Row className="mb-1">
          <Col sm={6} className="mb-1">
            <FormTextField
              name="city"
              label={tCommon('city')}
              placeholder={tCommon('city')}
              value={formState.city}
              onChange={(val) => {
                if (val.length <= 50) {
                  setFormState({ ...formState, city: val });
                }
              }}
              required
              data-testid="modalOrganizationCity"
              autoComplete="off"
            />
          </Col>
          <Col sm={6} className="mb-1">
            <FormTextField
              name="postalCode"
              label={tCommon('postalCode')}
              placeholder={tCommon('postalCode')}
              value={formState.postalCode}
              onChange={(val) => {
                if (val.length <= 50) {
                  setFormState({ ...formState, postalCode: val });
                }
              }}
              data-testid="modalOrganizationPostalCode"
              autoComplete="off"
            />
          </Col>
        </Row>
        <Row className="mb-1">
          <Col sm={6} className="mb-1">
            <FormTextField
              name="addressLine1"
              label={tCommon('addressLine1')}
              placeholder={tCommon('addressLine1')}
              value={formState.addressLine1}
              onChange={(val) => {
                if (val.length <= 50) {
                  setFormState({ ...formState, addressLine1: val });
                }
              }}
              required
              data-testid="modalOrganizationAddressLine1"
              autoComplete="off"
            />
          </Col>
          <Col sm={6} className="mb-1">
            <FormTextField
              name="addressLine2"
              label={tCommon('addressLine2')}
              placeholder={tCommon('addressLine2')}
              value={formState.addressLine2}
              onChange={(val) => {
                if (val.length <= 50) {
                  setFormState({ ...formState, addressLine2: val });
                }
              }}
              data-testid="modalOrganizationAddressLine2"
              autoComplete="off"
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
              // Check file size (5MB limit)
              const maxSize = 5 * 1024 * 1024;
              if (file.size > maxSize) {
                NotificationToast.error(tCommon('fileTooLarge'));
                return;
              }

              // Check file type
              const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
              if (!allowedTypes.includes(file.type)) {
                NotificationToast.error(tCommon('invalidFileType'));
                return;
              }

              try {
                const { objectName: avatarobjectName } =
                  await uploadFileToMinio(file, 'organization');
                setFormState({ ...formState, avatar: avatarobjectName });
                NotificationToast.success(tCommon('imageUploadSuccess'));
              } catch (error) {
                console.error('Error uploading image:', error);
                NotificationToast.error(tCommon('imageUploadError'));
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
