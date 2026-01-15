import React from 'react';
import { Form } from 'react-bootstrap';
import { Autocomplete, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { InterfaceCategorySelectorProps } from 'types/AdminPortal/CategorySelector/interface';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import styles from 'style/app-fixed.module.css';

/**
 * A dropdown selector for choosing an action item category.
 * Uses MUI Autocomplete for searchable category selection.
 *
 * @param props - Component props from InterfaceCategorySelectorProps
 * @returns Autocomplete dropdown for category selection
 */
const CategorySelector: React.FC<InterfaceCategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  return (
    <Form.Group className="d-flex gap-3 mb-3">
      <Autocomplete
        className={`${styles.noOutline} w-100`}
        data-testid="categorySelect"
        data-cy="categorySelect"
        options={categories}
        value={selectedCategory}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterSelectedOptions={true}
        getOptionLabel={(item: IActionItemCategoryInfo): string => item.name}
        onChange={(_, newCategory): void => {
          onCategoryChange(newCategory);
        }}
        renderInput={(params) => (
          <TextField {...params} label={t('actionItemCategory')} required />
        )}
      />
    </Form.Group>
  );
};

export default CategorySelector;
