import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { InterfaceOrgSelectorProps } from '../../../types/Auth/OrgSelector/interface';
import styles from '../../../style/app-fixed.module.css';

/**
 * Reusable organization selector component with search/autocomplete and accessibility support.
 *
 * @remarks
 * This component provides a searchable dropdown for selecting an organization from a list.
 * It supports search/autocomplete, error display, required field indication, and proper
 * ARIA attributes for accessibility.
 *
 * @example
 * ```tsx
 * <OrgSelector
 *   options={organizations}
 *   value={selectedOrgId}
 *   onChange={handleOrgChange}
 *   error={orgError}
 *   required
 * />
 * ```
 */
export const OrgSelector: React.FC<InterfaceOrgSelectorProps> = ({
  options,
  value,
  onChange,
  error,
  testId,
  disabled = false,
  required = false,
  label,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSelector',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = !!error;
  const errorId = hasError ? 'org-selector-error' : undefined;
  const displayLabel = label || t('organization');

  // Filter organizations based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter((org) =>
      org.name.toLowerCase().includes(lowerSearch),
    );
  }, [options, searchTerm]);

  // Get selected organization name
  const selectedOrg = options.find((org) => org._id === value);
  const displayValue = selectedOrg?.name || '';

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = (): void => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (orgId: string): void => {
    onChange(orgId);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]._id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <Form.Group className="mb-3" ref={dropdownRef}>
      <Form.Label htmlFor="org-selector-input">
        {displayLabel}
        {required && <span className="text-danger"> *</span>}
      </Form.Label>

      <div className="position-relative">
        <Form.Control
          id="org-selector-input"
          type="text"
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          isInvalid={hasError}
          placeholder={t('selectOrganization')}
          aria-invalid={hasError}
          aria-describedby={errorId}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="org-selector-listbox"
          role="combobox"
          data-testid={testId}
          ref={inputRef}
          autoComplete="off"
        />

        {isOpen && !disabled && (
          <div
            id="org-selector-listbox"
            role="listbox"
            className={styles.orgSelectorDropdown}
            data-testid="org-selector-dropdown"
          >
            {filteredOptions.length === 0 ? (
              <div
                className={styles.orgSelectorNoResults}
                data-testid="org-selector-no-results"
              >
                {options.length === 0
                  ? t('noOrganizationsAvailable')
                  : t('noMatchingOrganizations')}
              </div>
            ) : (
              filteredOptions.map((org, index) => (
                <div
                  key={org._id}
                  role="option"
                  aria-selected={org._id === value}
                  className={`${styles.orgSelectorOption} ${
                    index === highlightedIndex
                      ? styles.orgSelectorOptionHighlighted
                      : ''
                  } ${org._id === value ? styles.orgSelectorOptionSelected : ''}`}
                  onClick={() => handleOptionClick(org._id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  data-testid={`org-option-${org._id}`}
                >
                  {org.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Error message with proper ARIA attributes */}
      {hasError && (
        <Form.Control.Feedback
          type="invalid"
          id={errorId}
          className="d-block"
          role="status"
          aria-live="polite"
        >
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default OrgSelector;
