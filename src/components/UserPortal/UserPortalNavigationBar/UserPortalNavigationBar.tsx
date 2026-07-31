/**
 * UserPortalNavigationBar Component
 *
 * This component renders a responsive navigation bar for the user portal.
 * It consolidates functionality from UserNavbar and OrganizationNavbar,
 * supporting both user and organization modes with unified logic.
 *
 * @param props - Component props
 * @returns The rendered UserPortalNavigationBar component
 */
import { useState } from 'react';

import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import cookies from 'js-cookie';
import i18next from 'i18next';

import {
  InterfaceUserPortalNavbarProps,
  DEFAULT_USER_MODE_PROPS,
  DEFAULT_ORGANIZATION_MODE_PROPS,
} from 'types/UserPortal/UserPortalNavigationBar/interface';
import { NavigationLink } from 'types/UserPortal/UserPortalNavigationBar/types';
import styles from './UserPortalNavigationBar.module.css';
import TalawaImage from 'assets/images/talawa-logo-600x600.png';
import useLocalStorage from 'utils/useLocalstorage';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';
import NotificationIcon from 'components/NotificationIcon/NotificationIcon';
import LanguageSelector from './LanguageSelector';
import UserProfileDropdown from './UserDropdown';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import Button from 'shared-components/Button';

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
    mobileLayout = defaults.mobileLayout ?? 'collapse',
    onLogout,
    onLanguageChange,
    onNavigation,
    className,
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

  const [logout] = useMutation(LOGOUT_MUTATION);

  // Determine final values
  const finalUserName = userName || (getItem('name') as string);
  const finalOrganizationName =
    organizationName ||
    orgData?.organization?.name ||
    (mode === 'user' ? tCommon('talawa') : '');

  const dropDirection = 'start' as const;
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
      try {
        await logout();
      } catch {
        NotificationToast.error(tCommon('logoutFailed'));
      }

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
  const logoAltText = branding?.logoAltText || tCommon('talawaBranding');
  const brandNameText = branding?.brandName || finalOrganizationName;

  // Render navigation links
  const renderNavigationLinks = (): JSX.Element | null => {
    if (!navigationLinks || navigationLinks.length === 0) return null;

    return (
      <nav className={styles.navLinksRow}>
        {navigationLinks.map((link: NavigationLink) => {
          const linkLabel = link.translationKey
            ? t(link.translationKey.split(':').pop() || link.translationKey)
            : link.label;

          return (
            <Button
              variant="plain"
              key={link.id}
              type="button"
              className={`${isLinkActive(link) ? styles.navLinkActive : styles.navLink} ${styles.navLinkBtn}`}
              onClick={async (): Promise<void> => {
                await handleNavigation(link);
              }}
              data-testid={link.testId || `navigationLink-${link.id}`}
            >
              {link.icon && <link.icon className={styles.linkIcon} />}
              {linkLabel}
            </Button>
          );
        })}
      </nav>
    );
  };

  // Render desktop content (navigation links on left, dropdowns on right)
  const renderDesktopContent = (): JSX.Element => (
    <>
      {renderNavigationLinks()}
      <div className={styles.actionsRow}>
        <LanguageSelector
          showLanguageSelector={showLanguageSelector}
          testIdPrefix={''}
          dropDirection={dropDirection}
          handleLanguageChange={handleLanguageChange}
          currentLanguageCode={currentLanguageCode}
        />
        {showNotifications && mode === 'user' && <NotificationIcon />}
        <UserProfileDropdown
          showUserProfile={showUserProfile}
          dropDirection={dropDirection}
          handleLogout={handleLogout}
          finalUserName={finalUserName}
          navigate={navigate}
          tCommon={tCommon}
          styles={styles}
          PermIdentityIcon={PermIdentityIcon}
          testIdPrefix=""
        />
      </div>
    </>
  );

  // Determine navbar className
  const navbarClassName = `${styles.colorPrimary} ${className || ''}`.trim();

  // Render based on mobile layout
  if (mobileLayout === 'offcanvas') {
    return (
      <nav className={`${navbarClassName} ${styles.navBar}`}>
        <div className={styles.navInner}>
          <a
            href={homeLink}
            onClick={(e) => {
              e.preventDefault();
              handleBrandClick();
            }}
            className={styles.brandLink}
          >
            <img
              className={styles.talawaImage}
              src={logoSource}
              alt={logoAltText}
              data-testid="brandLogo"
            />
            <b data-testid="brandName">{brandNameText}</b>
          </a>
          {renderDesktopContent()}
        </div>
      </nav>
    );
  }

  // Collapse layout (default for user mode)
  return (
    <nav className={`${navbarClassName} ${styles.navBar}`}>
      <div className={styles.navInner}>
        <a
          href={homeLink}
          onClick={(e) => {
            e.preventDefault();
            handleBrandClick();
          }}
          className={styles.brandLink}
        >
          <img
            className={styles.talawaImage}
            src={logoSource}
            alt={logoAltText}
            data-testid="brandLogo"
          />
          <b data-testid="brandName">{brandNameText}</b>
        </a>
        {renderDesktopContent()}
      </div>
    </nav>
  );
};
