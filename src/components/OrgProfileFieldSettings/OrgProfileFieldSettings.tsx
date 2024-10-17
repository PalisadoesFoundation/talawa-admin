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

/**
 * Interface for custom field data
 */
export interface InterfaceCustomFieldData {
  type: string;
  name: string;
}

/**
 * Component for managing organization profile field settings
 *
 * This component allows adding and removing custom fields for an organization.
 * It displays existing custom fields and provides a form to add new fields.
 *
 * @returns JSX.Element representing the organization profile field settings
 */
const OrgProfileFieldSettings = (): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgProfileField',
  });
  const { t: tCommon } = useTranslation('common');

  // State to hold the custom field data
  const [customFieldData, setCustomFieldData] =
    useState<InterfaceCustomFieldData>({
      type: '',
      name: '',
    });

  // Get the current organization ID from the URL parameters
  const { orgId: currentOrgId } = useParams();

  // Mutation to add a custom field
  const [addCustomField] = useMutation(ADD_CUSTOM_FIELD);

  // Mutation to remove a custom field
  const [removeCustomField] = useMutation(REMOVE_CUSTOM_FIELD);

  // Query to fetch custom fields for the organization
  const { loading, error, data, refetch } = useQuery(
    ORGANIZATION_CUSTOM_FIELDS,
    {
      variables: {
        customFieldsByOrganizationId: currentOrgId,
      },
    },
  );

  // Function to handle saving a new custom field
  const handleSave = async (): Promise<void> => {
    try {
      await addCustomField({
        variables: {
          organizationId: currentOrgId,
          ...customFieldData,
        },
      });
      toast.success(t('fieldSuccessMessage') as string);
      setCustomFieldData({ type: '', name: '' });
      refetch();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // Function to handle removing a custom field
  const handleRemove = async (customFieldId: string): Promise<void> => {
    try {
      await removeCustomField({
        variables: {
          organizationId: currentOrgId,
          customFieldId: customFieldId,
        },
      });

      toast.success(t('fieldRemovalSuccess') as string);
      refetch();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // Render loading or error messages if needed
  if (loading) return <p> {tCommon('loading')}</p>;
  if (error) return <p>{error.message} </p>;

  return (
    <div>
      {/* Display existing custom fields or a message if there are none */}
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
                index: number,
              ) => (
                <tr key={index}>
                  <td>{field.name}</td>
                  <td>{field.type}</td>
                  <td>
                    {/* Button to remove a custom field */}
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
              ),
            )}
          </tbody>
        </table>
      )}
      <hr />
      <div>
        <div>
          <div>
            {/* Form to add a new custom field */}
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
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSave();
                    }
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
                {tCommon('saveChanges')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgProfileFieldSettings;
