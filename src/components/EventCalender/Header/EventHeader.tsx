/**
 * EventHeader component for displaying calendar controls and action buttons.
 *
 * @param props - The props object for EventHeader.
 * - The current view type of the calendar (e.g., Month, Day, Year).
 * - Callback function to handle changes in the calendar view type.
 * - Callback function to display the modal for creating a new event.
 *
 * @returns JSX.Element - The rendered EventHeader component.
 *
 * @remarks
 * - Uses SearchBar for searching events by name.
 * - Includes two SortingButton components for selecting calendar view type and event type.
 * - Button triggers creation of a new event with AddIcon.
 */

import React from 'react';
import { Button } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import styles from 'style/app-fixed.module.css';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import { useTranslation } from 'react-i18next';
import SortingButton from 'shared-components/SortingButton/SortingButton';
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
        </div>
      </div>
    </div>
  );
}

export default EventHeader;
