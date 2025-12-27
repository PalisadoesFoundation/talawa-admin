/**
 * Component: EditOrgCustomFieldDropDown
 *
 * A dropdown component for editing the type of a custom field in an organization profile.
 * It allows users to select a field type from a predefined list of available field types.
 *
 * @param {InterfaceEditCustomFieldDropDownProps} props - The props for the component.
 * @param {InterfaceCustomFieldData} props.customFieldData - The current custom field data object.
 * @param {Dispatch<SetStateAction<InterfaceCustomFieldData>>} props.setCustomFieldData -
 * A state setter function to update the custom field data.
 * @param {string} [props.parentContainerStyle] - Optional CSS class for the parent container.
 * @param {string} [props.btnStyle] - Optional CSS class for the dropdown button.
 *
 * @returns {JSX.Element} The rendered dropdown component.
 *
 * @remarks
 * - The component uses `react-bootstrap` for the dropdown UI.
 * - The `useTranslation` hook from `react-i18next` is used for internationalization.
 * - The dropdown items are dynamically generated based on the `availableFieldTypes` array.
 * - The currently selected field type is disabled in the dropdown to prevent re-selection.
 *
 * @example
 * ```tsx
 * <EditOrgCustomFieldDropDown
 *   customFieldData={customFieldData}
 *   setCustomFieldData={setCustomFieldData}
 *   parentContainerStyle="custom-container"
 *   btnStyle="custom-button"
 * />
 * ```
 */
import React from 'react';
import type { SetStateAction, Dispatch } from 'react';
import { Dropdown } from 'react-bootstrap';
import availableFieldTypes from 'utils/fieldTypes';
import { useTranslation } from 'react-i18next';
import type { InterfaceCustomFieldData } from 'utils/interfaces';
import type { InterfaceDropDownProps } from 'types/DropDown/interface';

interface InterfaceEditCustomFieldDropDownProps extends InterfaceDropDownProps {
  customFieldData: InterfaceCustomFieldData;
  setCustomFieldData: Dispatch<SetStateAction<InterfaceCustomFieldData>>;
}

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
      title={t('editCustomField') as string}
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
