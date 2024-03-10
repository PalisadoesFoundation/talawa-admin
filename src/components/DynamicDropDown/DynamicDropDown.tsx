import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from './DynamicDropDown.module.css';

interface InterfaceChangeDropDownProps {
  parentContainerStyle?: string;
  btnStyle?: string;
  btnTextStyle?: string;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
  formState: any;
  fieldOptions: { value: string; label: string }[]; // Field options for dropdown
  fieldName: string; // Field name for labeling
}

const DynamicDropDown = (props: InterfaceChangeDropDownProps): JSX.Element => {
  const handleFieldChange = (value: string): void => {
    props.setFormState({ ...props.formState, [props.fieldName]: value });
  };

  const getLabel = (value: string): string => {
    const selectedOption = props.fieldOptions.find(
      (option) => option.value === value,
    );
    return selectedOption ? selectedOption.label : `None`;
  };

  return (
    <Dropdown
      title={`Select ${props.fieldName}`}
      className={`${props?.parentContainerStyle ?? ''} m-2`}
      data-testid={`${props.fieldName.toLowerCase()}-dropdown-container`}
    >
      <Dropdown.Toggle
        className={`${props?.btnStyle ?? ''} ${styles.dropwdownToggle}`}
        data-testid={`${props.fieldName.toLowerCase()}-dropdown-btn`}
      >
        {getLabel(props.formState[props.fieldName])}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {props.fieldOptions.map((option, index: number) => (
          <Dropdown.Item
            key={`${props.fieldName.toLowerCase()}-dropdown-item-${index}`}
            className={`dropdown-item`}
            onClick={() => handleFieldChange(option.value)}
            data-testid={`change-${props.fieldName.toLowerCase()}-btn-${option.value}`}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DynamicDropDown;
