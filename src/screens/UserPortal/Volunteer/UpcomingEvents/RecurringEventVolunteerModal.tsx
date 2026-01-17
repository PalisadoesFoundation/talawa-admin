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
 *   eventDate="2024-01-15"
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
import Button from 'react-bootstrap/Button';
import { Modal, Form } from 'react-bootstrap';

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

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      data-testid="recurringEventModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isForGroup
            ? `Join ${groupName} - ${eventName}`
            : `Volunteer for ${eventName}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-4">
          {isForGroup
            ? `Would you like to join "${groupName}" for the entire series or just this instance?`
            : 'Would you like to volunteer for the entire series or just this instance?'}
        </p>

        <Form>
          <Form.Check
            type="radio"
            name="volunteerScope"
            id="seriesOption"
            label={
              <div>
                <strong>Volunteer for Entire Series</strong>
                <div className="small text-muted">
                  {isForGroup
                    ? 'You will join this group for all events in the recurring series'
                    : 'You will be volunteering for all events in this recurring series'}
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
                <strong>Volunteer for This Instance Only</strong>
                <div className="small text-muted">
                  {isForGroup
                    ? `You will join this group only for the event on ${new Date(eventDate).toLocaleDateString()}`
                    : `You will only be volunteering for the event on ${new Date(eventDate).toLocaleDateString()}`}
                </div>
              </div>
            }
            checked={selectedOption === 'instance'}
            onChange={() => setSelectedOption('instance')}
            data-testid="volunteerForInstanceOption"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          data-testid="submitVolunteerBtn"
        >
          Submit Request
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecurringEventVolunteerModal;
