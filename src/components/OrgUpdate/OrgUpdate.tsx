import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import styles from './OrgUpdate.module.css';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import convertToBase64 from 'utils/convertToBase64';
import { errorHandler } from 'utils/errorHandler';

interface OrgUpdateProps {
  id: string;
  orgid: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OrgUpdate(props: OrgUpdateProps): JSX.Element {
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

  const onSaveChangesClicked = async () => {
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
  const cancelUpdate = () => {
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
              <input
                type="input"
                id="orgname"
                placeholder={t('enterNameOrganization')}
                autoComplete="off"
                required
                value={formState.orgName}
                onChange={(e) => {
                  setFormState({
                    ...formState,
                    orgName: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <label>{t('description')}</label>
              <input
                type="input"
                id="orgdescrip"
                placeholder={t('description')}
                autoComplete="off"
                required
                value={formState.orgDescrip}
                onChange={(e) => {
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
              <input
                type="location"
                id="location"
                placeholder={t('location')}
                autoComplete="off"
                required
                value={formState.location}
                onChange={(e) => {
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
                <input
                  accept="image/*"
                  id="orgphoto"
                  name="photo"
                  type="file"
                  multiple={false}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
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
                <input
                  id="ispublic"
                  type="checkbox"
                  defaultChecked={publicchecked}
                  onChange={() => setPublicChecked(!publicchecked)}
                />
              </div>
              <div>
                <label htmlFor="registrable">{t('isRegistrable')}:</label>
                <input
                  id="registrable"
                  type="checkbox"
                  defaultChecked={visiblechecked}
                  onChange={() => setVisibleChecked(!visiblechecked)}
                />
              </div>
            </div>
          </div>
          <div className={styles.dispbtnflex}>
            <button
              type="button"
              className={styles.greenregbtn}
              value="savechanges"
              onClick={onSaveChangesClicked}
            >
              {t('saveChanges')}
            </button>
            <button
              type="button"
              className={styles.whitebtn}
              value="cancelchanges"
              onClick={cancelUpdate}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default OrgUpdate;
