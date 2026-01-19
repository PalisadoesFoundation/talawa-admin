import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSelectField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import type { InterfaceCategorySelectorProps } from 'types/AdminPortal/CategorySelector/interface';

/**
 * A dropdown selector for choosing an action item category.
 * Uses Bootstrap FormSelectField for category selection.
 *
 * @param categories - List of available action item categories
 * @param selectedCategory - Currently selected category
 * @param onCategoryChange - Callback fired when category changes
 * @returns Select dropdown for category selection
 */
const CategorySelector: FC<InterfaceCategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  return (
    <div className="d-flex gap-3 mb-3">
      <FormSelectField
        name="categorySelect"
        label={t('actionItemCategory')}
        value={selectedCategory?.id || ''}
        onChange={(value): void => {
          const category = categories.find((cat) => cat.id === value) || null;
          onCategoryChange(category);
        }}
        required
        data-testid="categorySelect"
      >
        <option value="">{t('selectActionItemCategory')}</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </FormSelectField>
    </div>
  );
};

export default CategorySelector;
