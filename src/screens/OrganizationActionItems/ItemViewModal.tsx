import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { InterfaceActionItem } from 'utils/interfaces';
import styles from '../../style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { FormControl, TextField } from '@mui/material';
import { TaskAlt, HistoryToggleOff } from '@mui/icons-material';
import Avatar from 'components/Avatar/Avatar';
import {
  GET_USERS_BY_IDS,
  GET_CATEGORIES_BY_IDS,
} from 'GraphQl/Queries/Queries';
import { useQuery } from '@apollo/client';

/**
 * The ItemViewModal component displays a read-only modal view of an action item.
 * It shows details such as category, assignee, assigner, status, dates, and any pre-
 * or post-completion notes. It uses GraphQL queries to fetch user and category data,
 * and leverages React-Bootstrap and MUI components for the UI.
 */

export interface InterfaceViewModalProps {
  isOpen: boolean;
  hide: () => void;
  item: InterfaceActionItem;
}

const ItemViewModal: FC<InterfaceViewModalProps> = ({ isOpen, hide, item }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  // Destructure fields from the action item
  const {
    // id,
    isCompleted,
    assignedAt,
    completionAt,
    preCompletionNotes,
    postCompletionNotes,
    categoryId,
    // eventId,
    assigneeId,
    creatorId,
  } = item;

  // Query for user data (for assignee and creator)
  const userIds = Array.from(
    new Set([assigneeId, creatorId].filter(Boolean)),
  ) as string[];
  const { data: usersData } = useQuery(GET_USERS_BY_IDS, {
    variables: { input: { ids: userIds } },
    skip: userIds.length === 0,
  });

  // Query for category data
  const { data: categoriesData } = useQuery(GET_CATEGORIES_BY_IDS, {
    variables: { ids: categoryId ? [categoryId] : [] },
    skip: !categoryId,
  });

  // Helper to get a user's name from their ID
  const getUserName = (userId: string | null, defaultName: string): string => {
    if (!userId) return defaultName;
    const user = usersData?.usersByIds?.find(
      (u: { id: string; name: string }) => u.id === userId,
    );
    return user ? user.name : defaultName;
  };

  // Helper to get the category name; if none, returns "No Category"
  const getCategoryDisplay = (): string => {
    if (!categoryId) return 'No Category';
    const category = categoriesData?.categoriesByIds?.find(
      (cat: { id: string; name: string }) => cat.id === categoryId,
    );
    return category ? category.name : 'No Category';
  };

  const getAssigneeDisplay = (): string =>
    getUserName(assigneeId, 'Unassigned');
  const getAssignerDisplay = (): string => getUserName(creatorId, 'Unknown');

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
          {/* Category */}
          <Form.Group className="d-flex mb-3 w-100">
            <FormControl fullWidth>
              <TextField
                label={t('category')}
                variant="outlined"
                className={styles.noOutline}
                value={getCategoryDisplay()}
                disabled
              />
            </FormControl>
          </Form.Group>
          {/* Assignee & Assigner */}
          <Form.Group className="d-flex gap-3 mb-3">
            <FormControl fullWidth>
              <TextField
                label={t('assignee')}
                variant="outlined"
                className={styles.noOutline}
                value={getAssigneeDisplay()}
                disabled
                InputProps={{
                  startAdornment: (
                    <Avatar
                      key={assigneeId || 'default'}
                      containerStyle={styles.imageContainer}
                      avatarStyle={styles.TableImage}
                      name={getAssigneeDisplay()}
                      alt="assignee avatar"
                    />
                  ),
                }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label={t('assigner')}
                variant="outlined"
                className={styles.noOutline}
                value={getAssignerDisplay()}
                disabled
                InputProps={{
                  startAdornment: (
                    <Avatar
                      key={creatorId || 'default'}
                      containerStyle={styles.imageContainer}
                      avatarStyle={styles.TableImage}
                      name={getAssignerDisplay()}
                      alt="assigner avatar"
                    />
                  ),
                }}
              />
            </FormControl>
          </Form.Group>
          {/* Status & Dates */}
          <Form.Group className="d-flex gap-3 mx-auto mb-3">
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
            <DatePicker
              format="DD/MM/YYYY"
              label={t('dueDate')}
              className={`${styles.noOutline} w-100`}
              value={assignedAt ? dayjs(assignedAt) : null}
              disabled
            />
            {isCompleted && completionAt && (
              <DatePicker
                format="DD/MM/YYYY"
                label={t('completionDate')}
                className={`${styles.noOutline} w-100`}
                value={dayjs(completionAt)}
                disabled
              />
            )}
          </Form.Group>
          {/* Notes */}
          <Form.Group className={`d-flex ${isCompleted && 'mb-3'}`}>
            <FormControl fullWidth>
              <TextField
                label={t('preCompletionNotes')}
                variant="outlined"
                className={styles.noOutline}
                value={preCompletionNotes || 'No pre-completion notes'}
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
                value={postCompletionNotes || 'No post-completion notes'}
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
