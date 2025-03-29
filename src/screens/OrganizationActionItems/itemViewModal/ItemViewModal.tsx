/**
 * ItemViewModal Component
 *
 * This component renders a modal to display detailed information about an action item.
 * It is designed to be used in the context of organization action items, providing
 * a read-only view of the item's properties such as category, assignee, assigner, status,
 * due date, completion date, and notes.
 *
 * @component
 * @param {InterfaceViewModalProps} props - The props for the ItemViewModal component.
 * @param {boolean} props.isOpen - Determines whether the modal is visible.
 * @param {() => void} props.hide - Function to close the modal.
 * @param {InterfaceActionItemInfo} props.item - The action item data to display in the modal.
 *
 * @returns {JSX.Element} The rendered ItemViewModal component.
 *
 * @remarks
 * - The modal uses `react-bootstrap` for layout and `@mui/material` for form controls.
 * - The `DatePicker` component from `@mui/x-date-pickers` is used to display dates.
 * - Assignee and assigner details include avatars or images if available.
 * - The modal supports translations using the `react-i18next` library.
 *
 * @example
 * ```tsx
 * <ItemViewModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   item={actionItem}
 * />
 * ```
 *
 * @see {@link InterfaceActionItemInfo} for the structure of the `item` prop.
 */
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceActionItemInfo } from 'utils/interfaces';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { FormControl, TextField } from '@mui/material';
import { TaskAlt, HistoryToggleOff } from '@mui/icons-material';
import Avatar from 'components/Avatar/Avatar';

export interface InterfaceViewModalProps {
  isOpen: boolean;
  hide: () => void;
  item: InterfaceActionItemInfo;
}

const ItemViewModal: FC<InterfaceViewModalProps> = ({ isOpen, hide, item }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  const {
    actionItemCategory,
    assignee,
    assigneeGroup,
    assigneeUser,
    assigneeType,
    assigner,
    completionDate,
    dueDate,
    isCompleted,
    postCompletionNotes,
    preCompletionNotes,
    allottedHours,
  } = item;

  return (
    <Modal className={styles.itemModal} onHide={hide} show={isOpen}>
      <Modal.Header>
        <p className={styles.titlemodal}>{t('actionItemDetails')}</p>
        <Button
          variant="danger"
          onClick={hide}
          className={styles.closeButton}
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
                data-testid="assignee_input"
                value={
                  assigneeType === 'EventVolunteer'
                    ? `${assignee?.user?.firstName} ${assignee?.user?.lastName}`
                    : assigneeType === 'EventVolunteerGroup'
                      ? assigneeGroup?.name
                      : `${assigneeUser?.firstName} ${assigneeUser?.lastName}`
                }
                disabled
                InputProps={{
                  startAdornment: (
                    <>
                      {assignee?.user?.image || assigneeUser?.image ? (
                        <img
                          src={
                            (assignee?.user?.image ||
                              assigneeUser?.image) as string
                          }
                          alt="Assignee"
                          data-testid={`assignee_image`}
                          className={styles.TableImage}
                        />
                      ) : assignee || assigneeUser ? (
                        <Avatar
                          key={assignee?._id || assigneeUser?._id}
                          containerStyle={styles.imageContainer}
                          avatarStyle={styles.TableImage}
                          dataTestId={`assignee_avatar`}
                          name={`${assignee?.user.firstName || assigneeUser?.firstName} ${assignee?.user.lastName || assigneeUser?.lastName}`}
                          alt={`assignee_avatar`}
                        />
                      ) : (
                        <Avatar
                          key={assigneeGroup?._id}
                          containerStyle={styles.imageContainer}
                          avatarStyle={styles.TableImage}
                          dataTestId={`assigneeGroup_avatar`}
                          name={assigneeGroup?.name as string}
                          alt={`assigneeGroup_avatar`}
                        />
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
                          alt="Assigner"
                          data-testid={`assigner_image`}
                          className={styles.TableImage}
                        />
                      ) : (
                        <div className={styles.TableImage}>
                          <Avatar
                            key={assigner._id + '1'}
                            containerStyle={styles.imageContainer}
                            avatarStyle={styles.TableImage}
                            dataTestId={`assigner_avatar`}
                            name={assigner.firstName + ' ' + assigner.lastName}
                            alt={`assigner_avatar`}
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
                style: { color: isCompleted ? 'green' : '#ed6c02' },
              }}
              inputProps={{
                style: {
                  WebkitTextFillColor: isCompleted ? 'green' : '#ed6c02',
                },
              }}
              disabled
            />

            <TextField
              label={t('allottedHours')}
              variant="outlined"
              className={`${styles.noOutline} w-100`}
              value={allottedHours ?? '-'}
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
