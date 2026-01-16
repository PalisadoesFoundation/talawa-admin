/**
 * ItemViewModal Component
 * Updated to work with new GraphQL schema structure and interfaces.
 */
import DatePicker from 'shared-components/DatePicker';
import React from 'react';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { Form } from 'react-bootstrap';
import type { IActionItemInfo } from 'types/shared-components/ActionItems/interface';
import type { InterfaceUser } from 'types/shared-components/User/interface';
import type { InterfaceEvent } from 'types/Event/interface';
import styles from './ActionItemViewModal.module.css';
import { useTranslation } from 'react-i18next';
import { FormControl, TextField } from '@mui/material';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import { useQuery } from '@apollo/client';
import { GET_ACTION_ITEM_CATEGORY } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { MEMBERS_LIST_WITH_DETAILS } from 'GraphQl/Queries/Queries';
import { BaseModal } from 'shared-components/BaseModal';

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
    creatorId,
    completionAt,
    assignedAt,
    isCompleted,
    postCompletionNotes,
    preCompletionNotes,
    event,
    volunteer,
    volunteerGroup,
    organizationId,
  } = item;

  const { data: categoryData } = useQuery(GET_ACTION_ITEM_CATEGORY, {
    variables: {
      input: { id: categoryId },
    },
    skip: !categoryId,
  });

  const { data: membersData } = useQuery(MEMBERS_LIST_WITH_DETAILS, {
    variables: { organizationId: organizationId },
  });

  const members = membersData?.usersByOrganizationId || [];

  const getAssignedInfo = () => {
    if (volunteer?.user) {
      return {
        type: 'volunteer',
        name: volunteer.user.name || 'Unknown Volunteer',
        details: `Hours Volunteered: ${volunteer.hoursVolunteered || 0}`,
      };
    } else if (volunteerGroup) {
      return {
        type: 'group',
        name: volunteerGroup.name || 'Unknown Group',
        details: `Required Volunteers: ${volunteerGroup.volunteersRequired || 'Not specified'}`,
      };
    }
    return {
      type: 'none',
      name: 'No assignment',
      details: '',
    };
  };

  const assignedInfo = getAssignedInfo();

  const creator = creatorId
    ? members.find((member: InterfaceUser) => member.id === creatorId)
    : item.creator;

  const category = categoryData?.actionItemCategory || item.category;

  const getUserDisplayName = (
    user: InterfaceUser | null | undefined,
  ): string => {
    if (!user) return 'Unknown';

    if (user.name && user.name.trim()) {
      return user.name;
    }
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
  };

  const getEventDisplayName = (
    event: InterfaceEvent | null | undefined,
  ): string => {
    if (!event) return 'No event';

    return event.name || 'No event';
  };

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      title={t('actionItemDetails')}
      size="lg"
      showCloseButton
    >
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
              label={t('assignedTo')}
              variant="outlined"
              className={styles.noOutline}
              data-testid="assignee_input"
              value={assignedInfo.name}
              helperText={assignedInfo.details}
              disabled
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              label={t('creator')}
              variant="outlined"
              className={styles.noOutline}
              value={getUserDisplayName(creator)}
              disabled
            />
          </FormControl>
        </Form.Group>

        <Form.Group className="d-flex gap-3 mx-auto mb-3 align-items-start w-100">
          <FormControl fullWidth>
            <span id="action-item-status-label" className="form-label mb-2">
              {t('status')}
            </span>

            <div>
              <StatusBadge
                variant={isCompleted ? 'completed' : 'pending'}
                size="md"
                dataTestId="action-item-status-badge"
                ariaLabel={
                  isCompleted ? tCommon('completed') : tCommon('pending')
                }
                aria-labelledby="action-item-status-label"
              />
            </div>
          </FormControl>

          <TextField
            label={t('event')}
            variant="outlined"
            className={`${styles.noOutline} w-100`}
            value={getEventDisplayName(item.recurringEventInstance || event)}
            disabled
          />
        </Form.Group>

        <Form.Group className={`d-flex gap-3 mb-3`}>
          <DatePicker
            data-testid="assignmentDatePicker"
            format="DD/MM/YYYY"
            label={t('assignmentDate')}
            className={`${styles.noOutline} w-100`}
            value={dayjs(assignedAt)}
            disabled
            onChange={() => null}
          />

          {isCompleted && completionAt && (
            <DatePicker
              format="DD/MM/YYYY"
              label={t('completionDate')}
              className={`${styles.noOutline} w-100`}
              value={dayjs(completionAt)}
              disabled
              onChange={() => null}
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
    </BaseModal>
  );
};

export default ItemViewModal;
