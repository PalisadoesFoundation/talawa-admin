import React from 'react';
import type { SetStateAction, Dispatch } from 'react';
import { Dropdown } from 'react-bootstrap';
import availableFieldTypes from 'utils/fieldTypes';
import type { InterfaceCustomFieldData } from 'components/OrgProfileFieldSettings/OrgProfileFieldSettings';

interface InterfaceEditCustomFieldDropDownProps {
  customFieldData: InterfaceCustomFieldData;
  setCustomFieldData: Dispatch<SetStateAction<InterfaceCustomFieldData>>;
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
}
[];

const EditOrgCustomFieldDropDown = (
  props: InterfaceEditCustomFieldDropDownProps
): JSX.Element => {
  return (
    <Dropdown
      title="Edit Custom Field"
      className={`${props?.parentContainerStyle ?? ''}`}
    >
      <Dropdown.Toggle
        variant="outline-success"
        className={`${props?.btnStyle ?? ''}`}
      >
        {props.customFieldData.type || 'None'}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {availableFieldTypes.map((customFieldType, index: number) => (
          <Dropdown.Item
            key={`dropdown-item-${index}`}
            className={`dropdown-item`}
            onClick={(): void => {
              props.setCustomFieldData({
                ...props.customFieldData,
                type: customFieldType,
              });
            }}
            disabled={props.customFieldData.type == customFieldType}
          >
            {customFieldType}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default EditOrgCustomFieldDropDown;
