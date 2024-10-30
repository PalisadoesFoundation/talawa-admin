import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from './DynamicDropDown.module.css';

/**
 * Props for the DynamicDropDown component.
 */
interface InterfaceChangeDropDownProps<T> {
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
  setFormState: React.Dispatch<React.SetStateAction<T>>;
  formState: T;
  fieldOptions: { value: string; label: string }[];
  fieldName: string;
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DynamicDropDown = <T extends Record<string, any>>(
  props: InterfaceChangeDropDownProps<T>,
): JSX.Element => {
  const handleFieldChange = (value: string): void => {
    if (props?.handleChange) {
      const event = {
        target: {
          name: props?.fieldName,
          value: value,
        },
      } as React.ChangeEvent<HTMLSelectElement>;
      props?.handleChange(event);
    } else {
      props?.setFormState({ ...props?.formState, [props?.fieldName]: value });
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
    const selectedOption = props?.fieldOptions.find(
      (option) => option.value === value,
    );
    return selectedOption ? selectedOption.label : `None`;
  };

  return (
    <Dropdown
      title={`Select ${props?.fieldName}`}
      className={`${props?.parentContainerStyle ?? ''} m-2`}
      data-testid={`${props?.fieldName.toLowerCase()}-dropdown-container`}
    >
      <Dropdown.Toggle
        className={`${props?.btnStyle ?? 'w-100'} ${styles.dropwdownToggle}`}
        data-testid={`${props?.fieldName.toLowerCase()}-dropdown-btn`}
      >
        {getLabel(props?.formState[props?.fieldName])}
      </Dropdown.Toggle>
      <Dropdown.Menu
        data-testid={`${props?.fieldName.toLowerCase()}-dropdown-menu`}
      >
        {props?.fieldOptions.map((option, index: number) => (
          <Dropdown.Item
            key={`${props?.fieldName.toLowerCase()}-dropdown-item-${index}`}
            className={`dropdown-item`}
            onClick={() => handleFieldChange(option.value)}
            data-testid={`change-${props?.fieldName.toLowerCase()}-btn-${option.value}`}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DynamicDropDown;
