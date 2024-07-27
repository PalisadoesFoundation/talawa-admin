import React from 'react';
import type { SetStateAction, Dispatch } from 'react';
import { Dropdown } from 'react-bootstrap';
import availableFieldTypes from 'utils/fieldTypes';
import type { InterfaceCustomFieldData } from 'components/OrgProfileFieldSettings/OrgProfileFieldSettings';
import { useTranslation } from 'react-i18next';

interface InterfaceEditCustomFieldDropDownProps {
  customFieldData: InterfaceCustomFieldData;
  setCustomFieldData: Dispatch<SetStateAction<InterfaceCustomFieldData>>;
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
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
