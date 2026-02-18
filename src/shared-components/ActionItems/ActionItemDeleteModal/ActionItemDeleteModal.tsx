/**
 * ItemDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an action item.
 * It provides a user-friendly interface to confirm or cancel the deletion process.
 *
 * @returns  A React functional component rendering the delete confirmation modal.
 *
 * @remarks
 * Uses DeleteModal template from CRUDModalTemplate for consistent UI and behavior.
 * Integrates with Apollo Client's `useMutation` for handling the deletion of the action item.
 * Displays success or error messages using `NotificationToast`.
 * Supports internationalization with `react-i18next`.
 *
 * @example
 * ```tsx
 * <ItemDeleteModal
 *   isOpen={true}
 *   hide={() => setShowModal(false)}
 *   actionItem={selectedActionItem}
 *   actionItemsRefetch={refetchActionItems}
 * />
 * ```
 *
 */
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  DELETE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';
import type {
  IActionItemInfo,
  IDeleteActionItemInput,
} from 'types/shared-components/ActionItems/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { DeleteModal } from 'shared-components/CRUDModalTemplate/DeleteModal';
import { FormFieldGroup } from 'shared-components/FormFieldGroup/FormFieldGroup';

export interface IItemDeleteModalProps {
  isOpen: boolean;
  hide: () => void;
  actionItem: IActionItemInfo;
  actionItemsRefetch: () => void;
  eventId?: string;
  isRecurring?: boolean;
}

const ItemDeleteModal: React.FC<IItemDeleteModalProps> = ({
  isOpen,
  hide,
  actionItem,
  actionItemsRefetch,
  eventId,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('series');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteActionItem] = useMutation(DELETE_ACTION_ITEM_MUTATION, {
    refetchQueries: ['ActionItemsByOrganization', 'GetEventActionItems'],
  });

  const [deleteActionForInstance] = useMutation(
    DELETE_ACTION_ITEM_FOR_INSTANCE,
    {
      refetchQueries: ['GetEventActionItems'],
    },
  );

  const handleDelete = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (actionItem.isTemplate && applyTo === 'instance') {
        const input = {
          actionId: actionItem.id,
          eventId: eventId,
        };

        await deleteActionForInstance({
          variables: { input },
        });
      } else {
        const input: IDeleteActionItemInput = {
          id: actionItem.id,
        };

        await deleteActionItem({
          variables: { input },
        });
      }

      actionItemsRefetch();
      hide();
      NotificationToast.success(t('successfulDeletion'));
    } catch (error: unknown) {
      NotificationToast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const recurringEventContent =
    actionItem.isTemplate && !actionItem.isInstanceException ? (
      <FormFieldGroup
        name="applyTo"
        label={t('applyTo')}
        touched={false}
        error={undefined}
      >
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="applyTo"
            id="deleteApplyToSeries"
            data-testid="deleteApplyToSeries"
            checked={applyTo === 'series'}
            onChange={() => setApplyTo('series')}
          />
          <label className="form-check-label" htmlFor="deleteApplyToSeries">
            {t('entireSeries')}
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="applyTo"
            id="deleteApplyToInstance"
            data-testid="deleteApplyToInstance"
            checked={applyTo === 'instance'}
            onChange={() => setApplyTo('instance')}
          />
          <label className="form-check-label" htmlFor="deleteApplyToInstance">
            {t('thisEventOnly')}
          </label>
        </div>
      </FormFieldGroup>
    ) : undefined;

  return (
    <DeleteModal
      open={isOpen}
      onClose={hide}
      title={t('deleteActionItem')}
      onDelete={handleDelete}
      loading={isSubmitting}
      showWarning={false}
      recurringEventContent={recurringEventContent}
    >
      <p>{t('deleteActionItemMsg')}</p>
    </DeleteModal>
  );
};

export default ItemDeleteModal;
