import React from 'react';
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
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps,
                'data-testid': 'orgInput',
              }}
              label={
                <>
                  {t('selectOrg')}
                  {required && <span className="text-danger"> *</span>}
                </>
              }
              required={required}
            />
          )}
        />
      </div>
    </div>
  );
};

export default OrganizationSelector;
