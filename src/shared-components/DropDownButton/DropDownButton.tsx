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
 * @param showCaret - Whether to render the caret indicator (non-searchable mode).
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
import React, { useCallback, useMemo, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import type { InterfaceDropDownButtonProps } from 'types/shared-components/DropDownButton/interface';
import styles from './DropDownButton.module.css';
import { useTranslation } from 'react-i18next';
import SearchToggle from './SearchToggle';

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
  searchable = false,
  searchPlaceholder,
  showCaret = true,
}) => {
  const { t: tCommon } = useTranslation('common');
  const resolvedSearchPlaceholder =
    searchPlaceholder ?? tCommon('searchPlaceholder');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync searchTerm with selectedValue or initial implementation
  React.useEffect(() => {
    const selected = options.find((o) => o.value === (selectedValue ?? ''));
    if (selected && typeof selected.label === 'string') {
      setSearchTerm(selected.label);
    } else {
      setSearchTerm('');
    }
  }, [selectedValue, options]);

  const selected = options.find((o) => o.value === (selectedValue ?? ''));
  const displayLabel = buttonLabel || selected?.label || placeholder;

  const handleSelect = useCallback(
    (val: string) => {
      onSelect(val);
      setIsOpen(false);
      // Update local search term immediately for better UX
      const selectedOpt = options.find((o) => o.value === val);
      if (selectedOpt && typeof selectedOpt.label === 'string')
        setSearchTerm(selectedOpt.label);
    },
    [onSelect, options],
  );

  const filteredOptions = useMemo(
    () =>
      searchable
        ? options.filter((opt) => {
            if (typeof opt.label !== 'string') {
              return searchTerm.trim().length === 0;
            }
            return opt.label.toLowerCase().includes(searchTerm.toLowerCase());
          })
        : options,
    [searchable, options, searchTerm],
  );

  if (searchable) {
    return (
      <Dropdown
        drop={drop}
        show={isOpen}
        onToggle={(nextIsOpen, metadata) => {
          if (metadata.source === 'select' || metadata.source === 'rootClose') {
            setIsOpen(false);
            return;
          }
          setIsOpen(nextIsOpen);
        }}
        className={[
          styles.dropdownContainer,
          parentContainerStyle || '',
          isOpen ? styles.dropdownOpen : '',
        ].join(' ')}
        data-testid={`${dataTestIdPrefix}-container`}
      >
        <Dropdown.Toggle
          as={SearchToggle}
          id={id}
          variant={variant}
          disabled={disabled}
          // Pass props needed by SearchToggle
          value={searchTerm}
          // Type assertion needed: Dropdown.Toggle expects FormEventHandler,
          // but SearchToggle uses ChangeEventHandler for the input element
          onChange={
            ((e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }) as unknown as React.FormEventHandler<HTMLButtonElement>
          }
          onInputClick={() => setIsOpen(true)}
          placeholder={resolvedSearchPlaceholder}
          icon={icon}
          dataTestIdPrefix={dataTestIdPrefix}
          className={`${styles.dropdownToggle} ${btnStyle || ''}`}
        />

        <Dropdown.Menu
          role="listbox"
          aria-label={ariaLabel || tCommon('optionsSuffix')}
          className={`${styles.dropdownMenu} w-100`}
          data-testid={`${dataTestIdPrefix}-menu`}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <Dropdown.Item
                key={opt.value}
                role="option"
                aria-selected={opt.value === selectedValue}
                disabled={opt.disabled}
                className={[
                  styles.dropdownItem,
                  opt.value === selectedValue
                    ? styles.dropdownItemSelected
                    : '',
                  opt.disabled ? styles.dropdownItemDisabled : '',
                ].join(' ')}
                onClick={() => handleSelect(opt.value)}
                data-testid={`${dataTestIdPrefix}-item-${opt.value}`}
              >
                {opt.label}
              </Dropdown.Item>
            ))
          ) : (
            <div className="px-3 py-2 text-muted text-center">
              {tCommon('noOptionsFound')}
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

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
        {showCaret && <span className={styles.dropdownCaret}>▼</span>}
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
