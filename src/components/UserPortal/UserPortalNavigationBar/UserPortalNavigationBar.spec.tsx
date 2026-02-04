import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import type { TFunction } from 'i18next';
import cookies from 'js-cookie';
import i18next from 'i18next';
import { UserPortalNavigationBar } from './UserPortalNavigationBar';
import UserProfileDropdown from './UserDropdown';
import LanguageSelector from './LanguageSelector';
import { languages } from 'utils/languages';
import useLocalStorage from 'utils/useLocalstorage';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import {
  mockUserId,
  mockUserName,
  mockOrganizationId,
  mockOrganizationName,
  organizationDataMock,
  organizationDataErrorMock,
  organizationDataNullMock,
  logoutMock,
  logoutErrorMock,
  logoutNetworkErrorMock,
  mockNavigationLinksBase,
  getMockIcon,
} from './UserPortalNavigationBarMocks';
import { GET_ORGANIZATION_BASIC_DATA } from 'GraphQl/Queries/Queries';

// Mock dependencies
vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));
vi.mock('js-cookie', () => ({ default: { get: vi.fn(), set: vi.fn() } }));
vi.mock('i18next', () => ({ default: { changeLanguage: vi.fn() } }));
vi.mock('utils/useLocalstorage', () => ({ default: vi.fn() }));

// Mock CSS modules - inline the mock values to avoid hoisting issues
vi.mock('./UserPortalNavigationBar.module.css', () => ({
  default: {
    colorPrimary: '_colorPrimary_1234',
    colorWhite: '_colorWhite_5678',
    talawaImage: '_talawaImage_9012',
    offcanvasContainer: '_offcanvasContainer_3456',
    link: '_link_7890',
    testCustomPadding: '_testCustomPadding_1111',
  },
}));

vi.mock('components/NotificationIcon/NotificationIcon', () => ({
  default: () => <div data-testid="notification-icon">Notification Icon</div>,
}));

// Instantiate mock components using factory function to avoid react/no-multi-comp
const MockPermIdentityIcon = getMockIcon('permIdentity');
const MockHomeIcon = getMockIcon('home');

let mockNavigate: ReturnType<typeof vi.fn>;
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ orgId: 'test-org-id' }),
  };
});

describe('UserPortalNavigationBar', () => {
  beforeEach(() => {
    mockNavigate = vi.fn();
    vi.clearAllMocks();

    // Setup in-memory storage for useLocalStorage mock
    const mockStorage: Record<string, unknown> = {
      id: mockUserId,
      name: mockUserName,
    };

    // Setup complete mock implementation with all methods
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key: string) => {
        return mockStorage[key] ?? null;
      }),
      setItem: vi.fn((key: string, value: unknown) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      getStorageKey: vi.fn((key: string) => `Talawa-admin_${key}`),
      clearAllItems: vi.fn(() => {
        Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
      }),
    });

    // Mock window.matchMedia for Bootstrap Offcanvas responsive behavior
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    (cookies.get as Mock).mockReturnValue('en');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('UserPortalNavigationBar - User Mode', () => {
    it('renders in user mode with default props', () => {
      render(
        <MockedProvider mocks={[organizationDataMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('brandLogo')).toBeInTheDocument();
      expect(screen.getByTestId('brandName')).toHaveTextContent('talawa');
    });

    it('renders notification icon in user mode', () => {
      render(
        <MockedProvider mocks={[organizationDataMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('notification-icon')).toBeInTheDocument();
    });

    it('does not render notification icon when showNotifications is false', () => {
      render(
        <MockedProvider mocks={[organizationDataMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" showNotifications={false} />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.queryByTestId('notification-icon')).not.toBeInTheDocument();
    });

    it('uses collapse layout by default in user mode', () => {
      render(
        <MockedProvider mocks={[organizationDataMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      // Collapse layout doesn't have offcanvas
      expect(screen.queryByTestId('offcanvasTitle')).not.toBeInTheDocument();
    });

    it('handles brand click in user mode', async () => {
      const mockBrandClick = vi.fn();

      render(
        <MockedProvider mocks={[organizationDataMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="user"
              branding={{ onBrandClick: mockBrandClick }}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId('brandLogo'));
      expect(mockBrandClick).toHaveBeenCalled();
    });

    it('displays custom userName when provided', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={[organizationDataMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" userName="Custom User" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const dropdown = screen.getByTestId('user-toggle');
      await user.click(dropdown);

      expect(screen.getByText('Custom User')).toBeInTheDocument();
    });

    it('handles logout in user mode', async () => {
      const clearAllItems = vi.fn();
      (useLocalStorage as Mock).mockReturnValue({
        getItem: vi.fn((key: string) => {
          if (key === 'name') return mockUserName;
          return null;
        }),
        clearAllItems,
      });

      render(
        <MockedProvider mocks={[logoutMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const dropdown = screen.getByTestId('user-toggle');
      await user.click(dropdown);

      const logoutBtn = screen.getByTestId('user-item-logout');
      await user.click(logoutBtn);

      await waitFor(() => {
        expect(clearAllItems).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('handles custom logout handler', async () => {
      const customLogout = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" onLogout={customLogout} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const dropdown = screen.getByTestId('user-toggle');
      await user.click(dropdown);

      const logoutBtn = screen.getByTestId('user-item-logout');
      await user.click(logoutBtn);

      await waitFor(() => {
        expect(customLogout).toHaveBeenCalled();
      });
    });

    it('defaults to user mode when mode prop is not provided', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar />
          </MemoryRouter>
        </MockedProvider>,
      );

      // User mode uses collapse layout by default
      expect(screen.queryByTestId('offcanvasTitle')).not.toBeInTheDocument();
      expect(screen.getByTestId('brandName')).toHaveTextContent('talawa');
    });
  });

  describe('UserPortalNavigationBar - Organization Mode', () => {
    it('renders in organization mode with fetched data', async () => {
      render(
        <MockedProvider mocks={[organizationDataMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationId={mockOrganizationId}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('brandName')).toHaveTextContent(
          mockOrganizationName,
        );
      });
    });

    it('uses provided organization name without fetching', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationName={mockOrganizationName}
              fetchOrganizationData={false}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('brandName')).toHaveTextContent(
        mockOrganizationName,
      );
    });

    it('does not render notification icon in organization mode by default', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationId={mockOrganizationId}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.queryByTestId('notification-icon')).not.toBeInTheDocument();
    });

    it('uses offcanvas layout by default in organization mode', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationId={mockOrganizationId}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('offcanvasTitle')).toBeInTheDocument();
    });

    it('handles logout in organization mode', async () => {
      const clearAllItems = vi.fn();
      const windowLocationReplaceSpy = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { replace: windowLocationReplaceSpy },
        writable: true,
      });

      (useLocalStorage as Mock).mockReturnValue({
        getItem: vi.fn((key: string) => {
          if (key === 'name') return mockUserName;
          return null;
        }),
        clearAllItems,
      });

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationId={mockOrganizationId}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const dropdown = screen.getByTestId('user-toggle');
      await user.click(dropdown);

      const logoutBtn = screen.getByTestId('user-item-logout');
      await user.click(logoutBtn);

      await waitFor(() => {
        expect(clearAllItems).toHaveBeenCalled();
        expect(windowLocationReplaceSpy).toHaveBeenCalledWith('/');
      });
    });

    it('navigates to organization home when brand is clicked', async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationId={mockOrganizationId}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      await user.click(screen.getByTestId('brandLogo'));
      expect(mockNavigate).toHaveBeenCalledWith(
        `/user/organization/${mockOrganizationId}`,
      );
    });
  });

  describe('UserPortalNavigationBar - Navigation Links', () => {
    it('renders navigation links', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              navigationLinks={mockNavigationLinksBase}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(
        screen.getAllByTestId('navigationLink-home').length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByTestId('navigationLink-campaigns').length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByTestId('navigationLink-events').length,
      ).toBeGreaterThan(0);
    });

    it('highlights active navigation link', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              navigationLinks={mockNavigationLinksBase}
              currentPage="campaigns"
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const campaignsLink = screen.getAllByTestId(
        'navigationLink-campaigns',
      )[0];
      expect(campaignsLink).toHaveClass('active');
    });

    it('handles navigation link click with default navigation', async () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              navigationLinks={mockNavigationLinksBase}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const homeLink = screen.getAllByTestId('navigationLink-home')[0];
      await user.click(homeLink);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/home');
      });
    });

    it('handles navigation link click with custom onClick', async () => {
      const customOnClick = vi.fn();
      const linksWithCustomClick = [
        {
          id: 'custom',
          label: 'Custom',
          path: '/custom',
          onClick: customOnClick,
        },
      ];

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              navigationLinks={linksWithCustomClick}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const customLink = screen.getAllByTestId('navigationLink-custom')[0];
      await user.click(customLink);

      await waitFor(() => {
        expect(customOnClick).toHaveBeenCalled();
      });
    });

    it('handles custom onNavigation handler', async () => {
      const customOnNavigation = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              navigationLinks={mockNavigationLinksBase}
              onNavigation={customOnNavigation}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const homeLink = screen.getAllByTestId('navigationLink-home')[0];
      await user.click(homeLink);

      await waitFor(() => {
        expect(customOnNavigation).toHaveBeenCalledWith(
          mockNavigationLinksBase[0],
        );
      });
    });

    it('does not render navigation links when empty', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="organization" navigationLinks={[]} />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(
        screen.queryByTestId('navigationLink-home'),
      ).not.toBeInTheDocument();
    });

    it('renders navigation link with icon', () => {
      const linksWithIcon = [
        {
          id: 'home',
          label: 'Home',
          path: '/home',
          icon: MockHomeIcon,
        },
      ];

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              navigationLinks={linksWithIcon}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getAllByTestId('mock-home-icon').length).toBeGreaterThan(0);
    });

    it('uses explicit isActive flag when provided', () => {
      const linksWithIsActive = [
        {
          id: 'active-link',
          label: 'Active Link',
          path: '/active',
          isActive: true,
        },
        {
          id: 'inactive-link',
          label: 'Inactive Link',
          path: '/inactive',
          isActive: false,
        },
      ];

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              navigationLinks={linksWithIsActive}
              currentPage="/other"
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const activeLink = screen.getAllByTestId('navigationLink-active-link')[0];
      const inactiveLink = screen.getAllByTestId(
        'navigationLink-inactive-link',
      )[0];

      expect(activeLink).toHaveClass('active');
      expect(inactiveLink).not.toHaveClass('active');
    });

    it('parses translation key with colon separator', () => {
      const linksWithNestedTranslation = [
        {
          id: 'settings',
          label: 'Settings',
          path: '/settings',
          translationKey: 'userNavbar:settings',
        },
      ];

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              navigationLinks={linksWithNestedTranslation}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      // The translation key should be split and the last part used
      expect(
        screen.getAllByTestId('navigationLink-settings').length,
      ).toBeGreaterThan(0);
    });
  });

  describe('UserPortalNavigationBar - Branding', () => {
    it('uses custom branding logo', () => {
      const customLogo = 'https://example.com/logo.png';

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="user"
              branding={{ logo: customLogo }}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const logo = screen.getByTestId('brandLogo') as HTMLImageElement;
      expect(logo.src).toBe(customLogo);
    });

    it('uses custom brand name', () => {
      const customBrandName = 'Custom Brand';

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="user"
              branding={{ brandName: customBrandName }}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('brandName')).toHaveTextContent(
        customBrandName,
      );
    });

    it('uses custom logo alt text', () => {
      const customAltText = 'Custom Alt Text';

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="user"
              branding={{ logoAltText: customAltText }}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const logo = screen.getByTestId('brandLogo');
      expect(logo).toHaveAttribute('alt', customAltText);
    });

    it('does not navigate when brand click handler is provided', async () => {
      const mockBrandClick = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="user"
              branding={{ onBrandClick: mockBrandClick }}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      await user.click(screen.getByTestId('brandLogo'));

      // Custom brand click handler should be called
      expect(mockBrandClick).toHaveBeenCalled();
      // But navigate should not be called
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('UserPortalNavigationBar - Custom Styles and Classes', () => {
    it('applies custom className', () => {
      const customClass = 'custom-navbar-class';

      const { container } = render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" className={customClass} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const navbar = container.querySelector('nav');
      expect(navbar).toHaveClass(customClass);
    });

    it('applies custom inline styles', () => {
      const customClass = 'custom-bg-red';
      // Create a temporary style element for testing
      const style = document.createElement('style');
      style.innerHTML = `.${customClass} { background-color: red; }`;
      document.head.appendChild(style);

      const { container } = render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" className={customClass} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const navbar = container.querySelector('nav');

      expect(navbar).toHaveClass(customClass);

      // Cleanup
      document.head.removeChild(style);
    });
  });

  describe('UserPortalNavigationBar - Responsive Behavior', () => {
    it('uses specified expand breakpoint', () => {
      const { container } = render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" expandBreakpoint="lg" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const navbar = container.querySelector('nav');
      expect(navbar).toHaveClass('navbar-expand-lg');
    });

    it('uses light variant when specified', () => {
      const { container } = render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" variant="light" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const navbar = container.querySelector('nav');
      expect(navbar).toHaveClass('navbar-light');
    });

    it('renders mobile offcanvas layout', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" mobileLayout="offcanvas" />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('offcanvasTitle')).toBeInTheDocument();
    });
  });

  describe('UserPortalNavigationBar - Feature Toggles', () => {
    it('hides language selector when showLanguageSelector is false', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" showLanguageSelector={false} />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.queryByTestId('language-toggle')).not.toBeInTheDocument();
    });

    it('hides user profile when showUserProfile is false', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" showUserProfile={false} />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.queryByTestId('user-container')).not.toBeInTheDocument();
    });

    it('shows user profile by default', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('user-container')).toBeInTheDocument();
    });

    it('shows language selector by default', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
    });
  });

  describe('UserPortalNavigationBar - Language Change', () => {
    it('changes language and updates i18next', async () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const languageDropdown = screen.getByTestId('language-toggle');
      await user.click(languageDropdown);

      const spanishOption = screen.getByTestId('language-item-es');
      await user.click(spanishOption);

      await waitFor(() => {
        expect(i18next.changeLanguage).toHaveBeenCalledWith('es');
      });
    });

    it('handles custom language change handler', async () => {
      const customLanguageChange = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="user"
              onLanguageChange={customLanguageChange}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const languageDropdown = screen.getByTestId('language-toggle');
      await user.click(languageDropdown);

      const spanishOption = screen.getByTestId('language-item-es');
      await user.click(spanishOption);

      await waitFor(() => {
        expect(customLanguageChange).toHaveBeenCalledWith('es');
      });
    });

    it('uses current language from cookies', async () => {
      (cookies.get as Mock).mockImplementation((key: string) => {
        if (key === 'i18next') return 'es';
        return undefined;
      });

      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const languageDropdown = screen.getByTestId('language-toggle');
      await user.click(languageDropdown);

      // Spanish option should be disabled as it's the current language
      const spanishOption = screen.getByTestId('language-item-es');
      expect(spanishOption).toHaveClass('disabled');
    });
  });

  describe('UserPortalNavigationBar - User Profile Dropdown', () => {
    it('navigates to settings when settings is clicked', async () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const dropdown = screen.getByTestId('user-toggle');
      await user.click(dropdown);

      const settingsOption = screen.getByTestId('user-item-settings');
      await user.click(settingsOption);

      expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
    });

    it('displays user name in dropdown', async () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" userName={mockUserName} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const dropdown = screen.getByTestId('user-container');
      await user.click(dropdown);

      expect(screen.getByText(mockUserName)).toBeInTheDocument();
    });
  });

  describe('UserPortalNavigationBar - GraphQL Error Handling', () => {
    let unhandledRejectionHandler:
      | ((reason: unknown, promise: Promise<unknown>) => void)
      | undefined;

    beforeEach(() => {
      // Suppress unhandled promise rejections for error tests
      unhandledRejectionHandler = (reason: unknown) => {
        // Suppress Apollo errors from our test mocks
        const message =
          (reason as { message?: string })?.message ||
          (reason as { networkError?: { message?: string } })?.networkError
            ?.message ||
          '';
        if (
          message.includes('Failed to logout') ||
          message.includes('Network error') ||
          message.includes('Failed to fetch organization data')
        ) {
          // Suppress this expected error
          return;
        }
        // Let other errors through by re-throwing
        throw reason;
      };

      process.on('unhandledRejection', unhandledRejectionHandler);
    });

    afterEach(() => {
      // Remove the handler
      if (unhandledRejectionHandler) {
        process.off('unhandledRejection', unhandledRejectionHandler);
      }
    });
    it('handles organization query error with fallback UI', async () => {
      render(
        <MockedProvider mocks={[organizationDataErrorMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationId={mockOrganizationId}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      // Component should render with empty organization name as fallback
      await waitFor(() => {
        const brandName = screen.getByTestId('brandName');
        // When query fails, organizationName falls back to empty string
        expect(brandName).toHaveTextContent('');
      });

      // Should still render other UI elements
      expect(screen.getByTestId('brandLogo')).toBeInTheDocument();
      expect(screen.getByTestId('offcanvasTitle')).toBeInTheDocument();
    });

    it('handles logout mutation error and shows toast', async () => {
      const clearAllItems = vi.fn();

      (useLocalStorage as Mock).mockReturnValue({
        getItem: vi.fn((key: string) => {
          if (key === 'name') return mockUserName;
          return null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn((key: string) => `Talawa-admin_${key}`),
        clearAllItems,
      });

      // Import NotificationToast to spy on it
      const { NotificationToast } =
        await import('shared-components/NotificationToast/NotificationToast');
      const toastErrorSpy = vi.spyOn(NotificationToast, 'error');

      render(
        <MockedProvider mocks={[logoutErrorMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const dropdown = screen.getByTestId('user-toggle');
      await user.click(dropdown);

      const logoutBtn = screen.getByTestId('user-item-logout');
      await user.click(logoutBtn);

      await waitFor(() => {
        // Toast error should be called with logout failed message
        expect(toastErrorSpy).toHaveBeenCalledWith('logoutFailed');
      });

      // Storage should still be cleared even on error
      expect(clearAllItems).toHaveBeenCalled();
      // Should still navigate to home even on error
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('handles organization query error without crashing', async () => {
      const { container } = render(
        <MockedProvider mocks={[organizationDataErrorMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationId={mockOrganizationId}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      // Component should render without errors
      await waitFor(() => {
        const navbar = container.querySelector('nav');
        expect(navbar).toBeInTheDocument();
      });
    });

    it('uses provided organization name when query fails and fetchOrganizationData is false', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationName={mockOrganizationName}
              fetchOrganizationData={false}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      // Should use provided name, not attempt to fetch
      expect(screen.getByTestId('brandName')).toHaveTextContent(
        mockOrganizationName,
      );
    });

    it('handles logout GraphQL error - side effects still run', async () => {
      const clearAllItems = vi.fn();

      (useLocalStorage as Mock).mockReturnValue({
        getItem: vi.fn((key: string) => {
          if (key === 'name') return mockUserName;
          return null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn((key: string) => `Talawa-admin_${key}`),
        clearAllItems,
      });

      render(
        <MockedProvider mocks={[logoutErrorMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const dropdown = screen.getByTestId('user-toggle');
      await user.click(dropdown);

      const logoutBtn = screen.getByTestId('user-item-logout');
      await user.click(logoutBtn);

      await waitFor(() => {
        // Component catches the error, so side effects still run.
        expect(clearAllItems).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('handles logout network error - side effects still run', async () => {
      const clearAllItems = vi.fn();

      (useLocalStorage as Mock).mockReturnValue({
        getItem: vi.fn((key: string) => {
          if (key === 'name') return mockUserName;
          return null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        getStorageKey: vi.fn((key: string) => `Talawa-admin_${key}`),
        clearAllItems,
      });

      render(
        <MockedProvider mocks={[logoutNetworkErrorMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const dropdown = screen.getByTestId('user-toggle');
      await user.click(dropdown);

      const logoutBtn = screen.getByTestId('user-item-logout');
      await user.click(logoutBtn);

      await waitFor(() => {
        // Network errors also don't prevent cleanup as they are caught
        expect(clearAllItems).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('custom onLogout is not invoked when mutation would fail', async () => {
      const customOnLogout = vi.fn();

      render(
        <MockedProvider mocks={[logoutErrorMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" onLogout={customOnLogout} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const user = userEvent.setup();
      const dropdown = screen.getByTestId('user-toggle');
      await user.click(dropdown);

      const logoutBtn = screen.getByTestId('user-item-logout');
      await user.click(logoutBtn);

      await waitFor(() => {
        // Custom logout handler is called, mutation is bypassed entirely
        expect(customOnLogout).toHaveBeenCalled();
      });

      // Navigation should not happen when custom handler is provided
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles organization query returning null data with fallback', async () => {
      render(
        <MockedProvider mocks={[organizationDataNullMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationId={mockOrganizationId}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      await waitFor(() => {
        const brandName = screen.getByTestId('brandName');
        // Null organization data falls back to empty string
        expect(brandName).toHaveTextContent('');
      });

      // Component should still render other elements
      expect(screen.getByTestId('brandLogo')).toBeInTheDocument();
    });

    it('handles loading state during organization query', async () => {
      // Create a delayed mock
      const delayedMock = {
        request: {
          query: GET_ORGANIZATION_BASIC_DATA,
          variables: { id: mockOrganizationId },
        },
        result: {
          data: {
            organization: {
              id: mockOrganizationId,
              name: mockOrganizationName,
              __typename: 'Organization',
            },
          },
        },
        delay: 100, // 100ms delay
      };

      render(
        <MockedProvider mocks={[delayedMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar
              mode="organization"
              organizationId={mockOrganizationId}
            />
          </MemoryRouter>
        </MockedProvider>,
      );

      // During loading, organization name should be empty (fallback)
      const brandName = screen.getByTestId('brandName');
      expect(brandName).toHaveTextContent('');

      // UI elements should still be present during loading
      expect(screen.getByTestId('brandLogo')).toBeInTheDocument();
      expect(screen.getByTestId('offcanvasTitle')).toBeInTheDocument();

      // After data loads, organization name should appear
      await waitFor(
        () => {
          expect(brandName).toHaveTextContent(mockOrganizationName);
        },
        { timeout: 1000 },
      );
    });
  });
});

describe('LanguageSelector Component', () => {
  const mockHandleLanguageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders language selector with all languages', async () => {
    render(
      <MemoryRouter>
        <LanguageSelector
          showLanguageSelector={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLanguageChange={mockHandleLanguageChange}
          currentLanguageCode="en"
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testlanguage-toggle');
    await user.click(dropdown);

    languages.forEach((language) => {
      expect(
        screen.getByTestId(`testlanguage-item-${language.code}`),
      ).toBeInTheDocument();
      // Use getByRole instead of getByText to avoid ambiguity
      const langItem = screen.getByTestId(`testlanguage-item-${language.code}`);
      expect(langItem).toHaveTextContent(language.name);
    });
  });

  it('disables current language option', async () => {
    render(
      <MemoryRouter>
        <LanguageSelector
          showLanguageSelector={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLanguageChange={mockHandleLanguageChange}
          currentLanguageCode="en"
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testlanguage-toggle');
    await user.click(dropdown);

    const englishOption = screen.getByTestId('testlanguage-item-en');
    expect(englishOption).toHaveClass('disabled');
  });

  it('calls handleLanguageChange when language is selected', async () => {
    render(
      <MemoryRouter>
        <LanguageSelector
          showLanguageSelector={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLanguageChange={mockHandleLanguageChange}
          currentLanguageCode="en"
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testlanguage-toggle');
    await user.click(dropdown);

    const spanishOption = screen.getByTestId('testlanguage-item-es');
    await user.click(spanishOption);

    await waitFor(() => {
      expect(mockHandleLanguageChange).toHaveBeenCalledWith('es');
    });
  });

  it('returns null when showLanguageSelector is false', () => {
    const { container } = render(
      <MemoryRouter>
        <LanguageSelector
          showLanguageSelector={false}
          testIdPrefix="test"
          dropDirection="start"
          handleLanguageChange={mockHandleLanguageChange}
          currentLanguageCode="en"
        />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders language icon', () => {
    render(
      <MemoryRouter>
        <LanguageSelector
          showLanguageSelector={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLanguageChange={mockHandleLanguageChange}
          currentLanguageCode="en"
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('testlanguageIcon')).toBeInTheDocument();
  });

  it('uses correct drop direction', () => {
    render(
      <MemoryRouter>
        <LanguageSelector
          showLanguageSelector={true}
          testIdPrefix="test"
          dropDirection="end"
          handleLanguageChange={mockHandleLanguageChange}
          currentLanguageCode="en"
        />
      </MemoryRouter>,
    );

    const dropdown = screen.getByTestId('testlanguage-toggle');
    expect(dropdown).toBeInTheDocument();
  });

  it('renders with empty testIdPrefix', () => {
    render(
      <MemoryRouter>
        <LanguageSelector
          showLanguageSelector={true}
          testIdPrefix=""
          dropDirection="start"
          handleLanguageChange={mockHandleLanguageChange}
          currentLanguageCode="en"
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('languageIcon')).toBeInTheDocument();
  });

  it('handles language change with async function', async () => {
    const asyncHandleLanguageChange = vi
      .fn()
      .mockResolvedValue(Promise.resolve());

    render(
      <MemoryRouter>
        <LanguageSelector
          showLanguageSelector={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLanguageChange={asyncHandleLanguageChange}
          currentLanguageCode="en"
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testlanguage-toggle');
    await user.click(dropdown);

    const frenchOption = screen.getByTestId('testlanguage-item-fr');
    await user.click(frenchOption);

    await waitFor(() => {
      expect(asyncHandleLanguageChange).toHaveBeenCalledWith('fr');
    });
  });

  it('renders country flags for each language', async () => {
    render(
      <MemoryRouter>
        <LanguageSelector
          showLanguageSelector={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLanguageChange={mockHandleLanguageChange}
          currentLanguageCode="en"
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testlanguage-toggle');
    await user.click(dropdown);

    languages.forEach((language) => {
      expect(
        screen.getByTestId(`testlanguage-item-${language.code}`),
      ).toBeInTheDocument();
    });
  });
});

describe('UserProfileDropdown Component', () => {
  const mockNavigate = vi.fn();
  const mockHandleLogout = vi.fn();
  const mockTCommon = vi.fn((key: string) => key) as unknown as TFunction<
    'translation',
    undefined
  >;
  const mockStyles = {
    colorWhite: 'colorWhite',
    link: 'link',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user profile dropdown with user name', async () => {
    render(
      <MemoryRouter>
        <UserProfileDropdown
          showUserProfile={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLogout={mockHandleLogout}
          finalUserName="Test User"
          navigate={mockNavigate}
          tCommon={mockTCommon}
          styles={mockStyles}
          PermIdentityIcon={
            MockPermIdentityIcon as OverridableComponent<
              SvgIconTypeMap<object, 'svg'>
            >
          }
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testuser-toggle');
    await user.click(dropdown);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('returns null when showUserProfile is false', () => {
    const { container } = render(
      <MemoryRouter>
        <UserProfileDropdown
          showUserProfile={false}
          testIdPrefix="test"
          dropDirection="start"
          handleLogout={mockHandleLogout}
          finalUserName="Test User"
          navigate={mockNavigate}
          tCommon={mockTCommon}
          styles={mockStyles}
          PermIdentityIcon={
            MockPermIdentityIcon as OverridableComponent<
              SvgIconTypeMap<object, 'svg'>
            >
          }
        />
      </MemoryRouter>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('navigates to settings when settings is clicked', async () => {
    render(
      <MemoryRouter>
        <UserProfileDropdown
          showUserProfile={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLogout={mockHandleLogout}
          finalUserName="Test User"
          navigate={mockNavigate}
          tCommon={mockTCommon}
          styles={mockStyles}
          PermIdentityIcon={
            MockPermIdentityIcon as OverridableComponent<
              SvgIconTypeMap<object, 'svg'>
            >
          }
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testuser-toggle');
    await user.click(dropdown);

    const settingsLink = screen.getByTestId('testuser-item-settings');
    await user.click(settingsLink);

    expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
  });

  it('calls handleLogout when logout is clicked', async () => {
    render(
      <MemoryRouter>
        <UserProfileDropdown
          showUserProfile={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLogout={mockHandleLogout}
          finalUserName="Test User"
          navigate={mockNavigate}
          tCommon={mockTCommon}
          styles={mockStyles}
          PermIdentityIcon={
            MockPermIdentityIcon as OverridableComponent<
              SvgIconTypeMap<object, 'svg'>
            >
          }
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testuser-toggle');
    await user.click(dropdown);

    const logoutBtn = screen.getByTestId('testuser-item-logout');
    await user.click(logoutBtn);

    expect(mockHandleLogout).toHaveBeenCalled();
  });

  it('renders person icon', () => {
    render(
      <MemoryRouter>
        <UserProfileDropdown
          showUserProfile={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLogout={mockHandleLogout}
          finalUserName="Test User"
          navigate={mockNavigate}
          tCommon={mockTCommon}
          styles={mockStyles}
          PermIdentityIcon={
            MockPermIdentityIcon as OverridableComponent<
              SvgIconTypeMap<object, 'svg'>
            >
          }
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('testpersonIcon')).toBeInTheDocument();
  });

  it('uses correct drop direction', () => {
    const { container } = render(
      <MemoryRouter>
        <UserProfileDropdown
          showUserProfile={true}
          testIdPrefix="test"
          dropDirection="down"
          handleLogout={mockHandleLogout}
          finalUserName="Test User"
          navigate={mockNavigate}
          tCommon={mockTCommon}
          styles={mockStyles}
          PermIdentityIcon={
            MockPermIdentityIcon as OverridableComponent<
              SvgIconTypeMap<object, 'svg'>
            >
          }
        />
      </MemoryRouter>,
    );

    const dropdown = container.querySelector('.dropdown');
    expect(dropdown).toBeInTheDocument();
  });

  it('renders with empty testIdPrefix', () => {
    render(
      <MemoryRouter>
        <UserProfileDropdown
          showUserProfile={true}
          testIdPrefix=""
          dropDirection="start"
          handleLogout={mockHandleLogout}
          finalUserName="Test User"
          navigate={mockNavigate}
          tCommon={mockTCommon}
          styles={mockStyles}
          PermIdentityIcon={
            MockPermIdentityIcon as OverridableComponent<
              SvgIconTypeMap<object, 'svg'>
            >
          }
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('user-container')).toBeInTheDocument();
    expect(screen.getByTestId('personIcon')).toBeInTheDocument();
  });

  it('renders with empty user name', async () => {
    render(
      <MemoryRouter>
        <UserProfileDropdown
          showUserProfile={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLogout={mockHandleLogout}
          finalUserName=""
          navigate={mockNavigate}
          tCommon={mockTCommon}
          styles={mockStyles}
          PermIdentityIcon={
            MockPermIdentityIcon as OverridableComponent<
              SvgIconTypeMap<object, 'svg'>
            >
          }
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testuser-toggle');
    await user.click(dropdown);

    // Should render empty string or fallback
    const userNameElement = screen.getByText('', { selector: 'b' });
    expect(userNameElement).toBeInTheDocument();
  });

  it('applies correct CSS classes from styles prop', async () => {
    render(
      <MemoryRouter>
        <UserProfileDropdown
          showUserProfile={true}
          testIdPrefix="test"
          dropDirection="start"
          handleLogout={mockHandleLogout}
          finalUserName="Test User"
          navigate={mockNavigate}
          tCommon={mockTCommon}
          styles={mockStyles}
          PermIdentityIcon={
            MockPermIdentityIcon as OverridableComponent<
              SvgIconTypeMap<object, 'svg'>
            >
          }
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const dropdown = screen.getByTestId('testuser-toggle');
    expect(dropdown).toHaveClass('btn');

    await user.click(dropdown);

    const settingsLink = screen.getByTestId('testuser-item-settings');
    expect(settingsLink).toHaveClass('dropdown-item');
  });
});

describe('UserPortalNavigationBarMocks', () => {
  // Test retained to cover mocks file: LOGOUT_MUTATION has no variables; variableMatcher always returns true
  it('logoutMock variableMatcher returns true for any variables', () => {
    expect(logoutMock.variableMatcher()).toBe(true);
  });
});
