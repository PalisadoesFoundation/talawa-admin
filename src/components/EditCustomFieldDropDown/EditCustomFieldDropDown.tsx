/**
 * Component: EditOrgCustomFieldDropDown
 *
 * A dropdown component for editing the type of a custom field in an organization profile.
 * It allows users to select a field type from a predefined list of available field types.
 *
 * @param props - The props for the component.
 * - customFieldData - The current custom field data object.
 * - setCustomFieldData - A state setter function to update the custom field data.
 * - parentContainerStyle - Optional CSS class for the parent container.
 * - btnStyle - Optional CSS class for the dropdown button.
 *
 * @returns - The rendered dropdown component.
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
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

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
  const { t: tErrors } = useTranslation('errors');

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <Dropdown
        title={t('editCustomField')}
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
    </ErrorBoundaryWrapper>
  );
};

export default EditOrgCustomFieldDropDown;
