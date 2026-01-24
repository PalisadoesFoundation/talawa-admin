/**
 * ItemDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an action item.
 * It provides a user-friendly interface to confirm or cancel the deletion process.
 *
 * @returns  A React functional component rendering the delete confirmation modal.
 *
 * @remarks
 * Uses `BaseModal` from `shared-components` for the modal and `react-bootstrap` for button components.
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
import Button from 'shared-components/Button/Button';
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
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import BaseModal from 'shared-components/BaseModal/BaseModal';
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
  const { t: tCommon } = useTranslation('translation');
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationActionItems',
  });

  const [applyTo, setApplyTo] = useState<'series' | 'instance'>('series');

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
    }
  };

  return (
    <BaseModal
      show={isOpen}
      onHide={hide}
      title={t('deleteActionItem')}
      showCloseButton
      footer={
        <div>
          <Button variant="secondary" data-testid="deletenobtn" onClick={hide}>
            {tCommon('no')}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            data-testid="deleteyesbtn"
          >
            {tCommon('yes')}
          </Button>
        </div>
      }
    >
      <p>{t('deleteActionItemMsg')}</p>

      {actionItem.isTemplate && !actionItem.isInstanceException && (
        <FormFieldGroup
          name="applyTo"
          label={t('applyTo')}
          touched={false}
          error={undefined}
        >
          <div className="mb-2">
            <div className="form-check">
              <input
                type="radio"
                name="applyTo"
                id="deleteApplyToSeries"
                className="form-check-input"
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
                type="radio"
                name="applyTo"
                id="deleteApplyToInstance"
                className="form-check-input"
                data-testid="deleteApplyToInstance"
                checked={applyTo === 'instance'}
                onChange={() => setApplyTo('instance')}
              />
              <label
                className="form-check-label"
                htmlFor="deleteApplyToInstance"
              >
                {t('thisEventOnly')}
              </label>
            </div>
          </div>
        </FormFieldGroup>
      )}
    </BaseModal>
  );
};

export default ItemDeleteModal;
