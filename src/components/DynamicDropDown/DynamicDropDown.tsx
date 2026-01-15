/**
 * A reusable dynamic dropdown component built using React and React-Bootstrap.
 * This component allows for dynamic field selection and state management.
 *
/**
 * T - A generic type extending `Record<string, unknown>` to represent the form state.
 *
 * @param parentContainerStyle - Optional CSS class for the parent container of the dropdown.
 * @param btnStyle - Optional CSS class for the dropdown button.
 * @param setFormState - A state setter function to update the form state.
 * @param formState - The current state of the form.
 * @param fieldOptions - An array of objects representing the dropdown options,
 * each containing a `value` and `label`.
 * @param fieldName - The name of the field being represented by the dropdown.
 * @param handleChange - Optional custom change handler for the dropdown selection.
 *
 * @returns A JSX.Element representing the dropdown component.
 *
 * @remarks
 * - If `handleChange` is provided, it will be called with a synthetic change event
 *   when an option is selected. Otherwise, the `setFormState` function will be used
 *   to update the form state directly.
 * - The dropdown button displays the label of the currently selected option,
 *   or "None" if no option is selected.
 * - Keyboard accessibility is supported for navigating and selecting options.
 *
 * @example
 * ```tsx
 * const [formState, setFormState] = useState({ category: '' });
 * const options = [
 *   { value: '1', label: 'Option 1' },
 *   { value: '2', label: 'Option 2' },
 * ];
 *
 * <DynamicDropDown
 *   fieldName="category"
 *   fieldOptions={options}
 *   formState={formState}
 *   setFormState={setFormState}
 * />
 * ```
 */
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import styles from 'style/app-fixed.module.css';
import type { InterfaceDropDownProps } from 'types/DropDown/interface';

interface InterfaceChangeDropDownProps<T> extends InterfaceDropDownProps {
  setFormState: React.Dispatch<React.SetStateAction<T>>;
  formState: T;
  fieldOptions: { value: string; label: string }[];
  fieldName: string;
  handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DynamicDropDown = <T extends Record<string, unknown>>({
  parentContainerStyle = '',
  btnStyle = '',
  setFormState,
  formState,
  fieldOptions,
  fieldName,
  handleChange,
}: InterfaceChangeDropDownProps<T>): JSX.Element => {
  const { t: tErrors } = useTranslation('errors');
  const { t: tCommon } = useTranslation('common');
  const handleFieldChange = (value: string): void => {
    if (handleChange) {
      const event = {
        target: { name: fieldName, value: value },
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
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <Dropdown
        title={tCommon('selectField', { fieldName: fieldName })}
        className={`${parentContainerStyle ?? ''} m-2`}
        data-testid={`${fieldName.toLowerCase()}-dropdown-container`}
        aria-label={tCommon('selectField', { fieldName: fieldName })}
      >
        <Dropdown.Toggle
          className={`${btnStyle ?? 'w-100'} ${styles.dropwdownToggle}`}
          data-testid={`${fieldName.toLowerCase()}-dropdown-btn`}
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
    </ErrorBoundaryWrapper>
  );
};

export default DynamicDropDown;
