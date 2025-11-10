/**
 * PageHeader Component
 *
 * A flexible reusable header/navbar for pages.
 * Supports title, search bar, sorting dropdowns, optional event type dropdown, and action buttons.
 */

import React from 'react';
import styles from 'style/app-fixed.module.css';
import SearchBar from 'subComponents/SearchBar';
import SortingButton from 'subComponents/SortingButton';

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
    onChange: (value: any) => void;
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
                dataTestIdPrefix={sort.title}
                className={styles.dropdown}
              />
            </div>
          ))}

        {/*  Optional Event Type dropdown */}
        {showEventTypeFilter && (
          <div className={styles.btnsBlock}>
            <SortingButton
              title="Event Type"
              sortingOptions={[
                { label: 'Events', value: 'Events' },
                { label: 'Workshops', value: 'Workshops' },
              ]}
              selectedOption={'Events'}
              onSortChange={(value) =>
                console.log(`Selected Event Type: ${value}`)
              }
              dataTestIdPrefix="eventType"
              className={styles.dropdown}
              buttonLabel="Event Type"
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
