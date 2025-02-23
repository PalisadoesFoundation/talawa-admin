import React from 'react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LeftDrawer from './LeftDrawer';
import useLocalStorage from 'utils/useLocalstorage';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

// Mock the local storage hook
vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    getItem: vi.fn((key) => (key === 'SuperAdmin' ? 'true' : null)),
  })),
}));

// Mock translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      tCommon: (key: string) => key,
    }),
  };
});

// Mock SVG components
vi.mock('assets/svgs/organizations.svg?react', () => ({
  default: () => <div data-testid="organizations-icon" />,
}));

vi.mock('assets/svgs/roles.svg?react', () => ({
  default: () => <div data-testid="roles-icon" />,
}));

vi.mock('assets/svgs/settings.svg?react', () => ({
  default: () => <div data-testid="settings-icon" />,
}));

vi.mock('assets/svgs/talawa.svg?react', () => ({
  default: () => <div data-testid="talawa-logo" />,
}));

vi.mock('components/ProfileDropdown/ProfileDropdown', () => ({
  default: () => <div data-testid="profile-dropdown" />,
}));

describe('LeftDrawer Component', () => {
  const defaultProps = {
    hideDrawer: false,
    setHideDrawer: vi.fn(),
  };

  const renderComponent = (props = defaultProps): ReturnType<typeof render> => {
    return render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <LeftDrawer {...props} />
        </I18nextProvider>
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('leftDrawerContainer')).toBeInTheDocument();
  });

  it('shows the Talawa logo', () => {
    renderComponent();
    expect(screen.getByTestId('talawa-logo')).toBeInTheDocument();
  });

  it('renders all navigation buttons for super admin', () => {
    renderComponent();
    expect(screen.getByTestId('organizationsBtn')).toBeInTheDocument();
    expect(screen.getByTestId('rolesBtn')).toBeInTheDocument();
    expect(screen.getByTestId('communityProfileBtn')).toBeInTheDocument();
  });

  it('hides roles button for non-super admin users', () => {
    vi.mocked(useLocalStorage).mockImplementation(() => ({
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      getStorageKey: vi.fn(() => ''),
    }));

    renderComponent();
    expect(screen.getByTestId('organizationsBtn')).toBeInTheDocument();
    expect(screen.queryByTestId('rolesBtn')).not.toBeInTheDocument();
    expect(screen.getByTestId('communityProfileBtn')).toBeInTheDocument();
  });

  it('applies correct styles when drawer is hidden', () => {
    renderComponent({ ...defaultProps, hideDrawer: true });
    const element = screen.getByTestId('leftDrawerContainer');
    expect(element.className).toContain('inactiveDrawer');
  });

  it('applies correct styles when drawer is visible', () => {
    renderComponent({ ...defaultProps, hideDrawer: false });
    const element = screen.getByTestId('leftDrawerContainer');
    expect(element.className).toContain('activeDrawer');
  });

  it('handles mobile view navigation button clicks', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    renderComponent();

    const organizationsButton = screen.getByTestId('organizationsBtn');
    fireEvent.click(organizationsButton);

    expect(defaultProps.setHideDrawer).toHaveBeenCalledWith(true);
  });

  it('renders the profile dropdown', () => {
    renderComponent();
    expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
  });

  it('applies active styles to the current route button', () => {
    renderComponent();
    const organizationsButton = screen.getByTestId('organizationsBtn');

    // Simulate active route
    window.history.pushState({}, '', '/orglist');

    expect(organizationsButton).toHaveStyle({
      backgroundColor: 'var(--sidebar-option-bg)',
      fontWeight: 'bold',
    });
  });
});
