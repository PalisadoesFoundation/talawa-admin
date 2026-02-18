import React from 'react';
/**
 * Type definitions for UserPortalNavigationBar
 *
 * This file contains all TypeScript type definitions used by the UserPortalNavigationBar component.
 * It provides comprehensive type safety for navigation configuration, branding, user profile menus,
 * organization data, and component state management.
 *
 *
 * @remarks
 * The types defined here support both user mode and organization mode navigation, enabling:
 * - Customizable branding and logo configuration
 * - Navigation link management with translation support
 * - User profile menu items with icon and action handlers
 * - Language selection and internationalization
 * - Organization data from GraphQL queries
 * - Mobile-responsive menu state management
 *
 * @see {@link UserPortalNavigationBar} for component implementation
 * @see {@link InterfaceUserPortalNavbarProps} in interface.ts for props definition
 */

/**
 * User profile menu item configuration
 */
export type UserProfileMenuItem = {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Display label or translation key
   */
  label: string;

  /**
   * Translation key prefix (optional)
   * @defaultValue 'common'
   */
  translationKey?: string;

  /**
   * Icon component (optional)
   */
  icon?: React.ComponentType<{ className?: string }>;

  /**
   * Click handler
   */
  onClick: () => void | Promise<void>;

  /**
   * Whether this is a divider item (renders as Dropdown.Divider)
   */
  isDivider?: boolean;

  /**
   * Test ID for testing
   */
  testId?: string;
};
/**
 * Language configuration (from utils/languages)
 */
export type Language = {
  code: string;
  name: string;
  country_code: string;
};
/**
 * Branding configuration for the navbar
 */
export type BrandingConfig = {
  /**
   * Logo image source URL or path
   * @defaultValue Talawa logo from assets/images/talawa-logo-600x600.png
   */
  logo?: string;

  /**
   * Brand name to display next to logo
   * @defaultValue 'Talawa' for user mode, organization name for organization mode
   */
  brandName?: string;

  /**
   * Alt text for logo image
   * @defaultValue Translation key 'userNavbar.talawaBranding'
   */
  logoAltText?: string;

  /**
   * Click handler for brand/logo
   * @defaultValue undefined (no action)
   */
  onBrandClick?: () => void;
};

/**
 * Navigation link configuration
 */
export type NavigationLink = {
  /**
   * Unique identifier for the link (used for active state)
   */
  id: string;

  /**
   * Display text for the link
   */
  label: string;

  /**
   * URL path or route
   */
  path: string;

  /**
   * Translation key (optional, overrides label if provided)
   * Should be in format 'namespace:key' or just 'key' (uses default namespace)
   */
  translationKey?: string;

  /**
   * Icon component (optional)
   */
  icon?: React.ComponentType<{ className?: string }>;

  /**
   * Whether this link is currently active
   * @defaultValue false (will be determined by comparing id with currentPage)
   */
  isActive?: boolean;

  /**
   * Click handler (optional, overrides @defaultValue navigation)
   */
  onClick?: () => void | Promise<void>;

  /**
   * Additional data attributes for testing
   */
  testId?: string;
};
/**
 * GraphQL query response structure for organization list
 */
export type OrganizationListQueryResponse = {
  organizations: OrganizationData[];
};

/**
 * Internal component state
 */
export type UserPortalNavbarState = {
  /**
   * Current selected language code
   */
  currentLanguageCode: string;

  /**
   * Organization details (null for user mode or when not fetched)
   */
  organizationDetails: OrganizationData | null;

  /**
   * Whether mobile menu is open
   */
  isMobileMenuOpen: boolean;

  /**
   * User name from localStorage
   */
  userName: string | null;
};

/**
 * Organization data structure (from GraphQL ORGANIZATION_LIST query)
 */
export type OrganizationData = {
  id: string;
  name: string;
  addressLine1?: string;
  description?: string;
  avatarURL?: string;
  membersCount?: number;
  adminsCount?: number;
  createdAt?: string;
};
