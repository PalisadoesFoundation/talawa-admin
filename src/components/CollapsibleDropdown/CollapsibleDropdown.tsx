/**
 * A collapsible dropdown component that displays a list of sub-targets
 * and allows navigation between them. The dropdown's visibility is
 * controlled by the `showDropdown` state, and it automatically toggles
 * based on the current route.
 *
 *
 * @param props - The props for the component.
 * - target - The target object containing the dropdown's name and sub-targets.
 * - showDropdown - A boolean indicating whether the dropdown is currently visible.
 * - setShowDropdown - A function to toggle the dropdown's visibility.
 *
 * @returns The collapsible dropdown component.
 *
 * @remarks
 * - The dropdown automatically opens if the current route includes 'orgstore'.
 * - Sub-targets are rendered as buttons inside the dropdown, and clicking them navigates to their respective URLs.
 *
 * @example
 * ```tsx
 * <CollapsibleDropdown
 *   target={{
 *     name: 'example',
 *     subTargets: [
 *       { name: 'Sub 1', icon: 'fa-icon-1', url: '/sub1' },
 *       { name: 'Sub 2', icon: 'fa-icon-2', url: '/sub2' },
 *     ],
 *   }}
 *   showDropdown={true}
 *   setShowDropdown={setShowDropdown}
 * />
 * ```
 *
 * Uses -
 * - Conditional rendering for dropdown animation.
 * - `react-router-dom` for navigation and route handling.
 * - `react-i18next` for internationalization support.
 * - `IconComponent` for rendering icons dynamically.
 */
import React, { useEffect } from 'react';

import styles from './CollapsibleDropdown.module.css';
import IconComponent from 'shared-components/IconComponent/IconComponent';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { InterfaceCollapsibleDropdown } from 'types/DropDown/interface';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import Button from 'shared-components/Button';

const CollapsibleDropdown = ({
  target,
  showDropdown,
  setShowDropdown,
}: InterfaceCollapsibleDropdown): JSX.Element => {
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');
  const { name, subTargets } = target;
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // Show dropdown if the current path includes 'orgstore', otherwise hide it.
    if (location.pathname.includes('orgstore')) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [location.pathname]);

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <Button
        className={
          showDropdown
            ? styles.leftDrawerActiveButton
            : styles.leftDrawerInactiveButton
        }
        onClick={(): void => setShowDropdown(!showDropdown)}
        aria-expanded={showDropdown}
        data-testid="collapsible-dropdown"
      >
        <div className={styles.collapsibleDropdownIconWrapper}>
          <IconComponent
            name={name}
            fill={showDropdown ? 'var(--gray-900, #111827)' : 'var(--gray-500)'}
          />
        </div>
        {tCommon(name)}
        <i
          className={`ms-auto fa
          ${showDropdown ? 'var(--surface, #fff)' : 'var(--gray-500)'}
          ${showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}
          `}
        />
      </Button>
      {showDropdown && (
        <div style={{ paddingLeft: '1.5rem' }}>
          {subTargets &&
            subTargets.map(({ name, icon: stringIcon, url }, index) => {
              return (
                <NavLink to={url} key={name}>
                  {({ isActive }) => (
                    <Button
                      key={name}
                      className={
                        isActive
                          ? styles.leftDrawerCollapseActiveButton
                          : styles.leftDrawerInactiveButton
                      }
                      onClick={(): void => {
                        navigate(url);
                      }}
                      data-testid={`collapsible-dropdown-btn-${index}`}
                    >
                      <div className={styles.collapsibleDropdownIconWrapperSm}>
                        <i className={`fa ${stringIcon}`} />
                      </div>
                      {tCommon(name || '')}
                      <div style={{ marginLeft: "auto" }}>
                        <i
                          className={`fa fa-chevron-right ${
                            isActive === true ? 'text-white' : 'text-secondary'
                          }`}
                        />
                      </div>
                    </Button>
                  )}
                </NavLink>
              );
            })}
        </div>
      )}
    </ErrorBoundaryWrapper>
  );
};

export default CollapsibleDropdown;
