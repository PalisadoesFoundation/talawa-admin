// translation-check-keyPrefix: eventListCard
/**
 * EventListCardDeleteModal Component
 *
 * @param eventListCardProps - The properties of the event to be deleted.
 * @param eventDeleteModalIsOpen - Determines if the modal is open.
 * @param toggleDeleteModal - Function to toggle the modal visibility.
 * @param deleteEventHandler - Function to handle the event deletion.
 * @returns JSX.Element
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'react-bootstrap/Form';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import type { InterfaceDeleteEventModalProps } from 'types/shared-components/EventListCard/Modal/Delete/interface';

const EventListCardDeleteModal: React.FC<InterfaceDeleteEventModalProps> = ({
  eventListCardProps,
  eventDeleteModalIsOpen,
  toggleDeleteModal,
  deleteEventHandler,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventListCard' });
  const { t: tCommon } = useTranslation('common');
  const [deleteOption, setDeleteOption] = useState<
    'single' | 'following' | 'all'
  >('single');

  // Check if this is a recurring instance
  const isRecurringInstance =
    !eventListCardProps.isRecurringEventTemplate &&
    !!eventListCardProps.baseEvent?.id;

  const handleDelete = () => {
    if (isRecurringInstance) {
      deleteEventHandler(deleteOption);
    } else {
      deleteEventHandler();
    }
  };

  const testid = `deleteEventModal${eventListCardProps.id}`;
  const deleteOptionName = 'deleteOption-' + eventListCardProps.id;

  return (
    <CRUDModalTemplate
      title={t('deleteEvent')}
      open={eventDeleteModalIsOpen}
      onClose={toggleDeleteModal}
      onPrimary={handleDelete}
      primaryText={tCommon('yes')}
      secondaryText={tCommon('no')}
      primaryVariant="danger"
      size={isRecurringInstance ? 'lg' : 'sm'}
      centered
      data-testid={testid}
    >
      {isRecurringInstance ? (
        <div>
          <p>{t('deleteRecurringEventMsg')}</p>
          <Form>
            <Form.Check
              type="radio"
              id={`delete-single-${eventListCardProps.id}`}
              name={deleteOptionName}
              value="single"
              checked={deleteOption === 'single'}
              onChange={() => setDeleteOption('single')}
              label={t('deleteThisInstance')}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              id={`delete-following-${eventListCardProps.id}`}
              name={deleteOptionName}
              value="following"
              checked={deleteOption === 'following'}
              onChange={() => setDeleteOption('following')}
              label={t('deleteThisAndFollowing')}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              id={`delete-all-${eventListCardProps.id}`}
              name={deleteOptionName}
              value="all"
              checked={deleteOption === 'all'}
              onChange={() => setDeleteOption('all')}
              label={t('deleteAllEvents')}
              className="mb-2"
            />
          </Form>
        </div>
      ) : (
        <p>{t('deleteEventMsg')}</p>
      )}
    </CRUDModalTemplate>
  );
};

export default EventListCardDeleteModal;
