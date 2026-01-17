/**
 * RecurringEventVolunteerModal Component
 *
 * This modal component allows users to choose their volunteering scope for recurring events.
 * Users can select to volunteer for the entire event series or just a specific instance.
 * The modal adapts its messaging based on whether the user is volunteering individually
 * or joining a volunteer group.
 *
 * @component
 * @example
 * ```tsx
 * <RecurringEventVolunteerModal
 *   show={showModal}
 *   onHide={() => setShowModal(false)}
 *   eventName="Weekly Community Cleanup"
 *   eventDate=dayjs().date(15).format('YYYY-MM-DD')
 *   onSelectSeries={handleVolunteerSeries}
 *   onSelectInstance={handleVolunteerInstance}
 *   isForGroup={true}
 *   groupName="Cleanup Crew"
 * />
 * ```
 *
 * @functionality
 * - Displays options for volunteering scope (entire series vs single instance)
 * - Adapts UI text based on individual vs group volunteering
 * - Provides clear descriptions of what each option entails
 * - Handles user selection and triggers appropriate callback functions
 *
 * @ui
 * - Centered Bootstrap modal with radio button options
 * - Dynamic title based on volunteering type
 * - Informative descriptions for each option
 * - Submit and cancel buttons for user actions
 */
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import BaseModal from 'shared-components/BaseModal/BaseModal';

/**
 * @interface InterfaceRecurringEventVolunteerModalProps
 * @description Defines the props for the RecurringEventVolunteerModal component
 * @property {boolean} show - Controls the visibility of the modal
 * @property {() => void} onHide - Callback function to hide/close the modal
 * @property {string} eventName - The name of the recurring event
 * @property {string} eventDate - The date of the current event instance
 * @property {() => void} onSelectSeries - Callback when user chooses to volunteer for entire series
 * @property {() => void} onSelectInstance - Callback when user chooses to volunteer for this instance only
 * @property {boolean} [isForGroup] - Optional flag indicating if this is for joining a volunteer group
 * @property {string} [groupName] - Optional name of the volunteer group being joined
 */
interface InterfaceRecurringEventVolunteerModalProps {
  show: boolean;
  onHide: () => void;
  eventName: string;
  eventDate: string;
  onSelectSeries: () => void;
  onSelectInstance: () => void;
  isForGroup?: boolean;
  groupName?: string;
}

/**
 * RecurringEventVolunteerModal - A modal component for choosing recurring event volunteer scope
 *
 * @param props - The component props
 * @param props.show - Whether the modal should be displayed
 * @param props.onHide - Function to call when modal should be hidden
 * @param props.eventName - Name of the recurring event
 * @param props.eventDate - Date of the current event instance
 * @param props.onSelectSeries - Callback for volunteering for entire series
 * @param props.onSelectInstance - Callback for volunteering for single instance
 * @param props.isForGroup - Whether this is for joining a volunteer group
 * @param props.groupName - Name of the volunteer group if applicable
 *
 * @returns {React.FC} A React functional component rendering the volunteer scope selection modal
 */
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
  const { t } = useTranslation('translation', {
    keyPrefix: 'recurringEventVolunteerModal',
  });
  const [selectedOption, setSelectedOption] = useState<'series' | 'instance'>(
    'series',
  );

  /**
   * Handles form submission by calling the appropriate callback based on user selection
   *
   * @function handleSubmit
   * @returns {void}
   */
  const handleSubmit = () => {
    if (selectedOption === 'series') {
      onSelectSeries();
    } else {
      onSelectInstance();
    }
  };

  const formattedDate = new Date(eventDate).toLocaleDateString();
  const title = isForGroup
    ? t('joinGroupTitle', { groupName, eventName })
    : t('volunteerTitle', { eventName });

  const footer = (
    <>
      <Button variant="secondary" onClick={onHide}>
        {t('cancel')}
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit}
        data-testid="submitVolunteerBtn"
      >
        {t('submitRequest')}
      </Button>
    </>
  );

  return (
    <BaseModal
      show={show}
      onHide={onHide}
      title={title}
      footer={footer}
      centered
      dataTestId="recurringEventModal"
    >
      <p className="mb-4">
        {isForGroup
          ? t('joinGroupQuestion', { groupName })
          : t('volunteerQuestion')}
      </p>

      <Form>
        <Form.Check
          type="radio"
          name="volunteerScope"
          id="seriesOption"
          label={
            <div>
              <strong>{t('volunteerForSeries')}</strong>
              <div className="small text-muted">
                {isForGroup
                  ? t('joinGroupForSeries')
                  : t('volunteerForSeriesDesc')}
              </div>
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
              <strong>{t('volunteerForInstance')}</strong>
              <div className="small text-muted">
                {isForGroup
                  ? t('joinGroupForInstance', { date: formattedDate })
                  : t('volunteerForInstanceDesc', { date: formattedDate })}
              </div>
            </div>
          }
          checked={selectedOption === 'instance'}
          onChange={() => setSelectedOption('instance')}
          data-testid="volunteerForInstanceOption"
        />
      </Form>
    </BaseModal>
  );
};

export default RecurringEventVolunteerModal;
