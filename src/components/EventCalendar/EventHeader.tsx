import React from 'react';
import { Button } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import styles from '../../style/app.module.css';
import { ViewType } from '../../screens/OrganizationEvents/OrganizationEvents';
import { useTranslation } from 'react-i18next';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'subComponents/SearchBar';

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
 *
 * ## CSS Strategy Explanation:
 *
 * To ensure consistency across the application and reduce duplication, common styles
 * (such as button styles) have been moved to the global CSS file. Instead of using
 * component-specific classes (e.g., `.greenregbtnOrganizationFundCampaign`, `.greenregbtnPledge`), a single reusable
 * class (e.g., .addButton) is now applied.
 *
 * ### Benefits:
 * - **Reduces redundant CSS code.
 * - **Improves maintainability by centralizing common styles.
 * - **Ensures consistent styling across components.
 *
 * ### Global CSS Classes used:
 * - `.dropdown`
 *
 * For more details on the reusable classes, refer to the global CSS file.
 */
function eventHeader({
  viewType,
  handleChangeView,
  showInviteModal,
}: InterfaceEventHeaderProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });

  return (
    <div
      className={styles.calendarEventHeader}
      data-testid="calendarEventHeader"
    >
      <div className={styles.calendar__header}>
        <SearchBar
          placeholder={t('searchEventName')}
          onSearch={(term) => console.log(`Search term: ${term}`)}
          inputTestId="searchEvent"
          buttonTestId="searchButton"
        />
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
          <div className={styles.selectTypeEventHeader}>
            <Button
              variant="success"
              className={styles.dropdown}
              onClick={showInviteModal}
              data-testid="createEventModalBtn"
            >
              <div className="">
                <AddIcon
                  sx={{
                    fontSize: '25px',
                    marginBottom: '2px',
                    marginRight: '2px',
                  }}
                />
                <span>Create</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default eventHeader;
