import React from 'react';
import styles from './OrgDelete.module.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { DELETE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';

function OrgDelete(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgDelete',
  });

  const [del] = useMutation(DELETE_ORGANIZATION_MUTATION);
  const currentUrl = window.location.href.split('=')[1];

  const delete_org = async () => {
    try {
      const { data } = await del({
        variables: {
          id: currentUrl,
        },
      });

      if (data) {
        window.location.replace('/orglist');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div id="OrgDelete" className="search-OrgDelete">
        <p className={styles.greenDeleteButton}>
          <button
            type="button"
            className="mt-3"
            data-testid="deleteClick"
            data-toggle="modal"
            data-target="#deleteOrganizationModal"
          >
            {t('deleteOrg')}
          </button>
        </p>
      </div>

      <div
        className="modal fade"
        id="deleteOrganizationModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="deleteOrganizationModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteOrganizationModalLabel">
                {t('deleteOrg')}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{t('deleteMsg')}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
              >
                {t('no')}
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={delete_org}
                data-testid="deleteOrganizationBtn"
              >
                {t('yes')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default OrgDelete;
