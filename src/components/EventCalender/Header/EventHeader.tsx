/**
 * EventHeader component.
 *
 * Renders the header section for the event calendar, providing controls
 * for searching, sorting, and creating events.
 *
 * @param props - Props for the EventHeader component.
 * - Current view type of the calendar (Month, Day, Year).
 * - Callback invoked when the calendar view type changes.
 * - Callback to open the create-event modal.
 *
 * @returns The rendered EventHeader component.
 *
 * @remarks
 * - Uses SearchBar for filtering events.
 * - Uses SortingButton for selecting view and event type.
 * - Includes a button to trigger event creation.
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
