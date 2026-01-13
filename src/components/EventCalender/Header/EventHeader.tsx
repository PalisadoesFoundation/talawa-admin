/**
 * EventHeader Component
 *
 * This component renders the header section for the event calendar, providing
 * functionality for searching, sorting, and creating events. It is designed
 * to be used within the organization events page.
 *
 * @param {InterfaceEventHeaderProps} props - The props for the EventHeader component.
 * @param {ViewType} props.viewType - The current view type of the calendar (e.g., Month, Day, Year).
 * @param {(viewType: ViewType) => void} props.handleChangeView - Callback function to handle changes in the calendar view type.
 * @param {() => void} props.showInviteModal - Callback function to display the modal for creating a new event.
 *
 * @returns {JSX.Element} The rendered EventHeader component.
 *
 * @remarks
 * - This component uses `SearchBar` for searching events by name.
 * - It includes two `SortingButton` components for selecting the calendar view type and event type.
 * - A `Button` is provided to trigger the creation of a new event, styled with an `AddIcon`.
 *
 * @dependencies
 * - `react-bootstrap` for the `Button` component.
 * - `@mui/icons-material` for the `AddIcon`.
 * - `react-i18next` for translations.
 * - Custom styles from `style/app-fixed.module.css`.
 * - Subcomponents: `SortingButton` and `SearchBar`.
 *
 * @example
 * ```tsx
 * <EventHeader
 *   viewType={ViewType.MONTH}
 *   handleChangeView={(viewType) => console.log(viewType)}
 *   showInviteModal={() => console.log('Show modal')}
 * />
 * ```
 */

import React from 'react';
import { Button } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import styles from 'style/app-fixed.module.css';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import { useTranslation } from 'react-i18next';
import SortingButton from 'subComponents/SortingButton';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import type { InterfaceEventHeaderProps } from 'types/Event/interface';

function EventHeader({
  viewType,
  handleChangeView,
  showInviteModal,
}: InterfaceEventHeaderProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationEvents',
  });
  const { t: tCommon } = useTranslation('common');
  return (
    <div
      className={styles.calendarEventHeader}
      data-testid="calendarEventHeader"
    >
      <div className={styles.calendar__header}>
        <div className={styles.calendar__search}>
          <SearchBar
            placeholder={t('searchEventName')}
            onSearch={() => {}}
            inputTestId="searchEvent"
            buttonTestId="searchButton"
            showSearchButton={true}
            showLeadingIcon={true}
            showClearButton={true}
            buttonAriaLabel={t('search')}
          />
        </div>

        {/* 2. Controls Section: Wrapped in btnsBlock for alignment */}
        <div className={styles.btnsBlock}>
          <SortingButton
            title={t('viewType')}
            sortingOptions={[
              { label: 'Select Month', value: ViewType.MONTH },
              { label: 'Select Day', value: ViewType.DAY },
              { label: 'Select Year', value: ViewType.YEAR },
            ]}
            selectedOption={viewType}
            onSortChange={(value) => handleChangeView(value as ViewType)}
            dataTestIdPrefix="selectViewType"
            className={styles.dropdown}
          />
<<<<<<< HEAD
          <SortingButton
            title={t('eventType')}
            sortingOptions={[
              { label: 'Events', value: 'Events' },
              { label: 'Workshops', value: 'Workshops' },
            ]}
            selectedOption={t('eventType')}
            onSortChange={() => {}}
            dataTestIdPrefix="eventType"
            className={styles.dropdown}
            buttonLabel={t('eventType')}
          />

          <Button
            className={styles.dropdown}
            onClick={showInviteModal}
            data-testid="createEventModalBtn"
            data-cy="createEventModalBtn"
          >
            <AddIcon className={styles.addButtonIcon} />
            <span>{tCommon('create')}</span>
          </Button>
=======
        </div>

        <div className={styles.btnsBlock}>
          <div className={styles.selectTypeEventHeader}>
            <Button
              className={styles.dropdown}
              onClick={showInviteModal}
              data-testid="createEventModalBtn"
              data-cy="createEventModalBtn"
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
>>>>>>> 20a4dd546db (fix(events): remove event type button)
        </div>
      </div>
    </div>
  );
}

export default EventHeader;
