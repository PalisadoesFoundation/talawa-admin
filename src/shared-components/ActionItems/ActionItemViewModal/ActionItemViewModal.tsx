/**
 * ItemViewModal Component
 * Updated to work with new GraphQL schema structure and interfaces.
 * This component renders a modal for viewing the details of an action item.
 *
 * @returns A React functional component rendering the action item details modal.
 *
 * @remarks
 * Uses `ViewModal` from `shared-components/CRUDModalTemplate` for the modal structure.
 * Integrates with Apollo Client's `useQuery` for fetching related data.
 * Supports internationalization with `react-i18next`.
 * @example
 * ```tsx
 * <ItemViewModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   item={selectedActionItem}
 * />
 * ```
 */
import DatePicker from 'shared-components/DatePicker';
import React from 'react';
import dayjs from 'dayjs';
import type { FC } from 'react';
import type { IActionItemInfo } from 'types/shared-components/ActionItems/interface';
import type { InterfaceUser } from 'types/shared-components/User/interface';
import type { InterfaceEvent } from 'types/Event/interface';
import styles from './ActionItemViewModal.module.css';
import { useTranslation } from 'react-i18next';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';
import StatusBadge from 'shared-components/StatusBadge/StatusBadge';
import { useQuery } from '@apollo/client';
import { GET_ACTION_ITEM_CATEGORY } from 'GraphQl/Queries/ActionItemCategoryQueries';
import { MEMBERS_LIST_WITH_DETAILS } from 'GraphQl/Queries/Queries';
import { ViewModal } from 'shared-components/CRUDModalTemplate/ViewModal';

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
    skip: !organizationId,
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
    <ViewModal
      open={isOpen}
      onClose={hide}
      title={t('actionItemDetails')}
      size="lg"
      data-testid="actionItemViewModal"
    >
      <div style={{ padding: 12 }}>
        <div style={{ width: '100%' }}>
          <FormFieldGroup
            name="category"
            label={t('category')}
            touched={false}
            error={undefined}
          >
            <input
              id="category"
              type="text"
              value={category?.name || 'No category'}
              disabled
              readOnly
              className="form-input"
            />
          </FormFieldGroup>
        </div>
        <div style={{ gap: 12 }}>
          <FormFieldGroup
            name="assignedTo"
            label={t('assignedTo')}
            helpText={assignedInfo.details}
            touched={false}
            error={undefined}
          >
            <input
              id="assignedTo"
              type="text"
              value={assignedInfo.name}
              disabled
              readOnly
              className="form-input"
              data-testid="assignee_input"
            />
          </FormFieldGroup>

          <FormFieldGroup
            name="creator"
            label={t('creator')}
            touched={false}
            error={undefined}
          >
            <input
              id="creator"
              type="text"
              value={getUserDisplayName(creator)}
              disabled
              readOnly
              className="form-input"
            />
          </FormFieldGroup>
        </div>
        <div style={{ marginLeft: 'auto', alignItems: 'flex-start' }}>
          <div style={{ marginBottom: 12 }}>
            <span className="field-label">{t('status')}</span>

            <div>
              <StatusBadge
                variant={isCompleted ? 'completed' : 'pending'}
                size="md"
                dataTestId="action-item-status-badge"
                ariaLabel={
                  isCompleted ? tCommon('completed') : tCommon('pending')
                }
              />
            </div>
          </div>

          <FormFieldGroup
            name="event"
            label={t('event')}
            touched={false}
            error={undefined}
          >
            <input
              id="event"
              type="text"
              value={getEventDisplayName(item.recurringEventInstance || event)}
              disabled
              readOnly
              className="form-input"
            />
          </FormFieldGroup>
        </div>
        <div className={`gap-3`}>
          <DatePicker
            data-testid="assignmentDatePicker"
            format="DD/MM/YYYY"
            label={t('assignmentDate')}
            className={`${styles.noOutline}`}
            value={dayjs(assignedAt)}
            disabled
            onChange={() => null}
          />

          {isCompleted && completionAt && (
            <DatePicker
              format="DD/MM/YYYY"
              label={t('completionDate')}
              className={`${styles.noOutline}`}
              value={dayjs(completionAt)}
              disabled
              onChange={() => null}
            />
          )}
        </div>
        <div className={`${isCompleted && 'mb-3'}`}>
          <FormFieldGroup
            name="preCompletionNotes"
            label={t('preCompletionNotes')}
            touched={false}
            error={undefined}
          >
            <textarea
              id="preCompletionNotes"
              placeholder={t('preCompletionNotes')}
              value={preCompletionNotes || ''}
              disabled
              readOnly
              className="form-input"
              rows={3}
            />
          </FormFieldGroup>
        </div>
        {isCompleted && (
          <FormFieldGroup
            name="postCompletionNotes"
            label={t('postCompletionNotes')}
            touched={false}
            error={undefined}
          >
            <textarea
              id="postCompletionNotes"
              placeholder={t('postCompletionNotes')}
              className="form-input"
              value={postCompletionNotes || ''}
              rows={3}
              disabled
              readOnly
            />
          </FormFieldGroup>
        )}
      </div>
    </ViewModal>
  );
};

export default ItemViewModal;
