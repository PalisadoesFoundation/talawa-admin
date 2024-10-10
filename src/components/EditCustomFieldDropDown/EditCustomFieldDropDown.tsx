import React from 'react';
import type { SetStateAction, Dispatch } from 'react';
import { Dropdown } from 'react-bootstrap';
import availableFieldTypes from 'utils/fieldTypes';
import type { InterfaceCustomFieldData } from 'components/OrgProfileFieldSettings/OrgProfileFieldSettings';
import { useTranslation } from 'react-i18next';

/**
 * Props for the EditOrgCustomFieldDropDown component.
 */
interface InterfaceEditCustomFieldDropDownProps {
  customFieldData: InterfaceCustomFieldData;
  setCustomFieldData: Dispatch<SetStateAction<InterfaceCustomFieldData>>;
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
}

/**
 * A dropdown component for editing custom field types.
 *
 * This component displays a dropdown menu that allows users to select a custom field type.
 * It shows the current type of the field and provides a list of available types to choose from.
 * When a new type is selected, it updates the custom field data.
 *
 * @param customFieldData - The current data of the custom field being edited.
 * @param setCustomFieldData - Function to update the custom field data with the new type.
 * @param parentContainerStyle - Optional CSS class to style the container of the dropdown.
 * @param btnStyle - Optional CSS class to style the dropdown button.
 * @param btnTextStyle - Optional CSS class to style the text inside the button.
 * @returns JSX.Element - The rendered dropdown component.
 */
const EditOrgCustomFieldDropDown = ({
  customFieldData,
  setCustomFieldData,
  parentContainerStyle,
  btnStyle,
}: InterfaceEditCustomFieldDropDownProps): JSX.Element => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgProfileField',
  });
  const { t: tCommon } = useTranslation('common');

  return (
    <Dropdown
      title="Edit Custom Field"
      className={`${parentContainerStyle ?? ''}`}
    >
      <Dropdown.Toggle
        variant="outline-success"
        className={`${btnStyle ?? ''}`}
        data-testid="toggleBtn"
      >
        {customFieldData.type ? t(customFieldData.type) : tCommon('none')}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {availableFieldTypes.map((customFieldType, index: number) => (
          <Dropdown.Item
            key={`dropdown-item-${index}`}
            className="dropdown-item"
            data-testid={`dropdown-btn-${index}`}
            onClick={(): void => {
              setCustomFieldData({
                ...customFieldData,
                type: customFieldType,
              });
            }}
            disabled={customFieldData.type === customFieldType}
          >
            {t(customFieldType)}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default EditOrgCustomFieldDropDown;
