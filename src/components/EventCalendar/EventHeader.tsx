import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Search } from '@mui/icons-material';
import styles from '../../style/app.module.css';
import { ViewType } from '../../screens/OrganizationEvents/OrganizationEvents';
import { useTranslation } from 'react-i18next';
import SortingButton from 'subComponents/SortingButton';

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
    <div className={styles.calendarEventHeader}>
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
            className={styles.searchButton}
            style={{ marginBottom: '10px' }}
          >
            <Search />
          </Button>
        </div>
        <div className={styles.flex_grow}></div>
        <div className={styles.space}>
          <SortingButton
            title={t('viewType')}
            sortingOptions={[
              { label: ViewType.MONTH, value: 'selectMonth' },
              { label: ViewType.DAY, value: 'selectDay' },
              { label: ViewType.YEAR, value: 'selectYear' },
            ]}
            selectedOption={viewType}
            onSortChange={handleChangeView}
            dataTestIdPrefix="selectViewType"
            className={styles.dropdown}
          />
          <SortingButton
            title={t('eventType')}
            sortingOptions={[
              { label: 'Events', value: 'Events' },
              { label: 'Workshops', value: 'Workshops' },
            ]}
            selectedOption={t('eventType')}
            onSortChange={(value) => console.log(`Selected: ${value}`)}
            dataTestIdPrefix="eventType"
            className={styles.dropdown}
            buttonLabel={t('eventType')}
          />
          <Button
            variant="success"
            className={styles.createButtonEventHeader}
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
