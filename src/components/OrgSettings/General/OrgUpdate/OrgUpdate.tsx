import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import SyncIcon from '@mui/icons-material/Sync';
import SaveIcon from '@mui/icons-material/Save';
import type { ApolloError } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import { Col, Form, Row } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import styles from '../../../../style/app-fixed.module.css';
import type { InterfaceAddress } from 'utils/interfaces';

interface InterfaceOrgUpdateProps {
  orgId: string;
}

interface InterfaceMutationUpdateOrganizationInput {
  id: string;
  name?: string;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  avatar?: string | null;
}

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

  const [formState, setFormState] = useState<{
    orgName: string;
    orgDescrip: string;
    address: InterfaceAddress;
    orgImage: string | null;
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
      address: {
        ...prevState.address,
        [fieldName]: value,
      },
    }));
  };

  const [userRegistrationRequiredChecked, setuserRegistrationRequiredChecked] =
    React.useState(false);
  const [visiblechecked, setVisibleChecked] = React.useState(false);

  const [updateOrganization] = useMutation<
    { updateOrganization: { organization: InterfaceOrganization } },
    { input: InterfaceMutationUpdateOrganizationInput }
  >(UPDATE_ORGANIZATION_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgUpdate',
  });
  const { t: tCommon } = useTranslation('common');

  interface InterfaceOrganization {
    id: string;
    name: string;
    description: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
    avatarURL: string | null;
  }

  const {
    data,
    loading,
    refetch,
    error,
  }: {
    data?: {
      organization: InterfaceOrganization;
    };
    loading: boolean;
    refetch: (variables: { input: { id: string } }) => void;
    error?: ApolloError;
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: {
      input: {
        id: orgId,
      },
    },
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
        toast.error('Name and description are required');
        return;
      }

      setIsSaving(true); // Set loading state before mutation

      const { data } = await updateOrganization({
        variables: {
          input: {
            id: orgId,
            name: formState.orgName,
            description: formState.orgDescrip,
            addressLine1: formState.address.line1,
            addressLine2: formState.address.line2,
            city: formState.address.city,
            state: formState.address.state,
            postalCode: formState.address.postalCode,
            countryCode: formState.address.countryCode,
            avatar: formState.orgImage,
          },
        },
      });

      if (data) {
        refetch({ input: { id: orgId } });
        toast.success(t('successfulUpdated') as string);
      } else {
        toast.error('Failed to update organization');
      }
    } catch (error: unknown) {
      errorHandler(t, error);
    } finally {
      setIsSaving(false); // Reset loading state after mutation
    }
  };

  if (loading) {
    return <Loader styles={styles.message} size="lg" />;
  }

  if (error) {
    return (
      <div className={styles.message}>
        <WarningAmberRounded className={styles.icon} fontSize="large" />
        <h6 className="fw-bold text-danger text-center">
          Error occured while loading Organization Data
          <br />
          {`${error.message}`}
        </h6>
      </div>
    );
  }

  return (
    <>
      <div id="orgupdate" className={styles.orgCardSettings}>
        <form>
          <Form.Label className={styles.orgUpdateFormLables}>
            {tCommon('name')}
          </Form.Label>
          <Form.Control
            className={styles.textFields}
            placeholder={t('enterNameOrganization')}
            autoComplete="off"
            required
            value={formState.orgName}
            onChange={(e): void => {
              setFormState({
                ...formState,
                orgName: e.target.value,
              });
            }}
          />
          {/* <Form.Label className={styles.orgUpdateFormLables}>
            {tCommon('description')}
          </Form.Label>
          <Form.Control
            as="textarea"
            className={`mb-3 ${styles.customTextarea}`}
            placeholder={tCommon('Enter organization description')}
            autoComplete="off"
            required
            value={formState.orgDescrip}
            onChange={(e): void => {
              setFormState({
                ...formState,
                orgDescrip: e.target.value,
              });
            }}
          /> */}
          <Form.Label className={styles.orgUpdateFormLables}>
            {tCommon('description')}
          </Form.Label>
          <Form.Control
            as="textarea"
            className={styles.descriptionTextField}
            placeholder={t('enterOrganizationDescription')}
            autoComplete="off"
            required
            value={formState.orgDescrip}
            onChange={(e): void => {
              setFormState({
                ...formState,
                orgDescrip: e.target.value,
              });
            }}
          />

          <Form.Label className={styles.orgUpdateFormLables}>
            {tCommon('Location')}
          </Form.Label>
          <Form.Control
            className={styles.textFields}
            placeholder={tCommon('Enter Organization location')}
            autoComplete="off"
            required
            value={formState.address.line1}
            onChange={(e): void => {
              handleInputChange('line1', e.target.value);
            }}
          />
          <Form.Label htmlFor="orgphoto" className={styles.orgUpdateFormLables}>
            {tCommon('displayImage')}:
          </Form.Label>
          <Form.Control
            className={styles.customFileInput}
            accept="image/*"
            placeholder={tCommon('displayImage')}
            name="photo"
            type="file"
            multiple={false}
            onChange={async (e: React.ChangeEvent): Promise<void> => {
              const target = e.target as HTMLInputElement;
              const file = target.files && target.files[0];
              if (file)
                setFormState({
                  ...formState,
                  orgImage: await convertToBase64(file),
                });
            }}
            data-testid="organisationImage"
          />
          <Row>
            <Col sm={6} className="d-flex mb-4 mt-4 align-items-center">
              <Form.Label className="me-3 mb-0 fw-normal text-black">
                {t('Is Public')}:
              </Form.Label>
              <Form.Switch
                className="custom-switch"
                placeholder={t('userRegistrationRequired')}
                checked={userRegistrationRequiredChecked}
                onChange={(): void =>
                  setuserRegistrationRequiredChecked(
                    !userRegistrationRequiredChecked,
                  )
                }
              />
            </Col>
            <Col sm={6} className="d-flex mb-4 mt-4 align-items-center">
              <Form.Label className="me-3 mb-0 fw-normal text-black">
                {t('isVisibleInSearch')}:
              </Form.Label>
              <Form.Switch
                className="custom-switch"
                placeholder={t('isVisibleInSearch')}
                checked={visiblechecked}
                onChange={(): void => setVisibleChecked(!visiblechecked)}
              />
            </Col>
          </Row>

          <div className="w-fulld-flex justify-content-between mt-4 ">
            <Row>
              <Col sm={6}>
                <Button
                  variant="outline"
                  className={styles.resetChangesBtn}
                  value="resetchanges"
                  // onClick={onResetChangesClicked}
                >
                  <SyncIcon className={styles.syncIconStyle} />
                  {tCommon('resetChanges')}
                </Button>
              </Col>
              <Col sm={6} className="d-flex justify-content-end">
                <Button
                  className={styles.saveChangesBtn}
                  value="savechanges"
                  data-testid="save-org-changes-btn"
                  onClick={onSaveChangesClicked}
                  disabled={isSaving} // Add disabled state
                >
                  <SaveIcon className="me-1" />
                  {isSaving ? tCommon('saving') : tCommon('saveChanges')}
                </Button>
              </Col>
            </Row>
          </div>
        </form>
      </div>
    </>
  );
}
export default OrgUpdate;
