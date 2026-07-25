/**
 * DropDownButton Component
 *
 * A reusable dropdown button component built with React.
 * It supports various styles, icons, and accessibility features.
 */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { InterfaceDropDownButtonProps } from 'types/shared-components/DropDownButton/interface';
import styles from './DropDownButton.module.css';
import { useTranslation } from 'react-i18next';
import SearchToggle from './SearchToggle';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltOutlined from '@mui/icons-material/FilterAltOutlined';

const DropDownButton: React.FC<InterfaceDropDownButtonProps> = ({
  id,
  options,
  selectedValue,
  onSelect,
  ariaLabel,
  dataTestIdPrefix = 'dropdown',
  buttonLabel,
  icon,
  disabled = false,
  // i18n-ignore-next-line
  placeholder = 'Select an option',
  parentContainerStyle,
  btnStyle,
  searchable = false,
  searchPlaceholder,
  showCaret = true,
  menuClassName,
  containerClassName,
  toggleClassName,
  type,
}) => {
  const { t: tCommon } = useTranslation('common');
  const resolvedSearchPlaceholder =
    searchPlaceholder ?? tCommon('searchPlaceholder');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync searchTerm with selectedValue
  useEffect(() => {
    const selected = options.find((o) => o.value === (selectedValue ?? ''));
    if (selected && typeof selected.label === 'string') {
      setSearchTerm(selected.label);
    } else {
      setSearchTerm('');
    }
  }, [selectedValue, options]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === (selectedValue ?? ''));
  const displayLabel = buttonLabel || selected?.label || placeholder;

  const handleSelect = useCallback(
    (val: string) => {
      onSelect(val);
      setIsOpen(false);
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
      <div
        ref={containerRef}
        className={[
          styles.dropdownContainer,
          parentContainerStyle || '',
          containerClassName || '',
          isOpen ? styles.dropdownOpen : '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-testid={`${dataTestIdPrefix}-container`}
        style={{ position: 'relative' }}
      >
        <SearchToggle
          onClick={() => setIsOpen(!isOpen)}
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onInputClick={() => setIsOpen(true)}
          placeholder={resolvedSearchPlaceholder}
          icon={icon}
          dataTestIdPrefix={dataTestIdPrefix}
          className={[
            styles.dropdownToggle,
            btnStyle || '',
            toggleClassName || '',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {isOpen && (
          <div
            role="listbox"
            aria-label={ariaLabel || tCommon('optionsSuffix')}
            className={`${styles.dropdownMenu} ${menuClassName || ''}`}
            data-testid={`${dataTestIdPrefix}-menu`}
            style={{ position: 'absolute', width: '100%', zIndex: 1000 }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === selectedValue}
                  className={[
                    styles.dropdownItem,
                    opt.value === selectedValue
                      ? styles.dropdownItemSelected
                      : '',
                    opt.disabled ? styles.dropdownItemDisabled : '',
                  ].join(' ')}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  data-testid={`${dataTestIdPrefix}-item-${opt.value}`}
                  style={{ cursor: opt.disabled ? 'default' : 'pointer' }}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: '0.5rem 1rem',
                  textAlign: 'center',
                  color: 'var(--gray-500)',
                }}
              >
                {tCommon('noOptionsFound')}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={[
        styles.dropdownContainer,
        parentContainerStyle || '',
        containerClassName || '',
        isOpen ? styles.dropdownOpen : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid={`${dataTestIdPrefix}-container`}
      style={{ position: 'relative' }}
    >
      <button
        type="button"
        id={id}
        disabled={disabled}
        className={[
          styles.dropdownToggle,
          btnStyle || '',
          toggleClassName || '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`${dataTestIdPrefix}-toggle`}
      >
        {(icon || type) && (
          <span
            className={styles.dropdownIcon}
            data-testid={`${dataTestIdPrefix}-icon`}
          >
            {icon ||
              (type === 'filter' ? (
                <FilterAltOutlined
                  data-testid="filter-icon"
                  aria-hidden="true"
                />
              ) : (
                <SortIcon data-testid="sort-icon" aria-hidden="true" />
              ))}
          </span>
        )}
        <span className={styles.buttonLabel}>{displayLabel}</span>
        {showCaret && <span className={styles.dropdownCaret}>&#9660;</span>}
      </button>
      {isOpen && (
        <div
          role="listbox"
          aria-label={
            ariaLabel
              ? `${ariaLabel} ${tCommon('optionsSuffix')}`
              : tCommon('optionsSuffix')
          }
          className={`${styles.dropdownMenu} ${menuClassName || ''}`}
          data-testid={`${dataTestIdPrefix}-menu`}
          style={{ position: 'absolute', zIndex: 1000 }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === selectedValue}
              className={[
                styles.dropdownItem,
                opt.value === selectedValue ? styles.dropdownItemSelected : '',
                opt.disabled ? styles.dropdownItemDisabled : '',
              ].join(' ')}
              onClick={() => !opt.disabled && handleSelect(opt.value)}
              data-testid={`${dataTestIdPrefix}-item-${opt.value}`}
              style={{ cursor: opt.disabled ? 'default' : 'pointer' }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default DropDownButton;
