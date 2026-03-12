import React, { type ChangeEvent } from 'react';
import Button from 'shared-components/Button/Button';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { useMinioUpload } from 'utils/MinioUpload';
import { countryOptions } from 'utils/formEnumFields';
import styles from './OrganizationModal.module.css';
import { useTranslation } from 'react-i18next';

/**
 * Interface for the organization form state.
 */
interface InterfaceFormStateType {
  /** Address line 1 of the organization. */
  addressLine1: string;
  /** Address line 2 of the organization. */
  addressLine2: string;
  /** Avatar URL or identifier of the organization. */
  avatar: string | null;
  /** City where the organization is located. */
  city: string;
  /** Country code of the organization's location. */
  countryCode: string;
  /** Description of the organization. */
  description: string;
  /** Name of the organization. */
  name: string;
  /** Postal code of the organization's location. */
  postalCode: string;
  /** State or province where the organization is located. */
  state: string;
}

/**
 * Interface for the properties of the OrganizationModal component.
 */
export interface InterfaceOrganizationModalProps {
  /** A boolean indicating whether the modal should be displayed. */
  showModal: boolean;
  /** A function to toggle the visibility of the modal. */
  toggleModal: () => void;
  /** The state of the form in the organization modal. */
  formState: InterfaceFormStateType;
  /** A function to update the state of the form in the organization modal. */
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  /** A function to handle the submission of the organization creation form. */
  createOrg: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * OrganizationModal component allows administrators to create a new organization.
 * It provides a form to enter organization details like name, description, address, and an image.
 *
 * @param props - The properties for the OrganizationModal component.
 * @returns A JSX element representing the organization creation modal.
 */
const OrganizationModal: React.FC<InterfaceOrganizationModalProps> = ({
  showModal,
  toggleModal,
  formState,
  setFormState,
  createOrg,
}) => {
  const { t } = useTranslation();
  const { t: tCommon } = useTranslation('common');
  const { uploadFileToMinio } = useMinioUpload();

  return (
    <BaseModal
      show={showModal}
      onHide={toggleModal}
      title={tCommon('createOrganization')}
      headerClassName={styles.modalHeader}
      dataTestId="modalOrganizationHeader"
    >
      <form onSubmit={createOrg}>
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

        <label htmlFor="countrySelect" className="form-label">
          {tCommon('address')}
        </label>

        <div className="row mb-1">
          <div className="col-sm-6 mb-1">
            <select
              id="countrySelect"
              required
              data-testid="modalOrganizationCountryCode"
              value={formState.countryCode}
              onChange={(e): void => {
                const inputText = e.target.value;
                if (inputText.length <= 50) {
                  setFormState({ ...formState, countryCode: inputText });
                }
              }}
              className={`form-control mb-3 ${styles.inputField}`}
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
            </select>
          </div>

          <div className="col-sm-6 mb-1">
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
          </div>
        </div>

        <div className="row mb-1">
          <div className="col-sm-6 mb-1">
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
          </div>

          <div className="col-sm-6 mb-1">
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
          </div>
        </div>

        <div className="row mb-1">
          <div className="col-sm-6 mb-1">
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
          </div>

          <div className="col-sm-6 mb-1">
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
          </div>
        </div>

        <label htmlFor="orgphoto" className="form-label">
          {tCommon('displayImage')}
        </label>

        <input
          accept="image/*"
          id="orgphoto"
          className={`form-control mb-3 ${styles.inputField}`}
          name="photo"
          type="file"
          data-testid="organisationImage"
          onChange={async (e): Promise<void> => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];

            if (!file) return;

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
              NotificationToast.error(tCommon('fileTooLarge'));
              return;
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
              NotificationToast.error(tCommon('invalidFileType'));
              return;
            }

            try {
              const { objectName } = await uploadFileToMinio(
                file,
                'organization',
              );
              setFormState({ ...formState, avatar: objectName });
              NotificationToast.success(tCommon('imageUploadSuccess'));
            } catch (error) {
              console.error('Error uploading image:', error);
              NotificationToast.error(tCommon('imageUploadError'));
            }
          }}
        />

        <div className={styles.sampleOrgSection}>
          <Button
            type="submit"
            value="invite"
            data-testid="submitOrganizationForm"
            className="addButton"
          >
            {tCommon('createOrganization')}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default OrganizationModal;
