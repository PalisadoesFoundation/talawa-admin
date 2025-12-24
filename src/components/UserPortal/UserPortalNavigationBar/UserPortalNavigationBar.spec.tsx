import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  revokeRefreshTokenMock,
  mockNavigationLinksBase,
} from './UserPortalNavigationBarMocks';

// Mock dependencies
vi.mock('react-toastify', () => ({ toast: { error: vi.fn() } }));
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
  },
}));

vi.mock('components/NotificationIcon/NotificationIcon', () => ({
  default: () => <div data-testid="notification-icon">Notification Icon</div>,
}));

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

    // Setup default mock implementations
    (useLocalStorage as Mock).mockReturnValue({
      getItem: vi.fn((key: string) => {
        if (key === 'id') return mockUserId;
        if (key === 'name') return mockUserName;
        return null;
      }),
      clearAllItems: vi.fn(),
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

    it('handles brand click in user mode', () => {
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

      fireEvent.click(screen.getByTestId('brandLogo'));
      expect(mockBrandClick).toHaveBeenCalled();
    });

    it('displays custom userName when provided', () => {
      render(
        <MockedProvider mocks={[organizationDataMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" userName="Custom User" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const dropdown = screen.getByTestId('logoutDropdown');
      fireEvent.click(dropdown);

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
        <MockedProvider mocks={[revokeRefreshTokenMock]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const dropdown = screen.getByTestId('logoutDropdown');
      fireEvent.click(dropdown);

      const logoutBtn = screen.getByTestId('logoutBtn');
      fireEvent.click(logoutBtn);

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

      const dropdown = screen.getByTestId('logoutDropdown');
      fireEvent.click(dropdown);

      const logoutBtn = screen.getByTestId('logoutBtn');
      fireEvent.click(logoutBtn);

      await waitFor(() => {
        expect(customLogout).toHaveBeenCalled();
      });
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

      const dropdown = screen.getByTestId('logoutDropdown');
      fireEvent.click(dropdown);

      const logoutBtn = screen.getByTestId('logoutBtn');
      fireEvent.click(logoutBtn);

      await waitFor(() => {
        expect(clearAllItems).toHaveBeenCalled();
        expect(windowLocationReplaceSpy).toHaveBeenCalledWith('/');
      });
    });

    it('navigates to organization home when brand is clicked', () => {
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

      fireEvent.click(screen.getByTestId('brandLogo'));
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

      const homeLink = screen.getAllByTestId('navigationLink-home')[0];
      fireEvent.click(homeLink);

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

      const customLink = screen.getAllByTestId('navigationLink-custom')[0];
      fireEvent.click(customLink);

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

      const homeLink = screen.getAllByTestId('navigationLink-home')[0];
      fireEvent.click(homeLink);

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

      expect(
        screen.queryByTestId('languageDropdownToggle'),
      ).not.toBeInTheDocument();
    });

    it('hides user profile when showUserProfile is false', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" showUserProfile={false} />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.queryByTestId('logoutDropdown')).not.toBeInTheDocument();
    });

    it('shows user profile by default', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('logoutDropdown')).toBeInTheDocument();
    });

    it('shows language selector by default', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      expect(screen.getByTestId('languageDropdownToggle')).toBeInTheDocument();
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

      const languageDropdown = screen.getByTestId('languageDropdownToggle');
      fireEvent.click(languageDropdown);

      const spanishOption = screen.getByTestId('changeLanguageBtn1');
      fireEvent.click(spanishOption);

      await waitFor(() => {
        expect(i18next.changeLanguage).toHaveBeenCalledWith(languages[1].code);
        expect(cookies.set).toHaveBeenCalledWith('i18next', languages[1].code);
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

      const languageDropdown = screen.getByTestId('languageDropdownToggle');
      fireEvent.click(languageDropdown);

      const spanishOption = screen.getByTestId('changeLanguageBtn1');
      fireEvent.click(spanishOption);

      await waitFor(() => {
        expect(i18next.changeLanguage).toHaveBeenCalledWith(languages[1].code);
        expect(customLanguageChange).toHaveBeenCalledWith(languages[1].code);
      });
    });

    it('uses current language from cookies', () => {
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

      const languageDropdown = screen.getByTestId('languageDropdownToggle');
      fireEvent.click(languageDropdown);

      // Spanish option should be disabled as it's the current language
      const spanishOption = screen.getByTestId('changeLanguageBtn3');
      expect(spanishOption).toHaveClass('disabled');
    });
  });

  describe('UserPortalNavigationBar - User Profile Dropdown', () => {
    it('navigates to settings when settings is clicked', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" />
          </MemoryRouter>
        </MockedProvider>,
      );

      const dropdown = screen.getByTestId('logoutDropdown');
      fireEvent.click(dropdown);

      const settingsOption = screen.getByText('settings');
      fireEvent.click(settingsOption);

      expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
    });

    it('displays user name in dropdown', () => {
      render(
        <MockedProvider mocks={[]}>
          <MemoryRouter>
            <UserPortalNavigationBar mode="user" userName={mockUserName} />
          </MemoryRouter>
        </MockedProvider>,
      );

      const dropdown = screen.getByTestId('logoutDropdown');
      fireEvent.click(dropdown);

      expect(screen.getByText(mockUserName)).toBeInTheDocument();
    });
  });
});

describe('LanguageSelector Component', () => {
  const mockHandleLanguageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders language selector with all languages', () => {
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

    const dropdown = screen.getByTestId('testlanguageDropdownToggle');
    fireEvent.click(dropdown);

    languages.forEach((language, index) => {
      expect(
        screen.getByTestId(`testchangeLanguageBtn${index}`),
      ).toBeInTheDocument();
      expect(screen.getByText(language.name)).toBeInTheDocument();
    });
  });

  it('disables current language option', () => {
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

    const dropdown = screen.getByTestId('testlanguageDropdownToggle');
    fireEvent.click(dropdown);

    const englishOption = screen.getByTestId('testchangeLanguageBtn0');
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

    const dropdown = screen.getByTestId('testlanguageDropdownToggle');
    fireEvent.click(dropdown);

    const spanishOption = screen.getByTestId('testchangeLanguageBtn1');
    fireEvent.click(spanishOption);

    await waitFor(() => {
      expect(mockHandleLanguageChange).toHaveBeenCalledWith(languages[1].code);
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
    const { container } = render(
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

    const dropdown = container.querySelector('.dropend');
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

    expect(screen.getByTestId('languageDropdownToggle')).toBeInTheDocument();
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

    const dropdown = screen.getByTestId('testlanguageDropdownToggle');
    fireEvent.click(dropdown);

    const frenchOption = screen.getByTestId('testchangeLanguageBtn2');
    fireEvent.click(frenchOption);

    await waitFor(() => {
      expect(asyncHandleLanguageChange).toHaveBeenCalledWith(languages[2].code);
    });
  });

  it('renders country flags for each language', () => {
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

    const dropdown = screen.getByTestId('testlanguageDropdownToggle');
    fireEvent.click(dropdown);

    languages.forEach((language) => {
      const flagElement = document.querySelector(
        `.fi-${language.country_code}`,
      );
      expect(flagElement).toBeInTheDocument();
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

  const MockPermIdentityIcon = (
    props: React.HTMLAttributes<HTMLDivElement>,
  ) => <div {...props}>Person Icon</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user profile dropdown with user name', () => {
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

    const dropdown = screen.getByTestId('testlogoutDropdown');
    fireEvent.click(dropdown);

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

  it('navigates to settings when settings is clicked', () => {
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

    const dropdown = screen.getByTestId('testlogoutDropdown');
    fireEvent.click(dropdown);

    const settingsLink = screen.getByText('settings');
    fireEvent.click(settingsLink);

    expect(mockNavigate).toHaveBeenCalledWith('/user/settings');
  });

  it('calls handleLogout when logout is clicked', () => {
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

    const dropdown = screen.getByTestId('testlogoutDropdown');
    fireEvent.click(dropdown);

    const logoutBtn = screen.getByTestId('testlogoutBtn');
    fireEvent.click(logoutBtn);

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

    expect(screen.getByTestId('logoutDropdown')).toBeInTheDocument();
    expect(screen.getByTestId('personIcon')).toBeInTheDocument();
  });

  it('renders with empty user name', () => {
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

    const dropdown = screen.getByTestId('testlogoutDropdown');
    fireEvent.click(dropdown);

    // Should render empty string or fallback
    const userNameElement = screen.getByText('', { selector: 'b' });
    expect(userNameElement).toBeInTheDocument();
  });

  it('applies correct CSS classes from styles prop', () => {
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

    const dropdown = screen.getByTestId('testlogoutDropdown');
    expect(dropdown).toHaveClass('colorWhite');

    fireEvent.click(dropdown);

    const settingsLink = screen.getByText('settings');
    expect(settingsLink.closest('.dropdown-item')).toHaveClass('link');
  });
});
