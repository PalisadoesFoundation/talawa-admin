/**
 * Toolbar — unified search + filter + action header component.
 *
 * Replaces both `PageHeader` (Navbar) and `SearchFilterBar` with a single
 * component that accepts a superset of both APIs.
 *
 * @example
 * ```tsx
 * <Toolbar
 *   search={{
 *     placeholder: 'Search events…',
 *     onSearch: setSearchTerm,
 *   }}
 *   filters={[
 *     {
 *       type: 'sort',
 *       title: 'View type',
 *       options: [{ label: 'Month View', value: 'Month View' }, …],
 *       selected: viewType,
 *       onChange: setViewType,
 *       testIdPrefix: 'selectViewType',
 *     },
 *   ]}
 *   actions={<Button onClick={openModal}>+ Create Event</Button>}
 * />
 * ```
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import SearchBar from 'shared-components/SearchBar/SearchBar';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import type { InterfaceToolbarProps } from 'types/shared-components/Toolbar/interface';
import styles from './Toolbar.module.css';

const Toolbar: React.FC<InterfaceToolbarProps> = ({
  title,
  search,
  filters,
  actions,
  rootClassName,
  containerClassName,
  filtersAriaLabel,
}) => {
  const { t: tCommon } = useTranslation('common');

  // Internal controlled value for the search input
  const [internalSearchValue, setInternalSearchValue] = useState(
    search?.value ?? '',
  );

  // Sync internal value when the controlled prop changes
  useEffect(() => {
    if (search?.value !== undefined) {
      setInternalSearchValue(search.value);
    }
  }, [search?.value]);

  // Debounced version of the parent's onSearch (only used when no onChange)
  const debounceDelay = search?.debounceDelay ?? 300;
  const debouncedOnSearch = useMemo(
    () => debounce((v: string) => search?.onSearch(v), debounceDelay),
    [search?.onSearch, debounceDelay],
  );
  useEffect(() => () => debouncedOnSearch.cancel(), [debouncedOnSearch]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setInternalSearchValue(value);
      if (search?.onChange) {
        search.onChange(value);
      } else {
        // No separate onChange → debounce the onSearch for live filtering
        debouncedOnSearch(value);
      }
    },
    [search, debouncedOnSearch],
  );

  const handleSearchSubmit = useCallback(
    (value: string) => {
      search?.onSearch(value);
    },
    [search],
  );

  const rowClass = [styles.toolbarRow, containerClassName]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={[styles.toolbarWrapper, rootClassName]
        .filter(Boolean)
        .join(' ')}
      data-testid="toolbar"
    >
      {title && <h2 className={styles.toolbarTitle}>{title}</h2>}

      <div className={rowClass}>
        {/* ── Search ── */}
        {search && (
          <>
            {search.ariaDescription && (
              <span id="toolbar-search-desc" className={styles.srOnly}>
                {search.ariaDescription}
              </span>
            )}
            <div className={styles.searchBarWrapper}>
              <SearchBar
                placeholder={search.placeholder}
                value={internalSearchValue}
                onSearch={handleSearchSubmit}
                onChange={handleSearchChange}
                inputTestId={search.inputTestId}
                buttonTestId={search.buttonTestId}
                showSearchButton={false}
                showLeadingIcon
                showClearButton
                aria-describedby={
                  search.ariaDescription ? 'toolbar-search-desc' : undefined
                }
              />
            </div>
          </>
        )}

        {/* ── Filters ── */}
        {filters && filters.length > 0 && (
          <div
            className={styles.filtersBlock}
            role="toolbar"
            aria-label={filtersAriaLabel ?? tCommon('filterAndSortOptions')}
          >
            {filters.map((filter, idx) => {
              const valueMap = new Map(
                filter.options.map((opt) => [String(opt.value), opt.value]),
              );
              return (
                <DropDownButton
                  key={filter.id ?? `${filter.testIdPrefix}-${idx}`}
                  id={filter.dropdownTestId}
                  options={filter.options.map((opt) => ({
                    label: opt.label,
                    value: String(opt.value),
                  }))}
                  selectedValue={String(filter.selected)}
                  onSelect={(val) => filter.onChange(valueMap.get(val) ?? val)}
                  ariaLabel={filter.title}
                  dataTestIdPrefix={filter.testIdPrefix}
                  type={filter.type}
                  icon={
                    filter.icon ? (
                      <img
                        src={filter.icon}
                        alt={tCommon('sortingIcon')}
                        aria-hidden="true"
                      />
                    ) : undefined
                  }
                  buttonLabel={
                    filter.label ??
                    filter.options.find(
                      (o) => String(o.value) === String(filter.selected),
                    )?.label ??
                    String(filter.selected)
                  }
                  variant="outline-secondary"
                  containerClassName={filter.containerClassName}
                  toggleClassName={filter.toggleClassName}
                />
              );
            })}
          </div>
        )}

        {/* ── Actions ── */}
        {actions && <div className={styles.actionsBlock}>{actions}</div>}
      </div>
    </div>
  );
};

export default Toolbar;
