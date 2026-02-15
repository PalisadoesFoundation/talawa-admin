/**
 * PageHeader
 *
 * A flexible and reusable header component used across multiple screens.
 * Supports page title, search, sorting dropdowns, optional event-type filter,
 * and action buttons.
 *
 * @remarks
 * - Used on pages that require filtering, sorting, or searching
 * - Uses SearchBar and DropDownButton shared-components
 * - Layout adapts based on provided props
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
 * @param title - Optional title displayed at the top of the page
 * @param search - Optional search bar configuration
 * @param sorting - Optional list of sorting dropdown configurations
 * @param showEventTypeFilter - Whether to show the event type dropdown
 * @param actions - Optional action elements rendered on the right
 *
 * @returns The rendered PageHeader component
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PeopleTabNavbar.module.css';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import SortIcon from '@mui/icons-material/Sort';
import type { InterfacePeopleTabNavbarProps } from 'types/shared-components/PeopleTabNavbar/interface';

export default function PeopleTabNavbar({
  title,
  search,
  sorting,
  showEventTypeFilter = false,
  actions,
  alignmentClassName,
}: InterfacePeopleTabNavbarProps) {
  const { t: tCommon } = useTranslation('common');

  return (
    <div
      className={styles.calendarEventHeader}
      data-testid="calendarEventHeader"
    >
      <div className={styles.calendar__header}>
        {title && <h2 className={styles.pageHeaderTitle}>{title}</h2>}
        <div
          className={[styles.peopleTabNavbarAlignment, alignmentClassName]
            .filter(Boolean)
            .join(' ')}
        >
          {/* ===== Action Buttons ===== */}
          {actions && (
            <div className={styles.btnsBlock}>
              <div className={styles.selectTypeEventHeader}>{actions}</div>
            </div>
          )}
          {/* ===== Sorting Props ===== */}
          {sorting &&
            sorting.map((sort, idx) => (
              <div key={idx} className={styles.dropdownItemButton}>
                <DropDownButton
                  options={sort.options.map((opt) => ({
                    label: opt.label,
                    value: String(opt.value),
                  }))}
                  selectedValue={String(sort.selected)}
                  onSelect={(val) => sort.onChange(val)}
                  ariaLabel={sort.title}
                  dataTestIdPrefix={sort.testIdPrefix}
                  parentContainerStyle={styles.dropdown}
                  icon={
                    sort.icon ? (
                      <img
                        src={String(sort.icon)}
                        alt={tCommon('sortingIcon')}
                        aria-hidden="true"
                      />
                    ) : (
                      <SortIcon data-testid="sorting-icon" aria-hidden="true" />
                    )
                  }
                  variant="outline-secondary"
                />
              </div>
            ))}

          {/*  Optional Event Type dropdown */}
          {showEventTypeFilter && (
            <div className={styles.btnsBlock}>
              <DropDownButton
                options={[
                  { label: tCommon('events'), value: 'Events' },
                  { label: tCommon('workshops'), value: 'Workshops' },
                ]}
                selectedValue={'Events'}
                onSelect={() => {}}
                ariaLabel={tCommon('eventType')}
                dataTestIdPrefix="eventType"
                parentContainerStyle={styles.dropdown}
                buttonLabel={tCommon('eventType')}
                icon={
                  <SortIcon data-testid="sorting-icon" aria-hidden="true" />
                }
                variant="outline-secondary"
              />
            </div>
          )}
        </div>

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
      </div>
    </div>
  );
}
