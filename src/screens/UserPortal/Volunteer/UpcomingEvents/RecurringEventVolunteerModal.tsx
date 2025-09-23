import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

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
