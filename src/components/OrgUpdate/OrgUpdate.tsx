import React from 'react';
import { ApolloQueryResult, useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './OrgUpdate.module.css';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import { Col, Form, Row } from 'react-bootstrap';
import Loader from 'components/Loader/Loader';
import type { InterfaceQueryOrganizationsListObject } from 'utils/interfaces';

interface InterfaceOrgUpdateProps {
  orgid: string;
}

function orgUpdate(props: InterfaceOrgUpdateProps): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];

  const [formState, setFormState] = React.useState<{
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
  }: {
    data?: {
      organizations: InterfaceQueryOrganizationsListObject[];
    };
    loading: boolean;
    refetch: (variables: { id: string }) => void;
  } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
    notifyOnNetworkStatusChange: true,
  });

  React.useEffect(() => {
    if (data) {
      setFormState({
        ...formState,
        orgName: data.organizations[0].name,
        orgDescrip: data.organizations[0].description,
        location: data.organizations[0].location,
      });
      setPublicChecked(data.organizations[0].isPublic);
      setVisibleChecked(data.organizations[0].visibleInSearch);
    }
  }, [data]);

  if (loading) {
    return <Loader styles={styles.loader} size="lg" />;
  }

  const onSaveChangesClicked = async (): Promise<void> => {
    try {
      const { data } = await login({
        variables: {
          id: currentUrl,
          name: formState.orgName,
          description: formState.orgDescrip,
          location: formState.location,
          isPublic: publicchecked,
          visibleInSearch: visiblechecked,
          file: formState.orgImage,
        },
      });
      if (data) {
        refetch({ id: currentUrl });
        toast.success(t('successfulUpdated'));
      }
    } catch (error: any) {
      errorHandler(t, error);
    }
  };

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
              <Form.Label htmlFor="ispublic" className="me-3">
                {t('isPublic')}:
              </Form.Label>
              <Form.Switch
                id="ispublic"
                checked={publicchecked}
                onClick={(): void => setPublicChecked(!publicchecked)}
              />
            </Col>
            <Col sm={6} className="d-flex mb-3">
              <Form.Label htmlFor="registrable" className="me-3">
                {t('isVisibleInSearch')}:
              </Form.Label>
              <Form.Switch
                checked={visiblechecked}
                onClick={(): void => setVisibleChecked(!visiblechecked)}
              />
            </Col>
          </Row>
          <Form.Label htmlFor="orgphoto">{t('displayImage')}:</Form.Label>
          <Form.Control
            className="mb-4"
            accept="image/*"
            id="orgphoto"
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
