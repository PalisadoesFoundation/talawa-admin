import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceActionItemInfo } from 'utils/interfaces';
import styles from './OrganizationActionItems.module.css';
import { useTranslation } from 'react-i18next';
import { FormControl, TextField } from '@mui/material';
import { TaskAlt, HistoryToggleOff } from '@mui/icons-material';
import Avatar from 'components/Avatar/Avatar';

export interface InterfaceViewModalProps {
  isOpen: boolean;
  hide: () => void;
  item: InterfaceActionItemInfo;
}

/**
 * A modal dialog for viewing action item details.
 *
 * @param isOpen - Indicates whether the modal is open.
 * @param hide - Function to close the modal.
 * @param item - The action item object to be displayed.
 *
 * @returns The rendered modal component.
 *
 * The `ItemViewModal` component displays all the fields of an action item in a modal dialog.
 * It includes fields for assignee, assigner, category, pre and post completion notes, assignment date, due date, completion date, and event.
 */

const ItemViewModal: FC<InterfaceViewModalProps> = ({ isOpen, hide, item }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  const {
    actionItemCategory,
    assignee,
    assigner,
    completionDate,
    dueDate,
    isCompleted,
    postCompletionNotes,
    preCompletionNotes,
    allotedHours,
  } = item;

  return (
    <Modal className={styles.itemModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('actionItemDetails')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.modalCloseBtn}
          data-testid="modalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form className="p-3">
          <Form.Group className="d-flex mb-3 w-100">
            <FormControl fullWidth>
              <TextField
                label={t('category')}
                variant="outlined"
                className={styles.noOutline}
                value={actionItemCategory?.name}
                disabled
              />
            </FormControl>
          </Form.Group>
          <Form.Group className="d-flex gap-3 mb-3">
            <FormControl fullWidth>
              <TextField
                label={t('assignee')}
                variant="outlined"
                className={styles.noOutline}
                value={assignee.firstName + ' ' + assignee.lastName}
                disabled
                InputProps={{
                  startAdornment: (
                    <>
                      {assignee.image ? (
                        <img
                          src={assignee.image}
                          alt="Assignee"
                          data-testid={`${assignee.firstName}_image`}
                          className={styles.TableImage}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={assignee._id + '1'}
                            containerStyle={styles.imageContainer}
                            avatarStyle={styles.TableImage}
                            dataTestId={`${assignee.firstName}_avatar`}
                            name={assignee.firstName + ' ' + assignee.lastName}
                            alt={assignee.firstName + ' ' + assignee.lastName}
                          />
                        </div>
                      )}
                    </>
                  ),
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label={t('assigner')}
                variant="outlined"
                className={styles.noOutline}
                value={assigner?.firstName + ' ' + assigner?.lastName}
                disabled
                InputProps={{
                  startAdornment: (
                    <>
                      {assigner.image ? (
                        <img
                          src={assigner.image}
                          alt="Assignee"
                          data-testid={`${assigner.firstName}_image`}
                          className={styles.TableImage}
                        />
                      ) : (
                        <div className={styles.avatarContainer}>
                          <Avatar
                            key={assigner._id + '1'}
                            containerStyle={styles.imageContainer}
                            avatarStyle={styles.TableImage}
                            dataTestId={`${assigner.firstName}_avatar`}
                            name={assigner.firstName + ' ' + assigner.lastName}
                            alt={assigner.firstName + ' ' + assigner.lastName}
                          />
                        </div>
                      )}
                    </>
                  ),
                }}
              />
            </FormControl>
          </Form.Group>
          <Form.Group className="d-flex gap-3 mx-auto mb-3">
            {/* Status of Action Item */}
            <TextField
              label={t('status')}
              fullWidth
              value={isCompleted ? tCommon('completed') : tCommon('pending')}
              InputProps={{
                startAdornment: (
                  <>
                    {isCompleted ? (
                      <TaskAlt color="success" className="me-2" />
                    ) : (
                      <HistoryToggleOff color="warning" className="me-2" />
                    )}
                  </>
                ),
                style: {
                  color: isCompleted ? 'green' : '#ed6c02',
                },
              }}
              inputProps={{
                style: {
                  WebkitTextFillColor: isCompleted ? 'green' : '#ed6c02',
                },
              }}
              disabled
            />

            <TextField
              label={t('allotedHours')}
              variant="outlined"
              className={`${styles.noOutline} w-100`}
              value={allotedHours ?? '-'}
              disabled
            />
          </Form.Group>
          <Form.Group className={`d-flex gap-3 mb-3`}>
            {/* Date Calendar Component to display due date of Action Item */}
            <DatePicker
              format="DD/MM/YYYY"
              label={t('dueDate')}
              className={`${styles.noOutline} w-100`}
              value={dayjs(dueDate)}
              disabled
            />

            {/* Date Calendar Component to display completion Date of Action Item */}
            {isCompleted && (
              <DatePicker
                format="DD/MM/YYYY"
                label={t('completionDate')}
                className={`${styles.noOutline} w-100`}
                value={dayjs(completionDate)}
                disabled
              />
            )}
          </Form.Group>
          <Form.Group className={`d-flex ${isCompleted && 'mb-3'}`}>
            <FormControl fullWidth>
              <TextField
                label={t('preCompletionNotes')}
                variant="outlined"
                className={styles.noOutline}
                value={preCompletionNotes}
                multiline
                maxRows={3}
                disabled
              />
            </FormControl>
          </Form.Group>
          {isCompleted && (
            <FormControl fullWidth>
              <TextField
                label={t('postCompletionNotes')}
                className={styles.noOutline}
                value={postCompletionNotes}
                multiline
                maxRows={3}
                disabled
              />
            </FormControl>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default ItemViewModal;
