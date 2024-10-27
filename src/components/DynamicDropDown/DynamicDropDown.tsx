import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from './DynamicDropDown.module.css';

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
  };

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
