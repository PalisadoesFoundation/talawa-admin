import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'shared-components/Button';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import SaveIcon from '@mui/icons-material/Save';
import type { ApolloError } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { Col, Row } from 'react-bootstrap';
import {
  FormFieldGroup,
  FormTextField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';
import { errorHandler } from 'utils/errorHandler';
import styles from './OrgUpdate.module.css';
import type { InterfaceAddress } from 'utils/interfaces';
import {
  InterfaceOrgUpdateProps,
  InterfaceOrganization,
  InterfaceMutationUpdateOrganizationInput,
} from 'types/AdminPortal/OrgUpdate/interface';

/**
 * Component for updating organization details.
 *
 * This component allows users to update the organization's name, description, address,
 * visibility settings, and upload an image. It uses GraphQL mutations and queries to
 * fetch and update data.
 *
 * @param props - Component props containing the organization ID.
 * @returns The rendered component.
 */
function OrgUpdate(props: InterfaceOrgUpdateProps): JSX.Element {
  const { orgId } = props;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formState, setFormState] = useState<{
    orgName: string;
    orgDescrip: string;
    address: InterfaceAddress;
    orgImage: string | null;
    avatar?: File;
  }>({
    orgName: '',
    orgDescrip: '',
    address: {
      city: '',
      countryCode: '',
      dependentLocality: '',
      line1: '',
      line2: '',
      postalCode: '',
      sortingCode: '',
      state: '',
    },
    orgImage: null,
  });

  const handleInputChange = (fieldName: string, value: string): void => {
    setFormState((prevState) => ({
      ...prevState,
      address: { ...prevState.address, [fieldName]: value },
    }));
  };

  const [userRegistrationRequiredChecked, setuserRegistrationRequiredChecked] =
    React.useState(false);
  const [visiblechecked, setVisibleChecked] = React.useState(false);

  const [updateOrganization] = useMutation<
    { updateOrganization: { organization: InterfaceOrganization } },
    { input: InterfaceMutationUpdateOrganizationInput }
  >(UPDATE_ORGANIZATION_MUTATION);

  const { t } = useTranslation('translation', { keyPrefix: 'orgUpdate' });
  const { t: tCommon } = useTranslation('common');

  const {
    data,
    loading,
    refetch,
    error,
  }: {
    data?: { organization: InterfaceOrganization };
    loading: boolean;
    refetch: (variables: { id: string }) => void;
    error?: ApolloError;
  } = useQuery(GET_ORGANIZATION_BASIC_DATA, {
    variables: { id: orgId },
    notifyOnNetworkStatusChange: true,
  });

  // Update form state when data changes
  useEffect(() => {
    let isMounted = true;
    if (data?.organization && isMounted) {
      setFormState({
        orgName: data.organization.name,
        orgDescrip: data.organization.description,
        address: {
          city: data.organization.city,
          countryCode: data.organization.countryCode,
          dependentLocality: '',
          line1: data.organization.addressLine1,
          line2: data.organization.addressLine2,
          postalCode: data.organization.postalCode,
          sortingCode: '',
          state: data.organization.state,
        },
        orgImage: null,
      });
      setuserRegistrationRequiredChecked(
        data.organization.isUserRegistrationRequired ?? false,
      );
      setVisibleChecked(data.organization.isVisibleInSearch ?? false);
    }
    return () => {
      isMounted = false;
    };
  }, [data]);

  /**
   * Handles the save button click event.
   * Updates the organization with the form data.
   */

  const [isSaving, setIsSaving] = useState(false);

  const onSaveChangesClicked = async (): Promise<void> => {
    try {
      if (!formState.orgName || !formState.orgDescrip) {
        NotificationToast.error(t('nameDescriptionRequired') as string);
        return;
      }

      setIsSaving(true);
      // Function to remove empty string fields from the input object
      const removeEmptyFields = (
        obj: InterfaceMutationUpdateOrganizationInput,
      ): Partial<InterfaceMutationUpdateOrganizationInput> => {
        return Object.fromEntries(
          Object.entries(obj).filter(
            ([key, value]) =>
              key === 'id' ||
              (value != null && (typeof value !== 'string' || value.trim())),
          ),
        ) as Partial<InterfaceMutationUpdateOrganizationInput>;
      };

      // Build the input object with only non-empty values
      const inputData = {
        id: orgId,
        name: formState.orgName,
        description: formState.orgDescrip,
        addressLine1: formState.address.line1,
        addressLine2: formState.address.line2,
        city: formState.address.city,
        state: formState.address.state,
        postalCode: formState.address.postalCode,
        countryCode: formState.address?.countryCode,
        ...(formState.avatar ? { avatar: formState.avatar } : {}),
        isUserRegistrationRequired: userRegistrationRequiredChecked,
        isVisibleInSearch: visiblechecked,
      };

      // Filter out empty fields
      const cleanedInput = removeEmptyFields(inputData);

      const { data } = await updateOrganization({
        variables: {
          input: cleanedInput as InterfaceMutationUpdateOrganizationInput,
        },
      });

      if (data) {
        refetch({ id: orgId });
        NotificationToast.success(t('successfulUpdated') as string);
        // Clear avatar from state and file input after successful upload
        setFormState((prev) => ({ ...prev, avatar: undefined }));
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        NotificationToast.error(t('updateFailed') as string);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className={styles.message}>
        <WarningAmberRounded fontSize="large" className={styles.icon} />
        <h6 className="fw-bold text-danger text-center">
          {t('errorLoadingOrganizationData')}
          <br />
          {`${error.message}`}
        </h6>
      </div>
    );
  }

  return (
    <LoadingState isLoading={loading} variant="spinner">
      <div id="orgupdate">
        <form className={styles.ss}>
          <FormTextField
            name="orgName"
            label={tCommon('name')}
            required
            placeholder={t('enterNameOrganization')}
            autoComplete="off"
            value={formState.orgName}
            onChange={(value: string) => {
              setFormState({ ...formState, orgName: value });
            }}
          />

          <FormFieldGroup
            name="orgDescrip"
            label={tCommon('description')}
            required
          >
            <FormTextField
              name="orgDescrip"
              label={tCommon('description')}
              as="textarea"
              className={styles.descriptionTextField}
              placeholder={t('enterOrganizationDescription')}
              autoComplete="off"
              value={formState.orgDescrip}
              onChange={(value: string) => {
                setFormState({ ...formState, orgDescrip: value });
              }}
            />
          </FormFieldGroup>

          <FormFieldGroup
            name="address.line1"
            label={tCommon('Location')}
            required
          >
            <FormTextField
              name="address.line1"
              label={tCommon('Location')}
              placeholder={tCommon('Enter Organization location')}
              autoComplete="off"
              className={styles.textFields}
              value={formState.address.line1}
              onChange={(value: string) => {
                handleInputChange('line1', value);
              }}
            />
          </FormFieldGroup>
          <FormFieldGroup name="photo" label={tCommon('displayImage')}>
            <input
              ref={fileInputRef}
              className={styles.customFileInput}
              accept="image/*"
              name="photo"
              type="file"
              data-testid="organisationImage"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!file.type.startsWith('image/')) {
                  NotificationToast.error(t('invalidImageType') as string);
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  NotificationToast.error(t('imageSizeTooLarge') as string);
                  return;
                }
                setFormState({
                  ...formState,
                  avatar: file,
                });
              }}
            />
          </FormFieldGroup>

          <Row>
            <Col sm={6} className="d-flex mb-4 mt-4 align-items-center">
              <FormFieldGroup
                name="isPublic"
                label={`${t('isPublic')}:`}
                inline
              >
                <input
                  id="isPublic"
                  type="checkbox"
                  data-testid="user-reg-switch"
                  className="custom-switch"
                  checked={!userRegistrationRequiredChecked}
                  onChange={() =>
                    setuserRegistrationRequiredChecked(
                      !userRegistrationRequiredChecked,
                    )
                  }
                />
              </FormFieldGroup>
            </Col>
            <Col sm={6} className="d-flex mb-4 mt-4 align-items-center">
              <FormFieldGroup
                name="isVisibleInSearch"
                label={`${t('isVisibleInSearch')}:`}
                inline
              >
                <input
                  type="checkbox"
                  data-testid="visibility-switch"
                  className="custom-switch"
                  checked={visiblechecked}
                  onChange={() => setVisibleChecked(!visiblechecked)}
                />
              </FormFieldGroup>
            </Col>
          </Row>

          <div className="w-full d-flex justify-content-between mt-4 ">
            <Row>
              <Col sm={6}></Col>
              <Col sm={6} className="d-flex justify-content-end">
                <Button
                  className={styles.saveChangesBtn}
                  value="savechanges"
                  data-testid="save-org-changes-btn"
                  onClick={onSaveChangesClicked}
                  disabled={isSaving}
                >
                  <SaveIcon className="me-1" />
                  {isSaving ? tCommon('saving') : tCommon('saveChanges')}
                </Button>
              </Col>
            </Row>
          </div>
        </form>
      </div>
    </LoadingState>
  );
}
export default OrgUpdate;
