/**
 * CategoryViewModal Component
 * Modal to display detailed view of an action item category
 */
import type { FC } from 'react';
import { ViewModal } from 'shared-components/CRUDModalTemplate';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import appStyles from 'style/app-fixed.module.css';
import styles from './ActionItemCategoryViewModal.module.css';
import { useTranslation } from 'react-i18next';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { Circle } from '@mui/icons-material';

export interface ICategoryViewModalProps {
  isOpen: boolean;
  hide: () => void;
  category: IActionItemCategoryInfo | null;
}

const CategoryViewModal: FC<ICategoryViewModalProps> = ({
  isOpen,
  hide,
  category,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgActionItemCategories',
  });
  const { t: tCommon } = useTranslation('common');

  if (!category) return null;

  return (
    <ViewModal
      open={isOpen}
      onClose={hide}
      title={t('categoryDetails')}
      data-testid="categoryViewModal"
    >
      <div className="p-3">
        {/* Category Name */}
        <FormTextField
          name="categoryName"
          label={t('actionItemCategoryName')}
          value={category.name}
          disabled
          className={appStyles.noOutline}
          data-testid="categoryNameView"
        />

        {/* Category Description */}
        <FormTextField
          name="categoryDescription"
          label={t('actionItemCategoryDescription')}
          value={category.description || t('noDescriptionProvided')}
          disabled
          as="textarea"
          rows={4}
          className={appStyles.noOutline}
          data-testid="categoryDescriptionView"
        />

        {/* Status */}
        <FormFieldGroup name="categoryStatus" label={t('status')}>
          <FormTextField
            name="status"
            label={t('status')}
            hideLabel
            value={
              category.isDisabled ? tCommon('disabled') : tCommon('active')
            }
            startAdornment={
              <Circle
                className={`${styles.statusCircle} ${
                  category.isDisabled
                    ? styles.statusDisabled
                    : styles.statusActive
                }`}
              />
            }
            disabled
            data-testid="categoryStatusView"
          />
        </FormFieldGroup>
      </div>
    </ViewModal>
  );
};

export default CategoryViewModal;
