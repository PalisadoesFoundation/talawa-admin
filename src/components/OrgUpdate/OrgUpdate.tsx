import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import type { ApolloError } from '@apollo/client';
import { WarningAmberRounded } from '@mui/icons-material';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import Loader from 'components/Loader/Loader';
import { Col, Form, Row } from 'react-bootstrap';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import styles from './OrgUpdate.module.css';
import type {
  InterfaceQueryOrganizationsListObject,
  InterfaceAddress,
} from 'utils/interfaces';
import { countryOptions } from 'utils/formEnumFields';

interface InterfaceOrgUpdateProps {
  orgId: string;
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
function orgUpdate(props: InterfaceOrgUpdateProps): JSX.Element {
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

  const [login] = useMutation(UPDATE_ORGANIZATION_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgUpdate',
  });
  const { t: tCommon } = useTranslation('common');

  const {
    data,
    loading,
    refetch,
    error,
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationsListObject[];
    };
    loading: boolean;
    refetch: (variables: { id: string }) => void;
    error?: ApolloError;
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: orgId },
    notifyOnNetworkStatusChange: true,
  });

  // Update form state when data changes
  useEffect(() => {
    let isMounted = true;
    if (data && isMounted) {
      setFormState({
        ...formState,
        orgName: data.organizations[0].name,
        orgDescrip: data.organizations[0].description,
        address: data.organizations[0].address,
      });
      setuserRegistrationRequiredChecked(
        data.organizations[0].userRegistrationRequired,
      );
      setVisibleChecked(data.organizations[0].visibleInSearch);
    }
    return () => {
      isMounted = false;
    };
  }, [data, orgId]);

  /**
   * Handles the save button click event.
   * Updates the organization with the form data.
   */
  const onSaveChangesClicked = async (): Promise<void> => {
    try {
      const { data } = await login({
        variables: {
          id: orgId,
          name: formState.orgName,
          description: formState.orgDescrip,
          address: {
            city: formState.address.city,
            countryCode: formState.address.countryCode,
            dependentLocality: formState.address.dependentLocality,
            line1: formState.address.line1,
            line2: formState.address.line2,
            postalCode: formState.address.postalCode,
            sortingCode: formState.address.sortingCode,
            state: formState.address.state,
          },
          userRegistrationRequired: userRegistrationRequiredChecked,
          visibleInSearch: visiblechecked,
          file: formState.orgImage,
        },
      });
      // istanbul ignore next
      if (data) {
        refetch({ id: orgId });
        toast.success(t('successfulUpdated') as string);
      }
    } catch (error: unknown) {
      errorHandler(t, error);
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
      <div id="orgupdate" className={styles.userupdatediv}>
        <form>
          <Form.Label>{tCommon('name')}</Form.Label>
          <Form.Control
            className="mb-3"
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
          <Form.Label>{tCommon('description')}</Form.Label>
          <Form.Control
            className="mb-3"
            placeholder={tCommon('description')}
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
          <Form.Label>{tCommon('address')}</Form.Label>
          <Row className="mb-1">
            <Col sm={6} className="mb-3">
              <Form.Control
                required
                as="select"
                value={formState.address.countryCode}
                data-testid="countrycode"
                onChange={(e) => {
                  const countryCode = e.target.value;
                  handleInputChange('countryCode', countryCode);
                }}
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
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('line1')}
                autoComplete="off"
                value={formState.address.line1}
                onChange={(e) => handleInputChange('line1', e.target.value)}
              />
            </Col>
            <Col sm={6} className="mb-1">
              <Form.Control
                placeholder={t('line2')}
                autoComplete="off"
                value={formState.address.line2}
                onChange={(e) => handleInputChange('line2', e.target.value)}
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
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="d-flex mb-3">
              <Form.Label className="me-3">
                {t('userRegistrationRequired')}:
              </Form.Label>
              <Form.Switch
                placeholder={t('userRegistrationRequired')}
                checked={userRegistrationRequiredChecked}
                onChange={(): void =>
                  setuserRegistrationRequiredChecked(
                    !userRegistrationRequiredChecked,
                  )
                }
              />
            </Col>
            <Col sm={6} className="d-flex mb-3">
              <Form.Label className="me-3">
                {t('isVisibleInSearch')}:
              </Form.Label>
              <Form.Switch
                placeholder={t('isVisibleInSearch')}
                checked={visiblechecked}
                onChange={(): void => setVisibleChecked(!visiblechecked)}
              />
            </Col>
          </Row>
          <Form.Label htmlFor="orgphoto">{tCommon('displayImage')}:</Form.Label>
          <Form.Control
            className="mb-4"
            accept="image/*"
            placeholder={tCommon('displayImage')}
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
                  orgImage: await convertToBase64(file),
                });
            }}
            data-testid="organisationImage"
          />
          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              value="savechanges"
              onClick={onSaveChangesClicked}
            >
              {tCommon('saveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
export default orgUpdate;
