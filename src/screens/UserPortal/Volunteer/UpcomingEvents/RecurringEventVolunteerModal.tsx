/**
 * Modal for choosing recurring event volunteer scope.
 *
 * component RecurringEventVolunteerModal
 * `@param` props - Component props from InterfaceRecurringEventVolunteerModalProps
 * `@returns` JSX.Element
 */
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';

/**
 * Props for the RecurringEventVolunteerModal component
 */
interface InterfaceRecurringEventVolunteerModalProps {
  /** Controls the visibility of the modal */
  show: boolean;
  /** Callback function to hide/close the modal */
  onHide: () => void;
  /** The name of the recurring event */
  eventName: string;
  /** The date of the current event instance */
  eventDate: string;
  /** Callback when user chooses to volunteer for entire series */
  onSelectSeries: () => void;
  /** Callback when user chooses to volunteer for this instance only */
  onSelectInstance: () => void;
  /** Optional flag indicating if this is for joining a volunteer group */
  isForGroup?: boolean;
  /** Optional name of the volunteer group being joined */
  groupName?: string;
}

const RecurringEventVolunteerModal: React.FC<
  InterfaceRecurringEventVolunteerModalProps
> = ({
  show,
  onHide,
  eventName,
  eventDate,
  onSelectSeries,
  onSelectInstance,
  isForGroup = false,
  groupName,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventVolunteers' });

  const [selectedOption, setSelectedOption] = useState<'series' | 'instance'>(
    'series',
  );

  /**
   * Handles form submission by calling the appropriate callback based on user selection
   */
  const handleSubmit = (): void => {
    if (selectedOption === 'series') {
      onSelectSeries();
    } else {
      onSelectInstance();
    }
  };

  const formattedDate = new Date(eventDate).toLocaleDateString();

  const title = isForGroup
    ? t('recurringGroupTitle', { groupName, eventName })
    : t('recurringVolunteerTitle', { eventName });

  const description = isForGroup
    ? t('recurringGroupDescription', { groupName })
    : t('recurringVolunteerDescription');

  const seriesLabel = t('volunteerForEntireSeries');
  const seriesDescription = isForGroup
    ? t('joinGroupForSeriesDescription')
    : t('volunteerForSeriesDescription');

  const instanceLabel = t('volunteerForThisInstanceOnly');
  const instanceDescription = isForGroup
    ? t('joinGroupForInstanceDescription', { date: formattedDate })
    : t('volunteerForInstanceDescription', { date: formattedDate });

  return (
    <CRUDModalTemplate
      open={show}
      title={title}
      onClose={onHide}
      onPrimary={handleSubmit}
      primaryText={t('submitRequest')}
      data-testid="recurringEventModal"
    >
      <p className="mb-4">{description}</p>

      <Form>
        <Form.Check
          type="radio"
          name="volunteerScope"
          id="seriesOption"
          label={
            <div>
              <strong>{seriesLabel}</strong>
              <div className="small text-muted">{seriesDescription}</div>
            </div>
          }
          checked={selectedOption === 'series'}
          onChange={() => setSelectedOption('series')}
          className="mb-3"
          data-testid="volunteerForSeriesOption"
        />

        <Form.Check
          type="radio"
          name="volunteerScope"
          id="instanceOption"
          label={
            <div>
              <strong>{instanceLabel}</strong>
              <div className="small text-muted">{instanceDescription}</div>
            </div>
          }
          checked={selectedOption === 'instance'}
          onChange={() => setSelectedOption('instance')}
          data-testid="volunteerForInstanceOption"
        />
      </Form>
    </CRUDModalTemplate>
  );
};

export default RecurringEventVolunteerModal;
