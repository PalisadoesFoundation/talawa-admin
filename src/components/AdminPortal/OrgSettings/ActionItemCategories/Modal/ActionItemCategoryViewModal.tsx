/**
 * CategoryViewModal Component
 * Modal to display detailed view of an action item category
 */
import type { FC } from 'react';
import Button from 'shared-components/Button';
import { FormTextField } from 'shared-components/FormFieldGroup/FormFieldGroup';
import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import { useTranslation } from 'react-i18next';

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

  const modalFooter = (
    <Button
      variant="secondary"
      onClick={hide}
      data-testid="categoryViewModalCloseBtn"
    >
      {tCommon('close')}
    </Button>
  );

  return (
    <BaseModal
      open={isOpen}
      onClose={hide}
      title={t('categoryDetails')}
      customFooter={modalFooter}
      data-testId="categoryViewModal"
    >
      <form
        style={{
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Category Name */}
        <FormTextField
          name="categoryNameField"
          label={t('actionItemCategoryName')}
          value={category.name}
          disabled
          data-testid="categoryNameView"
        />

        {/* Category Description */}
        <FormTextField
          name="categoryDescriptionField"
          label={t('actionItemCategoryDescription')}
          value={category.description || t('noDescriptionProvided')}
          disabled
          data-testid="categoryDescriptionView"
        />

        {/* Status */}
        <FormTextField
          name="statusField"
          label={t('status')}
          value={category.isDisabled ? tCommon('disabled') : tCommon('active')}
          disabled
          data-testid="categoryStatusView"
        />
      </form>
    </BaseModal>
  );
};

export default CategoryViewModal;
