/**
 * DropDownButton Component
 *
 * A reusable dropdown button component built with React and React-Bootstrap.
 * It supports various styles, icons, and accessibility features.
 *
 * @param id - The id of the dropdown button.
 * @param options - The options to be displayed in the dropdown.
 * @param selectedValue - The currently selected value.
 * @param onSelect - Callback function when an option is selected.
 * @param ariaLabel - ARIA label for accessibility.
 * @param dataTestIdPrefix - Data test id prefix for testing purposes.
 * @param variant - The variant/style of the button.
 * @param buttonLabel - The label of the button.
 * @param icon - The icon to be displayed on the button.
 * @param disabled - Whether the dropdown button is disabled.
 * @param placeholder - Placeholder text when no option is selected.
 * @param parentContainerStyle - Additional styles for the parent container.
 * @param btnStyle - Additional styles for the dropdown button.
 *
 * @returns A DropDownButton component.
 *
 * @example
 * ```
 * <DropDownButton
 *  id="example-dropdown"
 *  options={[{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]}
 * selectedValue="1"
 * onSelect={(val) => console.log(val)}
 * ariaLabel="Example Dropdown"
 * dataTestIdPrefix="example-dropdown"
 * variant="primary"
 * buttonLabel="Select an Option"
 * icon={<SomeIcon />}
 * disabled={false}
 * placeholder="Choose..."
 * parentContainerStyle="custom-container-style"
 * btnStyle="custom-button-style"
 * />
 * ```
 * @remarks
 * This component leverages React-Bootstrap for styling and functionality.
 * It is designed to be accessible and customizable for various use cases.
 * Ensure to pass appropriate props for optimal usage.
 *
 */
import React, { useCallback, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import type { InterfaceDropDownButtonProps } from 'types/shared-components/DropDownButton/interface';
import styles from './DropDownButton.module.css';
import { useTranslation } from 'react-i18next';

const DropDownButton: React.FC<InterfaceDropDownButtonProps> = ({
  id,
  options,
  selectedValue,
  onSelect,
  ariaLabel,
  dataTestIdPrefix = 'dropdown',
  variant = 'outline-success',
  buttonLabel,
  icon,
  disabled = false,
  drop,
  // i18n-ignore-next-line
  placeholder = 'Select an option',
  parentContainerStyle,
  btnStyle,
}) => {
  const { t: tCommon } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o) => o.value === (selectedValue ?? ''));
  const displayLabel = buttonLabel || selected?.label || placeholder;

  const handleSelect = useCallback((val: string) => onSelect(val), [onSelect]);

  return (
    <Dropdown
      drop={drop}
      onToggle={setIsOpen}
      className={[
        styles.dropdownContainer,
        parentContainerStyle || '',
        isOpen ? styles.dropdownOpen : '',
      ].join(' ')}
      data-testid={`${dataTestIdPrefix}-container`}
    >
      <Dropdown.Toggle
        id={id}
        variant={variant}
        disabled={disabled}
        className={[styles.dropdownToggle, btnStyle || ''].join(' ')}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        data-testid={`${dataTestIdPrefix}-toggle`}
      >
        {icon && (
          <span
            className={styles.dropdownIcon}
            data-testid={`${dataTestIdPrefix}-icon`}
          >
            {icon}
          </span>
        )}
        <span className={styles.buttonLabel}>{displayLabel}</span>
        <span className={styles.dropdownCaret}>▼</span>
      </Dropdown.Toggle>
      <Dropdown.Menu
        role="listbox"
        aria-label={
          ariaLabel
            ? `${ariaLabel} ${tCommon('optionsSuffix')}`
            : tCommon('optionsSuffix')
        }
        className={styles.dropdownMenu}
        data-testid={`${dataTestIdPrefix}-menu`}
      >
        {options.map((opt) => (
          <Dropdown.Item
            key={opt.value}
            role="option"
            aria-selected={opt.value === selectedValue}
            disabled={opt.disabled}
            className={[
              styles.dropdownItem,
              opt.value === selectedValue ? styles.dropdownItemSelected : '',
              opt.disabled ? styles.dropdownItemDisabled : '',
            ].join(' ')}
            onClick={() => handleSelect(opt.value)}
            data-testid={`${dataTestIdPrefix}-item-${opt.value}`}
          >
            {opt.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default DropDownButton;
