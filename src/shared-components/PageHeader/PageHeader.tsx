/**
 * PageHeader Component
 *
 * A flexible and reusable header component used across multiple screens.
 * It supports page title, search bar, sorting dropdowns, optional event type filter,
 * and action buttons.
 *
 * @remarks
 * - Primarily used for pages that require filtering, sorting, or search.
 * - Uses `SearchBar` and `SortingButton` shared-components for search and sorting functionality.
 * - Layout is responsive and adjusts based on provided props.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Users"
 *   search={{
 *     placeholder: "Search user...",
 *     onSearch: handleSearch
 *   }}
 *   sorting={[
 *     {
 *       title: "Sort By",
 *       options: [
 *         { label: "Newest", value: "DESC" },
 *         { label: "Oldest", value: "ASC" }
 *       ],
 *       selected: "DESC",
 *       onChange: handleSort,
 *       testIdPrefix: "usersSort"
 *     }
 *   ]}
 *   actions={<Button>Add User</Button>}
 * />
 * ```
 *
 * @param title - Optional title displayed at the top of the page.
 * @param search - Search bar configuration.
 *
 * @param sorting - List of sorting dropdown selectors.
 *
 * @param showEventTypeFilter - Whether to show the event type dropdown.
 *
 * @param actions - Action buttons/elements rendered on the right side.
 *
 * @returns - The rendered PageHeader component.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PageHeader.module.css';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import SortingButton from 'shared-components/SortingButton/SortingButton';
import type { InterfacePageHeaderProps } from 'types/shared-components/PageHeader/interface';

export default function PageHeader({
  title,
  search,
  sorting,
  showEventTypeFilter = false,
  selectedEventType = 'events',
  onEventTypeChange,
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
          sorting.map((sort, idx) => {
            const selectedOption = sort.options.find(
              (opt) => opt.value === sort.selected,
            );
            const buttonLabel = selectedOption?.label ?? sort.title;
            return (
              <div key={idx} className={styles.space}>
                <SortingButton
                  title={sort.title}
                  sortingOptions={sort.options}
                  selectedOption={sort.selected}
                  onSortChange={sort.onChange}
                  dataTestIdPrefix={sort.testIdPrefix}
                  className={styles.dropdown}
                  buttonLabel={buttonLabel}
                />
              </div>
            );
          })}

        {/*  Optional Event Type dropdown */}
        {showEventTypeFilter && (
          <div className={styles.btnsBlock}>
            <SortingButton
              title={t('eventType')}
              sortingOptions={[
                { label: t('events'), value: 'events' },
                { label: t('workshops'), value: 'workshops' },
              ]}
              selectedOption={selectedEventType}
              onSortChange={(value) => onEventTypeChange?.(value.toString())}
              dataTestIdPrefix="eventType"
              className={styles.dropdown}
              buttonLabel={
                selectedEventType === 'workshops' ? t('workshops') : t('events')
              }
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
