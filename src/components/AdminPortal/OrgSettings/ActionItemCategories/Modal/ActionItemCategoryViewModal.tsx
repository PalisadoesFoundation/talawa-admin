/**
 * CategoryViewModal Component
 * Modal to display detailed view of an action item category
 */
import type { FC } from 'react';
import Button from 'shared-components/Button';
import {
  FormFieldGroup,
  FormTextField,
} from 'shared-components/FormFieldGroup/FormFieldGroup';
import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import { useTranslation } from 'react-i18next';
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
      <form className="p-3">
        {/* Category Name */}

        {/* Category Name */}
        <FormFieldGroup
          name="categoryName"
          label={t('actionItemCategoryName')}
          disabled
        >
          <FormTextField
            name="categoryNameField"
            label={t('actionItemCategoryName')}
            value={category.name}
            disabled
            data-testid="categoryNameView"
          />
        </FormFieldGroup>

        {/* Category Description */}
        <FormFieldGroup
          name="categoryDescription"
          label={t('actionItemCategoryDescription')}
          disabled
        >
          <FormTextField
            name="categoryDescriptionField"
            label={t('actionItemCategoryDescription')}
            value={category.description || t('noDescriptionProvided')}
            disabled
            data-testid="categoryDescriptionView"
          />
        </FormFieldGroup>

        {/* Status */}
        <FormFieldGroup name="status" label={t('status')} disabled>
          <FormTextField
            name="statusField"
            label={t('status')}
            value={
              category.isDisabled ? tCommon('disabled') : tCommon('active')
            }
            startAdornment={
              <Circle
                sx={{
                  fontSize: 'var(--font-size-sm)',
                  color: category.isDisabled
                    ? 'var(--errorIcon-color)'
                    : 'var(--bs-success)',
                }}
                className="me-2"
              />
            }
            disabled
            data-testid="categoryStatusView"
          />
        </FormFieldGroup>
      </form>
    </BaseModal>
  );
};

export default CategoryViewModal;
