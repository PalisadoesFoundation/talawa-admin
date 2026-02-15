/**
 * PageHeader Component
 *
 * A flexible and reusable header component used across multiple screens.
 * It supports page title, search bar, sorting dropdowns, optional event type filter,
 * and action buttons.
 *
 * @remarks
 * - Primarily used for pages that require filtering, sorting, or search.
 * - Uses `SearchBar` and `DropDownButton` shared-components for search and sorting functionality.
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
import styles from './Navbar.module.css';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import SortIcon from '@mui/icons-material/Sort';
import type { InterfacePageHeaderProps } from 'types/shared-components/Navbar/interface';

export default function PageHeader({
  title,
  search,
  sorting,

  actions,
  rootClassName,
}: InterfacePageHeaderProps) {
  const { t } = useTranslation('translation');
  return (
    <div
      className={[styles.calendarEventHeader, rootClassName]
        .filter(Boolean)
        .join(' ')}
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
            const valueMap = new Map(
              sort.options.map((opt) => [String(opt.value), opt.value]),
            );
            return (
              <div key={idx} className={styles.btnsBlock}>
                <DropDownButton
                  options={sort.options.map((opt) => ({
                    label: opt.label,
                    value: String(opt.value),
                  }))}
                  selectedValue={String(sort.selected)}
                  onSelect={(val) => sort.onChange(valueMap.get(val) ?? val)}
                  ariaLabel={sort.title}
                  dataTestIdPrefix={sort.testIdPrefix}
                  parentContainerStyle={styles.dropdown}
                  containerClassName={sort.containerClassName}
                  toggleClassName={sort.toggleClassName}
                  icon={
                    sort.icon ? (
                      <img
                        src={String(sort.icon)}
                        alt={t('common:sortingIcon')}
                        aria-hidden="true"
                      />
                    ) : (
                      <SortIcon data-testid="sorting-icon" aria-hidden="true" />
                    )
                  }
                  variant="outline-secondary"
                />
              </div>
            );
          })}

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
