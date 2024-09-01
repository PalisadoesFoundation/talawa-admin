import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from './DynamicDropDown.module.css';

/**
 * Props for the DynamicDropDown component.
 */
interface InterfaceChangeDropDownProps {
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
  formState: any;
  fieldOptions: { value: string; label: string }[]; // Field options for dropdown
  fieldName: string; // Field name for labeling
}

/**
 * A dynamic dropdown component that allows users to select an option.
 *
 * This component renders a dropdown with a toggle button. Clicking the button
 * opens a menu with options. When an option is selected, it updates the form state.
 *
 * @param parentContainerStyle - Optional CSS class for styling the container.
 * @param btnStyle - Optional CSS class for styling the dropdown button.
 * @param setFormState - Function to update the form state with the selected option.
 * @param formState - Current state of the form, used to determine the selected value.
 * @param fieldOptions - Options to display in the dropdown. Each option has a value and a label.
 * @param fieldName - The name of the field, used for labeling and key identification.
 * @returns JSX.Element - The rendered dropdown component.
 */
const DynamicDropDown = ({
  parentContainerStyle = '',
  btnStyle = '',
  setFormState,
  formState,
  fieldOptions,
  fieldName,
}: InterfaceChangeDropDownProps): JSX.Element => {
  /**
   * Updates the form state when a dropdown option is selected.
   *
   * @param value - The value of the selected option.
   */
  const handleFieldChange = (value: string): void => {
    setFormState({ ...formState, [fieldName]: value });
  };

  /**
   * Retrieves the label for a given value from the options.
   *
   * @param value - The value for which to get the label.
   * @returns The label corresponding to the value, or 'None' if not found.
   */
  const getLabel = (value: string): string => {
    const selectedOption = fieldOptions.find(
      (option) => option.value === value,
    );
    return selectedOption ? selectedOption.label : `None`;
  };

  return (
    <Dropdown
      title={`Select ${fieldName}`}
      className={`${parentContainerStyle} m-2`}
      data-testid={`${fieldName.toLowerCase()}-dropdown-container`}
    >
      <Dropdown.Toggle
        className={`${btnStyle} ${styles.dropwdownToggle}`}
        data-testid={`${fieldName.toLowerCase()}-dropdown-btn`}
      >
        {getLabel(formState[fieldName])}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {fieldOptions.map((option, index: number) => (
          <Dropdown.Item
            key={`${fieldName.toLowerCase()}-dropdown-item-${index}`}
            className={`dropdown-item`}
            onClick={() => handleFieldChange(option.value)}
            data-testid={`change-${fieldName.toLowerCase()}-btn-${option.value}`}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DynamicDropDown;
