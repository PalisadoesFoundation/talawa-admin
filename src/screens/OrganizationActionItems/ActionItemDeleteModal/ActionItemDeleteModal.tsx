/**
 * ItemDeleteModal Component
 *
 * This component renders a modal for confirming the deletion of an action item.
 * It provides a user-friendly interface to confirm or cancel the deletion process.
 *
 * @param  props - The props for the ItemDeleteModal component.
 * @param props - Determines whether the modal is visible.
 * @param  props - Function to hide the modal.
 * @param props - The action item to be deleted.
 * @param props - Function to refetch the list of action items after deletion.
 *
 * @returns  A React functional component rendering the delete confirmation modal.
 *
 * @remarks
 * - Uses `react-bootstrap` for modal and button components.
 * - Integrates with Apollo Client's `useMutation` for handling the deletion of the action item.
 * - Displays success or error messages using `react-toastify`.
 * - Supports internationalization with `react-i18next`.
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
import { Button, Form } from 'react-bootstrap';
import BaseModal from 'shared-components/BaseModal/BaseModal';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  DELETE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';
import type {
  IActionItemInfo,
  IDeleteActionItemInput,
} from 'types/ActionItems/interface';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

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
        // Delete for specific instance only
        const input = {
          actionId: actionItem.id,
          eventId: eventId,
        };

        await deleteActionForInstance({
          variables: { input },
        });
      } else {
        // Delete for entire series or non-recurring event
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
      centered
      dataTestId="actionItemDeleteModal"
      title={t('deleteActionItem')}
      footer={
        <>
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
        </>
      }
    >
      <p>{t('deleteActionItemMsg')}</p>

      {actionItem.isTemplate && !actionItem.isInstanceException && (
        <Form.Group className="mt-3">
          <Form.Label>{t('applyTo')}</Form.Label>
          <Form.Check
            type="radio"
            label={t('entireSeries')}
            name="applyTo"
            id="deleteApplyToSeries"
            data-testid="deleteApplyToSeries"
            checked={applyTo === 'series'}
            onChange={() => setApplyTo('series')}
          />
          <Form.Check
            type="radio"
            label={t('thisEventOnly')}
            name="applyTo"
            id="deleteApplyToInstance"
            data-testid="deleteApplyToInstance"
            checked={applyTo === 'instance'}
            onChange={() => setApplyTo('instance')}
          />
        </Form.Group>
      )}
    </BaseModal>
  );
};

export default ItemDeleteModal;
