/**
 * CategoryViewModal Component
 * Modal to display detailed view of an action item category
 */
import type { FC } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, Modal } from 'react-bootstrap';
import type { IActionItemCategoryInfo } from 'types/ActionItems/interface';
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

  return (
    <Modal className={styles.itemModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('categoryDetails')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.closeButton}
          data-testid="categoryViewModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
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
                value={category.description || 'No description provided'}
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
                      color: category.isDisabled ? '#ff5252' : '#4caf50',
                      marginRight: '8px',
                    }}
                  />
                ),
                style: {
                  color: category.isDisabled ? '#ff5252' : '#4caf50',
                },
              }}
              inputProps={{
                style: {
                  WebkitTextFillColor: category.isDisabled
                    ? '#ff5252'
                    : '#4caf50',
                },
              }}
              disabled
              data-testid="categoryStatusView"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryViewModal;
