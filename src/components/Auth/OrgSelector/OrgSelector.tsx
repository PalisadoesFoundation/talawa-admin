import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { InterfaceOrgSelectorProps } from '../../../types/Auth/OrgSelector/interface';

/**
 * Reusable organization selector component with validation and accessibility support.
 *
 * @remarks
 * This component provides a dropdown for selecting an organization from a list.
 * It supports error display, required field indication, and proper ARIA attributes
 * for accessibility.
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

  const hasError = !!error;
  const errorId = hasError ? 'org-selector-error' : undefined;
  const displayLabel = label || t('organization');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.target.value);
  };

  return (
    <Form.Group className="mb-3" controlId="org-selector">
      <Form.Label>
        {displayLabel}
        {required && <span className="text-danger"> *</span>}
      </Form.Label>

      <Form.Select
        value={value ?? ''}
        onChange={handleChange}
        disabled={disabled}
        isInvalid={hasError}
        aria-invalid={hasError}
        aria-describedby={errorId}
        data-testid={testId}
      >
        <option value="" disabled>
          {t('selectOrganization')}
        </option>
        {options.length === 0 ? (
          <option value="" disabled>
            {t('noOrganizationsAvailable')}
          </option>
        ) : (
          options.map((org) => (
            <option key={org._id} value={org._id}>
              {org.name}
            </option>
          ))
        )}
      </Form.Select>

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
