import React, { useState } from 'react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { Search } from '@mui/icons-material';
import styles from './EventCalendar.module.css';
import { ViewType } from '../../screens/OrganizationEvents/OrganizationEvents';
import { useTranslation } from 'react-i18next';

/**
 * Props for the EventHeader component.
 */
interface InterfaceEventHeaderProps {
  viewType: ViewType;
  handleChangeView: (item: string | null) => void;
  showInviteModal: () => void;
}

/**
 * EventHeader component displays the header for the event calendar.
 * It includes a search field, view type dropdown, event type dropdown, and a button to create an event.
 *
 * @param viewType - The current view type of the calendar.
 * @param handleChangeView - Function to handle changing the view type.
 * @param showInviteModal - Function to show the invite modal for creating an event.
 * @returns JSX.Element - The rendered EventHeader component.
 */
function eventHeader({
  viewType,
  handleChangeView,
  showInviteModal,
}: InterfaceEventHeaderProps): JSX.Element {
  const [eventName, setEventName] = useState('');
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });

  return (
    <div className={styles.calendar}>
      <div className={styles.calendar__header}>
        <div className={styles.input}>
          <Form.Control
            type="text"
            id="searchEvent"
            data-testid="searchEvent"
            placeholder={t('searchEventName')}
            autoComplete="off"
            required
            className={styles.inputField}
            value={eventName}
            /**
             * Updates the event name state when the input value changes.
             *
             * @param e - The event object from the input change.
             */
            /*istanbul ignore next*/
            onChange={(e) => setEventName(e.target.value)}
          />
          <Button
            className={`position-absolute z-10 bottom-0 end-0 d-flex justify-content-center align-items-center `}
            style={{ marginBottom: '10px' }}
          >
            <Search />
          </Button>
        </div>
        <div className={styles.flex_grow}></div>
        <div className={styles.space}>
          <div>
            <Dropdown onSelect={handleChangeView} className={styles.selectType}>
              <Dropdown.Toggle
                id="dropdown-basic"
                className={styles.dropdown}
                data-testid="selectViewType"
              >
                {viewType}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  eventKey={ViewType.MONTH}
                  data-testid="selectMonth"
                >
                  {ViewType.MONTH}
                </Dropdown.Item>
                <Dropdown.Item eventKey={ViewType.DAY} data-testid="selectDay">
                  {ViewType.DAY}
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey={ViewType.YEAR}
                  data-testid="selectYear"
                >
                  {ViewType.YEAR}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <Dropdown className={styles.selectType}>
              <Dropdown.Toggle
                id="dropdown-basic"
                className={styles.dropdown}
                data-testid="eventType"
              >
                {t('eventType')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Events" data-testid="events">
                  Events
                </Dropdown.Item>
                <Dropdown.Item eventKey="Workshops" data-testid="workshop">
                  Workshops
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Button
            variant="success"
            className={styles.addbtn}
            onClick={showInviteModal}
            data-testid="createEventModalBtn"
          >
            Create Event
          </Button>
        </div>
      </div>
    </div>
  );
}

export default eventHeader;
