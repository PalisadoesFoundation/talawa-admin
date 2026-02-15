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
import styles from './Navbar.module.css';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import SortIcon from '@mui/icons-material/Sort';

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
    containerClassName?: string;
    toggleClassName?: string;
  }>;
  showEventTypeFilter?: boolean;
  actions?: React.ReactNode;
  rootClassName?: string;
}

export default function PageHeader({
  title,
  search,
  sorting,
  showEventTypeFilter = false,
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
          sorting.map((sort, idx) => (
            <div key={idx} className={styles.btnsBlock}>
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
                containerClassName={sort.containerClassName}
                toggleClassName={sort.toggleClassName}
                icon={
                  <SortIcon data-testid="sorting-icon" aria-hidden="true" />
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
                { label: 'Events', value: 'Events' },
                { label: 'Workshops', value: 'Workshops' },
              ]}
              selectedValue={'Events'}
              onSelect={() => {}}
              ariaLabel={t('eventType')}
              dataTestIdPrefix="eventType"
              parentContainerStyle={styles.dropdown}
              buttonLabel={t('eventType')}
              icon={<SortIcon data-testid="sorting-icon" aria-hidden="true" />}
              variant="outline-secondary"
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
