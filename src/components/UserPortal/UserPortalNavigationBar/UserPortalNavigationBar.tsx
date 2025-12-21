/**
 * UserPortalNavigationBar Component
 *
 * This component renders a responsive navigation bar for the user portal.
 * It consolidates functionality from UserNavbar and OrganizationNavbar,
 * supporting both user and organization modes with unified logic.
 *
 * @component
 * @param {InterfaceUserPortalNavbarProps} props - Component props
 * @returns {JSX.Element} The rendered UserPortalNavigationBar component
 */
import React, { useState } from 'react';
import { Container, Navbar, Nav, Dropdown, Offcanvas } from 'react-bootstrap';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import cookies from 'js-cookie';
import i18next from 'i18next';
import type { DropDirection } from 'react-bootstrap/esm/DropdownContext';

import { InterfaceUserPortalNavbarProps } from 'types/UserPortalNavigationBar/interface';
import { NavigationLink } from 'types/UserPortalNavigationBar/types';
import {
  DEFAULT_USER_MODE_PROPS,
  DEFAULT_ORGANIZATION_MODE_PROPS,
} from 'types/UserPortalNavigationBar/interface';
import styles from './UserPortalNavigationBar.module.css';
import TalawaImage from 'assets/images/talawa-logo-600x600.png';
import { languages } from 'utils/languages';
import useLocalStorage from 'utils/useLocalstorage';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import NotificationIcon from 'components/NotificationIcon/NotificationIcon';

export const UserPortalNavigationBar = (
  props: InterfaceUserPortalNavbarProps,
): JSX.Element => {
  // Merge props with defaults based on mode
  let { mode } = props;
  mode = mode || 'user';

  const defaults =
    mode === 'organization'
      ? DEFAULT_ORGANIZATION_MODE_PROPS
      : DEFAULT_USER_MODE_PROPS;

  const {
    branding,
    navigationLinks,
    currentPage,
    organizationId,
    organizationName,
    fetchOrganizationData = defaults.fetchOrganizationData ?? false,
    showNotifications = defaults.showNotifications ?? true,
    showLanguageSelector = defaults.showLanguageSelector ?? true,
    showUserProfile = defaults.showUserProfile ?? true,
    variant = defaults.variant ?? 'dark',
    expandBreakpoint = defaults.expandBreakpoint ?? 'md',
    mobileLayout = defaults.mobileLayout ?? 'collapse',
    onLogout,
    onLanguageChange,
    onNavigation,
    className,
    customStyles,
    userName,
  } = props;

  const [currentLanguageCode, setCurrentLanguageCode] = useState(
    cookies.get('i18next') || 'en',
  );

  const { t } = useTranslation('translation', {
    keyPrefix: 'userNavbar',
  });
  const { t: tCommon } = useTranslation('common');

  const { orgId } = useParams();
  const { getItem, clearAllItems } = useLocalStorage();
  const navigate = useNavigate();

  const finalOrganizationId = organizationId || orgId;
  const shouldFetchOrgData =
    mode === 'organization' && fetchOrganizationData && finalOrganizationId;

  // GraphQL query for organization data
  const { data: orgData } = useQuery(GET_ORGANIZATION_BASIC_DATA, {
    variables: { id: finalOrganizationId },
    skip: !shouldFetchOrgData,
  });

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  // Determine final values
  const finalUserName = userName || (getItem('name') as string);
  const finalOrganizationName =
    organizationName ||
    orgData?.organization?.name ||
    (mode === 'user' ? t('talawa') : '');

  const dropDirection: DropDirection = 'start';
  const homeLink = finalOrganizationId
    ? `/user/organization/${finalOrganizationId}`
    : '#';

  // Handle language change
  const handleLanguageChange = async (languageCode: string): Promise<void> => {
    setCurrentLanguageCode(languageCode);
    await i18next.changeLanguage(languageCode);
    cookies.set('i18next', languageCode);
    if (onLanguageChange) {
      await onLanguageChange(languageCode);
    }
  };

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    if (onLogout) {
      await onLogout();
      return;
    }

    if (mode === 'organization') {
      clearAllItems();
      window.location.replace('/');
    } else {
      revokeRefreshToken();
      clearAllItems();
      navigate('/');
    }
  };

  // Handle navigation
  const handleNavigation = async (link: NavigationLink): Promise<void> => {
    if (onNavigation) {
      await onNavigation(link);
      return;
    }
    if (link.onClick) {
      await link.onClick();
    } else {
      navigate(link.path);
    }
  };

  // Determine if link is active
  const isLinkActive = (link: NavigationLink): boolean => {
    if (link.isActive !== undefined) return link.isActive;
    return currentPage === link.id || currentPage === link.path;
  };

  // Brand click handler
  const handleBrandClick = (): void => {
    if (branding?.onBrandClick) {
      branding.onBrandClick();
    } else if (homeLink !== '#') {
      navigate(homeLink);
    }
  };

  // Logo source
  const logoSource = branding?.logo || TalawaImage;
  const logoAltText = branding?.logoAltText || t('talawaBranding');
  const brandNameText = branding?.brandName || finalOrganizationName;

  // Render language dropdown
  const renderLanguageDropdown = (testIdPrefix = ''): JSX.Element | null => {
    if (!showLanguageSelector) return null;

    return (
      <Dropdown
        data-testid={`${testIdPrefix}languageDropdown`}
        drop={dropDirection}
      >
        <Dropdown.Toggle
          variant="white"
          id="dropdown-basic"
          data-testid={`${testIdPrefix}languageDropdownToggle`}
          className={styles.colorWhite}
        >
          <LanguageIcon
            className={styles.colorWhite}
            data-testid={`${testIdPrefix}languageIcon`}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {languages.map((language, index: number) => (
            <Dropdown.Item
              key={index}
              onClick={async (): Promise<void> => {
                await handleLanguageChange(language.code);
              }}
              disabled={currentLanguageCode === language.code}
              data-testid={`${testIdPrefix}changeLanguageBtn${index}`}
            >
              <span className={`fi fi-${language.country_code} mr-2`}></span>{' '}
              {language.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  // Render user profile dropdown
  const renderUserProfileDropdown = (testIdPrefix = ''): JSX.Element | null => {
    if (!showUserProfile) return null;

    return (
      <Dropdown drop={dropDirection}>
        <Dropdown.Toggle
          variant="white"
          id="dropdown-basic"
          data-testid={`${testIdPrefix}logoutDropdown`}
          className={styles.colorWhite}
        >
          <PermIdentityIcon
            className={styles.colorWhite}
            data-testid={`${testIdPrefix}personIcon`}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.ItemText>
            <b>{finalUserName || ''}</b>
          </Dropdown.ItemText>
          <Dropdown.Item
            onClick={() => navigate('/user/settings')}
            className={styles.link}
          >
            {tCommon('settings')}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleLogout}
            data-testid={`${testIdPrefix}logoutBtn`}
          >
            {tCommon('logout')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  // Render navigation links
  const renderNavigationLinks = (): JSX.Element | null => {
    if (!navigationLinks || navigationLinks.length === 0) return null;

    return (
      <Nav className="me-auto flex-grow-1 pe-3 pt-1" variant="dark">
        {navigationLinks.map((link: NavigationLink) => {
          const linkLabel = link.translationKey
            ? t(link.translationKey.split(':').pop() || link.translationKey)
            : link.label;

          return (
            <Nav.Link
              key={link.id}
              active={isLinkActive(link)}
              onClick={async (): Promise<void> => {
                await handleNavigation(link);
              }}
              data-testid={link.testId || `navigationLink-${link.id}`}
            >
              {link.icon && <link.icon className="me-2" />}
              {linkLabel}
            </Nav.Link>
          );
        })}
      </Nav>
    );
  };

  // Render desktop content (navigation links on left, dropdowns on right)
  const renderDesktopContent = (): JSX.Element => (
    <>
      {renderNavigationLinks()}
      <Navbar.Collapse className="justify-content-end">
        {renderLanguageDropdown()}
        {showNotifications && mode === 'user' && <NotificationIcon />}
        {renderUserProfileDropdown()}
      </Navbar.Collapse>
    </>
  );

  // Render mobile content (inside Offcanvas)
  const renderMobileContent = (): JSX.Element => (
    <>
      {renderNavigationLinks()}
      <Navbar.Collapse className="justify-content-end">
        {renderLanguageDropdown('mobile')}
        {showNotifications && mode === 'user' && <NotificationIcon />}
        {renderUserProfileDropdown('mobile')}
      </Navbar.Collapse>
    </>
  );

  // Determine navbar className
  const navbarClassName = `${styles.colorPrimary} ${className || ''}`.trim();

  // Render based on mobile layout
  if (mobileLayout === 'offcanvas') {
    return (
      <Navbar
        expand={expandBreakpoint}
        variant={variant}
        className={navbarClassName}
        style={customStyles}
      >
        <Container fluid>
          <Navbar.Brand
            href={homeLink}
            onClick={(e) => {
              e.preventDefault();
              handleBrandClick();
            }}
          >
            <img
              className={styles.talawaImage}
              src={logoSource}
              alt={logoAltText}
              data-testid="brandLogo"
            />
            <b data-testid="brandName">{brandNameText}</b>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-md" />
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-md"
            aria-labelledby="offcanvasNavbar-expand-md"
            placement="end"
            className={styles.offcanvasContainer}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title data-testid="offcanvasTitle">
                {t('talawa')}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>{renderMobileContent()}</Offcanvas.Body>
          </Navbar.Offcanvas>
          {renderDesktopContent()}
        </Container>
      </Navbar>
    );
  }

  // Collapse layout (default for user mode)
  return (
    <Navbar
      expand={expandBreakpoint}
      variant={variant}
      className={navbarClassName}
      style={customStyles}
    >
      <Container fluid>
        <Navbar.Brand
          href={homeLink}
          onClick={(e) => {
            e.preventDefault();
            handleBrandClick();
          }}
        >
          <img
            className={styles.talawaImage}
            src={logoSource}
            alt={logoAltText}
            data-testid="brandLogo"
          />
          <b data-testid="brandName">{brandNameText}</b>
        </Navbar.Brand>
        <Navbar.Toggle />
        {renderDesktopContent()}
      </Container>
    </Navbar>
  );
};
