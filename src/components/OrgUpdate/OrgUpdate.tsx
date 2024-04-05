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
<<<<<<< HEAD
import styles from './OrgUpdate.module.css';
import type {
  InterfaceQueryOrganizationsListObject,
  InterfaceAddress,
} from 'utils/interfaces';
import { countryOptions } from 'utils/formEnumFields';
=======
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import styles from './OrgUpdate.module.css';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

interface InterfaceOrgUpdateProps {
  orgId: string;
}

function orgUpdate(props: InterfaceOrgUpdateProps): JSX.Element {
  const { orgId } = props;

  const [formState, setFormState] = useState<{
    orgName: string;
    orgDescrip: string;
<<<<<<< HEAD
    address: InterfaceAddress;
=======
    location: string;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    orgImage: string | null;
  }>({
    orgName: '',
    orgDescrip: '',
<<<<<<< HEAD
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
=======
    location: '',
    orgImage: null,
  });

  const [publicchecked, setPublicChecked] = React.useState(false);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  const [visiblechecked, setVisibleChecked] = React.useState(false);

  const [login] = useMutation(UPDATE_ORGANIZATION_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgUpdate',
  });

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

  useEffect(() => {
    let isMounted = true;
    if (data && isMounted) {
      setFormState({
        ...formState,
        orgName: data.organizations[0].name,
        orgDescrip: data.organizations[0].description,
<<<<<<< HEAD
        address: data.organizations[0].address,
      });
      setuserRegistrationRequiredChecked(
        data.organizations[0].userRegistrationRequired,
      );
=======
        location: data.organizations[0].location,
      });
      setPublicChecked(data.organizations[0].isPublic);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      setVisibleChecked(data.organizations[0].visibleInSearch);
    }
    return () => {
      isMounted = false;
    };
  }, [data, orgId]);

  const onSaveChangesClicked = async (): Promise<void> => {
    try {
      const { data } = await login({
        variables: {
          id: orgId,
          name: formState.orgName,
          description: formState.orgDescrip,
<<<<<<< HEAD
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
=======
          location: formState.location,
          isPublic: publicchecked,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          visibleInSearch: visiblechecked,
          file: formState.orgImage,
        },
      });
      // istanbul ignore next
      if (data) {
        refetch({ id: orgId });
        toast.success(t('successfulUpdated'));
      }
    } catch (error: any) {
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
          <Form.Label>{t('name')}</Form.Label>
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
          <Form.Label>{t('description')}</Form.Label>
          <Form.Control
            className="mb-3"
            placeholder={t('description')}
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
<<<<<<< HEAD
          <Form.Label>{t('address')}</Form.Label>
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
=======
          <Form.Label>{t('location')}</Form.Label>
          <Form.Control
            className="mb-4"
            placeholder={t('location')}
            autoComplete="off"
            required
            value={formState.location}
            onChange={(e): void => {
              setFormState({
                ...formState,
                location: e.target.value,
              });
            }}
          />
          <Row>
            <Col sm={6} className="d-flex mb-3">
              <Form.Label className="me-3">{t('isPublic')}:</Form.Label>
              <Form.Switch
                placeholder={t('isPublic')}
                checked={publicchecked}
                onChange={(): void => setPublicChecked(!publicchecked)}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
          <Form.Label htmlFor="orgphoto">{t('displayImage')}:</Form.Label>
          <Form.Control
            className="mb-4"
            accept="image/*"
            placeholder={t('displayImage')}
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
              {t('saveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
export default orgUpdate;
