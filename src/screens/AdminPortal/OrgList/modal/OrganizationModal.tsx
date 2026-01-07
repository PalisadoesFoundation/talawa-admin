/**
 * OrganizationModal Component
 *
 * This component renders a modal for creating an organization.
 * It includes a form with fields for organization details such as name,
 * description, address, and an option to upload a display image.
 *
 * @param props - The properties passed to the component.
 *
 * @remarks
 * - The form includes validation for input fields such as name, description, and address.
 * - The `convertToBase64` function is used to handle image previews.
 * - Displays success or error messages using `react-toastify` for image feedback.
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
 */
import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import styles from 'style/app-fixed.module.css';
import type { InterfaceCurrentUserTypePG } from 'utils/interfaces';
import { countryOptions } from 'utils/formEnumFields';
import { toast } from 'react-toastify';
import { validateFile } from 'utils/fileValidation';
import convertToBase64 from 'utils/convertToBase64';
import { BaseModal } from 'shared-components/BaseModal';

/**
 * Shared form state interface for Organization creation.
 */
export interface InterfaceFormStateType {
  addressLine1: string;
  addressLine2: string;
  avatar: string | null;
  avatarPreview: string | null;
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
    <BaseModal
      show={showModal}
      onHide={toggleModal}
      headerContent={
        <div data-testid="modalOrganizationHeader">
          {t('createOrganization')}
        </div>
      }
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
                    addressLine2: inputText,
                  });
                }
              }}
              className={`mb-3 ${styles.inputField}`}
            />
          </Col>
        </Row>
        <div className="mt-3"></div>
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
                const base64String = await convertToBase64(file);
                setFormState({ ...formState, avatarPreview: base64String });
                toast.success(t('imageUploadSuccess'));
              } catch (error: unknown) {
                console.error('Image preview conversion failed:', error);
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
            {tCommon('createOrganization')}
          </Button>
        </Col>
      </Form>
    </BaseModal>
  );
};

export default OrganizationModal;
