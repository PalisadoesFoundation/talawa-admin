/**
 * Navbar component.
 *
 * Renders the navigation bar used across the application.
 *
 * - The currently active tab in the navbar.
 * - Callback function when a tab is clicked.
 * - User information displayed in the navbar.
 * - Callback function triggered on logout.
 *
 * @returns JSX.Element - The rendered Navbar component.
 *
 * @remarks
 * - Uses shared SearchBar for searching.
 * - Includes responsive dropdown menus for navigation.
 * - Handles user profile actions like logout.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import SortingButton from 'shared-components/SortingButton/SortingButton';

interface InterfacePageHeaderProps {
  title?: string;
  search?: {
    placeholder: string;
    onSearch: (value: string) => void;
    inputTestId?: string;
    buttonTestId?: string;
  };
  sorting?: Array<{
    title: string;
    options: { label: string; value: string | number }[];
    selected: string | number;
    onChange: (value: string | number) => void;
    testIdPrefix: string;
  }>;
  showEventTypeFilter?: boolean;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  search,
  sorting,
  showEventTypeFilter = false,
  actions,
}: InterfacePageHeaderProps) {
  const { t } = useTranslation('translation');
  return (
    <div
      className={styles.calendarEventHeader}
      data-testid="calendarEventHeader"
    >
      <div className={styles.calendar__header}>
        {title && <h2 className={styles.pageHeaderTitle}>{title}</h2>}

        {/* ===== Search Bar ===== */}

        {search && (
          <SearchBar
            placeholder={search.placeholder}
            onSearch={search.onSearch}
            inputTestId={search.inputTestId}
            buttonTestId={search.buttonTestId}
            showSearchButton={true} //  true
            showLeadingIcon={true} //  true (Magnifying glass)
            showClearButton={true}
          />
        )}

        {/* ===== Sorting Props ===== */}
        {sorting &&
          sorting.map((sort, idx) => (
            <div key={idx} className={styles.space}>
              <SortingButton
                title={sort.title}
                sortingOptions={sort.options}
                selectedOption={sort.selected}
                onSortChange={sort.onChange}
                dataTestIdPrefix={sort.testIdPrefix}
                className={styles.dropdown}
              />
            </div>
          ))}

        {/*  Optional Event Type dropdown */}
        {showEventTypeFilter && (
          <div className={styles.btnsBlock}>
            <SortingButton
              title={t('eventType')}
              sortingOptions={[
                { label: 'Events', value: 'Events' },
                { label: 'Workshops', value: 'Workshops' },
              ]}
              selectedOption={'Events'}
              onSortChange={() => {}}
              dataTestIdPrefix="eventType"
              className={styles.dropdown}
              buttonLabel={t('eventType')}
            />
          </div>
        )}

        {/* ===== Action Buttons ===== */}
        {actions && (
          <div className={styles.btnsBlock}>
            <div className={styles.selectTypeEventHeader}>{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
}
