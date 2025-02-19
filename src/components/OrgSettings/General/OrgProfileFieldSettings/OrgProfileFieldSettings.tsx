import { useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import i18next from 'i18next';
import { useParams } from 'react-router-dom';

import {
  ADD_CUSTOM_FIELD,
  REMOVE_CUSTOM_FIELD,
} from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_CUSTOM_FIELDS } from 'GraphQl/Queries/Queries';
import styles from './OrgProfileFieldSettings.module.css';
import EditOrgCustomFieldDropDown from 'components/EditCustomFieldDropDown/EditCustomFieldDropDown';
import type { InterfaceCustomFieldData } from 'utils/interfaces';

const OrgProfileFieldSettings = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgProfileField',
  });
  const { t: tCommon } = useTranslation('common');

  const [customFieldData, setCustomFieldData] =
    useState<InterfaceCustomFieldData>({
      id: '',
      type: '',
      name: '',
    });

  const { orgId: currentOrgId } = useParams();

  const [addCustomField] = useMutation(ADD_CUSTOM_FIELD);
  const [removeCustomField] = useMutation(REMOVE_CUSTOM_FIELD);

  const { loading, error, data, refetch } = useQuery(
    ORGANIZATION_CUSTOM_FIELDS,
    {
      variables: { organizationId: currentOrgId },
    },
  );

  useEffect(() => {
    const handleLanguageChange = (): void => {
      refetch();
    };
    i18next.on('languageChanged', handleLanguageChange);
    return () => {
      i18next.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleSave = async (): Promise<void> => {
    if (!customFieldData.name.trim() || !customFieldData.type.trim()) {
      toast.error(tCommon('pleaseFillAllRequiredFields'));
      return;
    }

    try {
      await addCustomField({
        variables: {
          organizationId: currentOrgId,
          name: customFieldData.name,
          type: customFieldData.type,
        },
      });
      await refetch();
      toast.success(t('customFieldAdded') as string);
      setCustomFieldData({ id: '', type: '', name: '' });
    } catch (error) {
      // Removed redundant 'orgProfileField.' prefix
      toast.error(
        t('pleaseFillAllRequiredFields', {
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  };

  const handleRemove = async (customFieldId: string): Promise<void> => {
    try {
      await removeCustomField({
        variables: { id: customFieldId },
      });
      await refetch();
      toast.success(t('customFieldRemoved'));
    } catch (error) {
      toast.error(
        t('pleaseFillAllRequiredFields', {
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
  };

  if (loading) return <p>{tCommon('loading')}</p>;
  if (error) return <p>{tCommon('pleaseFillAllRequiredFields')}</p>;

  return (
    <div>
      {data?.organization?.customFields?.length === 0 ? (
        <p>{t('noCustomField')}</p>
      ) : (
        <table className={styles.customDataTable}>
          <tbody>
            {data?.organization?.customFields?.map(
              (field: InterfaceCustomFieldData) => (
                <tr key={field.id}>
                  <td>{field.name}</td>
                  <td>{field.type}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => field.id && handleRemove(field.id)}
                      title={t('Remove Custom Field')}
                      data-testid="removeCustomFieldBtn"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
      <hr />
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
              onChange={(event) =>
                setCustomFieldData({
                  ...customFieldData,
                  name: event.target.value,
                })
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>

          <div className={styles.textBox}>
            <Form.Label className="text-secondary fw-bold">
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
            {tCommon('saveChanges')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrgProfileFieldSettings;
