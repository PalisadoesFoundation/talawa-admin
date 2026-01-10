/**
 * CategoryViewModal Component
 * Modal to display detailed view of an action item category
 */
import type { FC } from 'react';
import { Button, Form } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import type { IActionItemCategoryInfo } from 'types/shared-components/ActionItems/interface';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { FormControl, TextField } from '@mui/material';
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
      show={isOpen}
      onHide={hide}
      title={t('categoryDetails')}
      footer={modalFooter}
      dataTestId="categoryViewModal"
    >
      <Form className="p-3">
        {/* Category Name */}
        <Form.Group className="d-flex mb-3 w-100">
          <FormControl fullWidth>
            <TextField
              label={t('actionItemCategoryName')}
              variant="outlined"
              className={styles.noOutline}
              value={category.name}
              disabled
              data-testid="categoryNameView"
            />
          </FormControl>
        </Form.Group>

        {/* Category Description */}
        <Form.Group className="d-flex mb-3 w-100">
          <FormControl fullWidth>
            <TextField
              label={t('actionItemCategoryDescription')}
              variant="outlined"
              className={styles.noOutline}
              value={category.description || t('noDescriptionProvided')}
              disabled
              multiline
              rows={4}
              data-testid="categoryDescriptionView"
            />
          </FormControl>
        </Form.Group>

        {/* Status and Created Date */}
        <Form.Group className="d-flex gap-3 mb-3">
          {/* Status */}
          <TextField
            label={t('status')}
            fullWidth
            value={
              category.isDisabled ? tCommon('disabled') : tCommon('active')
            }
            InputProps={{
              startAdornment: (
                <Circle
                  sx={{
                    fontSize: '0.8rem',
                    color: category.isDisabled
                      ? 'var(--errorIcon-color)'
                      : 'var(--bs-success)',
                  }}
                  className="me-6"
                />
              ),
              style: {
                color: category.isDisabled
                  ? 'var(--errorIcon-color)'
                  : 'var(--bs-success)',
              },
            }}
            inputProps={{
              style: {
                WebkitTextFillColor: category.isDisabled
                  ? 'var(--errorIcon-color)'
                  : 'var(--bs-success)',
              },
            }}
            disabled
            data-testid="categoryStatusView"
          />
        </Form.Group>
      </Form>
    </BaseModal>
  );
};

export default CategoryViewModal;
