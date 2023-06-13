import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';

import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './OrgUpdate.module.css';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';
import { Form } from 'react-bootstrap';

interface InterfaceOrgUpdateProps {
  id: string;
  orgid: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const [publicchecked, setPublicChecked] = React.useState(true);
  const [visiblechecked, setVisibleChecked] = React.useState(false);

  const [login] = useMutation(UPDATE_ORGANIZATION_MUTATION);

  const { t } = useTranslation('translation', {
    keyPrefix: 'orgUpdate',
  });

  const { data, loading: loadingdata } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  React.useEffect(() => {
    if (data) {
      setFormState({
        ...formState,
        orgName: data.organizations[0].name,
        orgDescrip: data.organizations[0].description,
        location: data.organizations[0].location,
      });
    }
  }, [data]);

  if (loadingdata) {
    return <div className="loader"></div>;
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
      /* istanbul ignore next */
      if (data) {
        window.location.assign(`/orgdash/id=${props.orgid}`);

        toast.success(t('successfulUpdated'));
      }
    } catch (error: any) {
      /* istanbul ignore next */
      errorHandler(t, error);
    }
  };

  /* istanbul ignore next */
  const cancelUpdate = (): void => {
    window.location.reload();
  };

  return (
    <>
      <div id="orgupdate" className={styles.userupdatediv}>
        <form>
          {/* <h3 className={styles.settingstitle}>Update Your Details</h3> */}
          <div className={styles.dispflex}>
            <div>
              <label>{t('name')}</label>
              <Form.Control
                type="input"
                id="orgname"
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
            </div>
            <div>
              <label>{t('description')}</label>
              <Form.Control
                type="input"
                id="orgdescrip"
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
            </div>
          </div>
          <div className={styles.dispflex}>
            <div>
              <label>{t('location')}</label>
              <Form.Control
                type="location"
                id="location"
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
            </div>
          </div>
          <div className={styles.dispflex}>
            <div>
              <label htmlFor="orgphoto" className={styles.orgphoto}>
                {t('displayImage')}:
                <Form.Control
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
              </label>
            </div>
            <div className={styles.checkboxdiv}>
              <div>
                <label htmlFor="ispublic">{t('isPublic')}:</label>
                <Form.Control
                  id="ispublic"
                  type="checkbox"
                  defaultChecked={publicchecked}
                  onChange={(): void => setPublicChecked(!publicchecked)}
                />
              </div>
              <div>
                <label htmlFor="registrable">{t('isRegistrable')}:</label>
                <Form.Control
                  id="registrable"
                  type="checkbox"
                  defaultChecked={visiblechecked}
                  onChange={(): void => setVisibleChecked(!visiblechecked)}
                />
              </div>
            </div>
          </div>
          <div className={styles.dispbtnflex}>
            <Button
              type="button"
              className={styles.greenregbtn}
              value="savechanges"
              onClick={onSaveChangesClicked}
            >
              {t('saveChanges')}
            </Button>
            <Button
              type="button"
              className={styles.whitebtn}
              value="cancelchanges"
              onClick={cancelUpdate}
            >
              {t('cancel')}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
export default orgUpdate;
