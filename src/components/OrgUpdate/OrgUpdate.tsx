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
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';
import styles from './OrgUpdate.module.css';

interface InterfaceOrgUpdateProps {
  orgId: string;
}

function orgUpdate(props: InterfaceOrgUpdateProps): JSX.Element {
  const { orgId } = props;

  const [formState, setFormState] = useState<{
    orgName: string;
    orgDescrip: string;
    location: string;
    orgImage: string | null;
  }>({
    orgName: '',
    orgDescrip: '',
    location: '',
    orgImage: null,
  });

  const [publicchecked, setPublicChecked] = React.useState(false);
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
        location: data.organizations[0].location,
      });
      setPublicChecked(data.organizations[0].isPublic);
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
          location: formState.location,
          isPublic: publicchecked,
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
