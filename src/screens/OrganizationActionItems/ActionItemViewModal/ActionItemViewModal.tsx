/**
 * ItemViewModal Component
 * Updated to work with new GraphQL schema structure and interfaces.
 */
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import type { IActionItemInfo } from 'types/ActionItems/interface';
import type { InterfaceUser } from 'types/User/interface';
import type { InterfaceEvent } from 'types/Event/interface';
import styles from 'style/app-fixed.module.css';
import { useTranslation } from 'react-i18next';
import { FormControl, TextField } from '@mui/material';
import { TaskAlt, HistoryToggleOff } from '@mui/icons-material';
import { useQuery } from '@apollo/client';
import { GET_ACTION_ITEM_CATEGORY } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { getUserDisplayName } from 'utils/userDisplay';

export interface IViewModalProps {
  isOpen: boolean;
  hide: () => void;
  item: IActionItemInfo;
}

const ItemViewModal: FC<IViewModalProps> = ({ isOpen, hide, item }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });
  const { t: tCommon } = useTranslation('common');

  const {
    categoryId,
    assigneeId,
    creatorId,
    completionAt,
    assignedAt,
    isCompleted,
    postCompletionNotes,
    preCompletionNotes,
    event,
    organizationId,
  } = item;

  // Query to get category details
  const { data: categoryData } = useQuery(GET_ACTION_ITEM_CATEGORY, {
    variables: {
      input: { id: categoryId },
    },
    skip: !categoryId,
  });

  // Query to get organization members to resolve assignee and creator details
  const { data: membersData } = useQuery(MEMBERS_LIST, {
    variables: { organizationId: organizationId },
  });

  const members = membersData?.usersByOrganizationId || [];

  type ResolvedUser = InterfaceUser | NonNullable<IActionItemInfo['assignee']>;

  const hasDisplayName = (
    user: ResolvedUser | IActionItemInfo['assignee'] | undefined | null,
  ): boolean => getUserDisplayName(user ?? undefined, '').trim().length > 0;

  const resolveUser = (
    memberFromQuery: InterfaceUser | undefined,
    fallbackUser: IActionItemInfo['assignee'],
  ): ResolvedUser | null => {
    if (memberFromQuery && hasDisplayName(memberFromQuery)) {
      return memberFromQuery;
    }

    if (fallbackUser && hasDisplayName(fallbackUser)) {
      return fallbackUser;
    }

    return memberFromQuery ?? fallbackUser ?? null;
  };

  const assignee = resolveUser(
    assigneeId
      ? members.find((member: InterfaceUser) => member.id === assigneeId)
      : undefined,
    item.assignee,
  );

  const creator = resolveUser(
    creatorId
      ? members.find((member: InterfaceUser) => member.id === creatorId)
      : undefined,
    item.creator,
  );

  const category = categoryData?.actionItemCategory || item.category;

  const getEventDisplayName = (
    event: InterfaceEvent | null | undefined,
  ): string => {
    if (!event) return 'No event';

    return event.name ?? event.title ?? 'No event';
  };

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
                value={category?.name || 'No category'}
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
                value={getUserDisplayName(assignee ?? undefined, 'Unknown')}
                disabled
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label={t('creator')}
                variant="outlined"
                className={styles.noOutline}
                value={getUserDisplayName(creator ?? undefined, 'Unknown')}
                disabled
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

            {/* Event Information */}
            <TextField
              label={t('event')}
              variant="outlined"
              className={`${styles.noOutline} w-100`}
              value={getEventDisplayName(item.recurringEventInstance || event)}
              disabled
            />
          </Form.Group>

          <Form.Group className={`d-flex gap-3 mb-3`}>
            {/* Date Calendar Component to display assigned date of Action Item */}
            <DatePicker
              format="DD/MM/YYYY"
              label={t('assignmentDate')}
              className={`${styles.noOutline} w-100`}
              value={dayjs(assignedAt)}
              disabled
            />

            {/* Date Calendar Component to display completion Date of Action Item */}
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

          <Form.Group className={`d-flex ${isCompleted && 'mb-3'}`}>
            <FormControl fullWidth>
              <TextField
                label={t('preCompletionNotes')}
                variant="outlined"
                className={styles.noOutline}
                value={preCompletionNotes || ''}
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
                value={postCompletionNotes || ''}
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
