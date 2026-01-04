/**
 * @file Interface definitions for UserPortalNavigationBar component
 *
 * @description
 * This file defines the main component props interface (`InterfaceUserPortalNavbarProps`)
 * for the UserPortalNavigationBar component, which provides a unified navigation bar
 * that adapts to both user mode and organization mode contexts.
 *
 * @module UserPortalNavigationBar/interface
 *
 * @remarks
 * The interface supports extensive customization options including:
 * - **Mode Selection**: Toggle between 'user' and 'organization' modes with different defaults
 * - **Branding**: Customizable logo, brand name, and branding click handlers
 * - **Navigation Links**: Dynamic navigation menu configuration with translation support
 * - **Feature Toggles**: Control visibility of notifications, language selector, and user profile
 * - **Mobile Responsiveness**: Configurable breakpoints and mobile layouts (collapse/offcanvas)
 * - **Custom Handlers**: Override default behavior for logout, language change, and navigation
 * - **State Management**: Support for external state management or internal localStorage/cookie usage
 *
 * @exports InterfaceUserPortalNavbarProps - Main component props interface
 * @exports DEFAULT_USER_MODE_PROPS - Default configuration for user mode
 * @exports DEFAULT_ORGANIZATION_MODE_PROPS - Default configuration for organization mode
 *
 * @see {@link UserPortalNavigationBar} for component implementation
 * @see {@link BrandingConfig} in types.ts for branding configuration
 * @see {@link NavigationLink} in types.ts for navigation link structure
 *
 * @example
 * // User mode navigation
 * <UserPortalNavigationBar mode="user" showNotifications={true} />
 *
 * @example
 * // Organization mode with custom navigation
 * <UserPortalNavigationBar
 *   mode="organization"
 *   organizationId="123"
 *   navigationLinks={[
 *     { id: 'home', label: 'Home', path: '/org/123' },
 *     { id: 'campaigns', label: 'Campaigns', path: '/org/123/campaigns' }
 *   ]}
 *   currentPage="campaigns"
 * />
 */

import React from 'react';
import { BrandingConfig, NavigationLink } from './types';
import { NavigateFunction } from 'react-router';
import { TFunction } from 'i18next';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

/**
 * Main component props interface
 */
export interface InterfaceUserPortalNavbarProps {
  /**
   * Navigation mode - determines default behavior and styling
   * @default 'user'
   */
  mode?: 'user' | 'organization';

  /**
   * Branding configuration for logo and brand name
   */
  branding?: BrandingConfig;

  /**
   * Array of navigation links to display in the navbar
   * Only shown in organization mode or when explicitly provided
   */
  navigationLinks?: NavigationLink[];

  /**
   * Current active page identifier (matches NavigationLink.id)
   * Used to highlight the active navigation link
   */
  currentPage?: string | null;

  /**
   * Organization ID - required for organization mode
   * Used for GraphQL queries and navigation
   */
  organizationId?: string;

  /**
   * Organization name - can be provided directly or fetched via GraphQL
   * If not provided and fetchOrganizationData is true, will be fetched
   */
  organizationName?: string;

  /**
   * Whether to fetch organization data via GraphQL
   * @default true when mode === 'organization'
   */
  fetchOrganizationData?: boolean;

  /**
   * Show notification icon component
   * @default true when mode === 'user', false when mode === 'organization'
   */
  showNotifications?: boolean;

  /**
   * Show language selector dropdown
   * @default true
   */
  showLanguageSelector?: boolean;

  /**
   * Show user profile dropdown
   * @default true
   */
  showUserProfile?: boolean;

  /**
   * Navbar color variant
   * @default 'dark'
   */
  variant?: 'dark' | 'light';

  /**
   * Breakpoint at which navbar expands
   * @default 'md'
   */
  expandBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Mobile layout style
   * @default 'collapse' for user mode, 'offcanvas' for organization mode
   */
  mobileLayout?: 'collapse' | 'offcanvas';

  /**
   * Custom logout handler
   * If not provided, uses default logout behavior based on mode
   */
  onLogout?: () => void | Promise<void>;

  /**
   * Custom language change handler
   * If not provided, uses default i18next language change
   */
  onLanguageChange?: (languageCode: string) => void | Promise<void>;

  /**
   * Custom navigation handler
   * If not provided, uses react-router navigation
   */
  onNavigation?: (link: NavigationLink) => void | Promise<void>;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  customStyles?: React.CSSProperties;

  /**
   * Override user name (for testing or external state management)
   * If not provided, reads from localStorage
   */
  userName?: string;
}
/**
 * Props interface for LanguageSelector subcomponent
 *
 * @description
 * Defines properties for the language selection dropdown that allows users
 * to switch between available interface languages (en, fr, hi, es, zh).
 *
 * @property {boolean} [showLanguageSelector] - Whether to display the language selector
 * @property {string} [testIdPrefix] - Prefix for test IDs
 * @property {'up' | 'down' | 'start' | 'end'} [dropDirection] - Direction for dropdown menu
 * @property {function} handleLanguageChange - Handler called when language is selected
 * @property {string} [currentLanguageCode] - Currently active language code
 */
export interface InterfaceLanguageSelectorProps {
  showLanguageSelector?: boolean;
  testIdPrefix?: string;
  dropDirection?: 'up' | 'down' | 'start' | 'end';
  handleLanguageChange: (languageCode: string) => void | Promise<void>;
  currentLanguageCode?: string;
}

/**
 * Props interface for UserDropdown subcomponent
 *
 * @property {boolean} showUserProfile - Whether to display the user profile dropdown
 * @property {string} testIdPrefix - Prefix for test IDs
 * @property {'up' | 'down' | 'start' | 'end'} dropDirection - Direction for dropdown menu
 * @property {function} handleLogout - Handler called when logout is clicked
 * @property {string} finalUserName - User display name
 * @property {NavigateFunction} navigate - React Router navigate function
 * @property {TFunction} tCommon - i18next translation function
 * @property {CSSModuleClasses} styles - CSS module classes object
 * @property {OverridableComponent} PermIdentityIcon - Material-UI person icon component
 */
export interface InterfaceUserDropdownProps {
  showUserProfile: boolean;
  testIdPrefix: string;
  dropDirection: 'up' | 'down' | 'start' | 'end';
  handleLogout: () => void;
  finalUserName: string;
  navigate: NavigateFunction;
  tCommon: TFunction;
  styles: CSSModuleClasses;
  PermIdentityIcon: OverridableComponent<SvgIconTypeMap<object, 'svg'>>;
}
/**
 * Default props for user mode
 */
export const DEFAULT_USER_MODE_PROPS: Partial<InterfaceUserPortalNavbarProps> =
  {
    mode: 'user',
    showNotifications: true,
    showLanguageSelector: true,
    showUserProfile: true,
    mobileLayout: 'collapse',
    expandBreakpoint: 'md',
    variant: 'dark',
    fetchOrganizationData: false,
  };

/**
 * Default props for organization mode
 */
export const DEFAULT_ORGANIZATION_MODE_PROPS: Partial<InterfaceUserPortalNavbarProps> =
  {
    mode: 'organization',
    showNotifications: false,
    showLanguageSelector: true,
    showUserProfile: true,
    mobileLayout: 'offcanvas',
    expandBreakpoint: 'md',
    variant: 'dark',
    fetchOrganizationData: true,
  };
