import React from 'react';
import { Form } from 'react-bootstrap';
import { Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InterfaceOrganizationSelectorProps } from 'types/OrganizationSelector/interface';

/**
 * OrganizationSelector Component
 *
 * Autocomplete selector for choosing an organization
 *
 * @param {InterfaceOrganizationSelectorProps} props - Component props
 * @returns {JSX.Element} The rendered organization selector
 *
 * @example
 * <OrganizationSelector
 *   organizations={orgs}
 *   value={selectedOrg}
 *   onChange={setSelectedOrg}
 *   required={true}
 * />
 */
const OrganizationSelector: React.FC<InterfaceOrganizationSelectorProps> = ({
  organizations,
  value,
  onChange,
  disabled = false,
  required = false,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'loginPage' });

  const selectedOrg = organizations.find((org) => org.id === value) || null;

  return (
    <div className="position-relative my-2">
      <Form.Label>
        {t('selectOrg')}
        {required && <span className="text-danger"> *</span>}
      </Form.Label>
      <div className="position-relative">
        <Autocomplete
          disablePortal
          data-testid="selectOrg"
          value={selectedOrg}
          onChange={(event, newValue) => {
            onChange(newValue?.id ?? '');
          }}
          options={organizations}
          disabled={disabled}
          renderInput={(params) => (
            <TextField {...params} label={t('selectOrg')} required={required} />
          )}
        />
      </div>
    </div>
  );
};

export default OrganizationSelector;
