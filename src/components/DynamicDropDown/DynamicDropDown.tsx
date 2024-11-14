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
 * @param handleChange - Optional callback function when selection changes
 * @returns JSX.Element - The rendered dropdown component.
 */
const DynamicDropDown = <T extends Record<string, unknown>>({
  parentContainerStyle = '',
  btnStyle = '',
  setFormState,
  formState,
  fieldOptions,
  fieldName,
  handleChange,
}: InterfaceChangeDropDownProps<T>): JSX.Element => {
  const handleFieldChange = (value: string): void => {
    if (handleChange) {
      const event = {
        target: {
          name: fieldName,
          value: value,
        },
      } as React.ChangeEvent<HTMLSelectElement>;
      handleChange(event);
    } else {
      setFormState({ ...formState, [fieldName]: value });
    }
  };

  const getLabel = (value: string): string => {
    const selectedOption = fieldOptions.find(
      (option) => option.value === value,
    );
    return selectedOption ? selectedOption.label : 'None';
  };

  return (
    <Dropdown
      title={`Select ${fieldName}`}
      className={`${parentContainerStyle ?? ''} m-2`}
      data-testid={`${fieldName.toLowerCase()}-dropdown-container`}
      aria-label={`Select ${fieldName}`}
    >
      <Dropdown.Toggle
        className={`${btnStyle ?? 'w-100'} ${styles.dropwdownToggle}`}
        data-testid={`${fieldName.toLowerCase()}-dropdown-btn`}
        aria-expanded="false"
      >
        {getLabel(formState[fieldName] as string)}
      </Dropdown.Toggle>
      <Dropdown.Menu
        data-testid={`${fieldName.toLowerCase()}-dropdown-menu`}
        role="listbox"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const focused = document.activeElement;
            if (focused instanceof HTMLElement) {
              focused.click();
            }
          }
        }}
      >
        {fieldOptions.map((option, index: number) => (
          <Dropdown.Item
            key={`${fieldName.toLowerCase()}-dropdown-item-${index}`}
            className="dropdown-item"
            onClick={() => handleFieldChange(option.value)}
            data-testid={`change-${fieldName.toLowerCase()}-btn-${option.value}`}
            role="option"
            aria-selected={option.value === formState[fieldName]}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DynamicDropDown;
