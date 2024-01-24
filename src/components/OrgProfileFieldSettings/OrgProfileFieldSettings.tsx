import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import {
  ADD_CUSTOM_FIELD,
  REMOVE_CUSTOM_FIELD,
} from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_CUSTOM_FIELDS } from 'GraphQl/Queries/Queries';
import styles from './OrgProfileFieldSettings.module.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import EditOrgCustomFieldDropDown from 'components/EditCustomFieldDropDown/EditCustomFieldDropDown';
import { useParams } from 'react-router-dom';

export interface InterfaceCustomFieldData {
  type: string;
  name: string;
}

const OrgProfileFieldSettings = (): any => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgProfileField',
  });

  const [customFieldData, setCustomFieldData] =
    useState<InterfaceCustomFieldData>({
      type: '',
      name: '',
    });
  const { orgId: currentOrgId } = useParams();

  const [addCustomField] = useMutation(ADD_CUSTOM_FIELD);
  const [removeCustomField] = useMutation(REMOVE_CUSTOM_FIELD);

  const { loading, error, data, refetch } = useQuery(
    ORGANIZATION_CUSTOM_FIELDS,
    {
      variables: {
        customFieldsByOrganizationId: currentOrgId,
      },
    }
  );

  const handleSave = async (): Promise<void> => {
    try {
      await addCustomField({
        variables: {
          organizationId: currentOrgId,
          ...customFieldData,
        },
      });
      toast.success(t('fieldSuccessMessage'));
      setCustomFieldData({ type: '', name: '' });
      refetch();
    } catch (error) {
      toast.success((error as Error).message);
    }
  };

  const handleRemove = async (customFieldId: string): Promise<void> => {
    try {
      await removeCustomField({
        variables: {
          organizationId: currentOrgId,
          customFieldId: customFieldId,
        },
      });

      toast.success(t('fieldRemovalSuccess'));
      refetch();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  if (loading) return <p>Loading... {t('loading')}</p>;
  if (error) return <p>{error.message} </p>;

  return (
    <div>
      {data.customFieldsByOrganization.length === 0 ? (
        <p>{t('noCustomField')}</p>
      ) : (
        <table className={styles.customDataTable}>
          <tbody>
            {data.customFieldsByOrganization.map(
              (
                field: {
                  _id: string;
                  name: string;
                  type: string;
                },
                index: number
              ) => (
                <tr key={index}>
                  <td>{field.name}</td>
                  <td>{field.type}</td>
                  <td>
                    <Button
                      variant="danger"
                      size={'sm'}
                      onClick={() => handleRemove(field._id)}
                      title={t('Remove Custom Field')}
                      data-testid="removeCustomFieldBtn"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
      <hr />
      <div>
        <div>
          <div>
            <form>
              <div>
                <Form.Label>{t('customFieldName')}</Form.Label>
                <Form.Control
                  className="mb-3"
                  placeholder={t('enterCustomFieldName')}
                  autoComplete="off"
                  required
                  data-testid="customFieldInput"
                  value={customFieldData.name}
                  onChange={(event) => {
                    setCustomFieldData({
                      ...customFieldData,
                      name: event.target.value,
                    });
                  }}
                />
              </div>

              <div className={styles.textBox}>
                <Form.Label className={'text-secondary fw-bold'}>
                  {t('customFieldType')}
                </Form.Label>
                <EditOrgCustomFieldDropDown
                  setCustomFieldData={setCustomFieldData}
                  customFieldData={customFieldData}
                />
              </div>

              <Button
                variant="success"
                value="savechanges"
                onClick={handleSave}
                className={styles.saveButton}
                data-testid="saveChangesBtn"
              >
                {t('saveChanges')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgProfileFieldSettings;
