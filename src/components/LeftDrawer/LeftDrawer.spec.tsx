import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LeftDrawer from './LeftDrawer';
import useLocalStorage from 'utils/useLocalstorage';

// Mock external dependencies
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    tCommon: (key: string) => key,
  }),
}));

jest.mock('utils/useLocalstorage', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getItem: jest.fn(),
  })),
}));

jest.mock('assets/svgs/organizations.svg?react', () => {
  const OrganizationsIcon = (): JSX.Element => <span>OrganizationsIcon</span>;
  OrganizationsIcon.displayName = 'OrganizationsIcon';
  return OrganizationsIcon;
});

describe('LeftDrawer Component', () => {
  const mockSetHideDrawer = jest.fn();
  const localStorageMock = useLocalStorage as jest.Mock;

  const defaultProps = {
    hideDrawer: false,
    setHideDrawer: mockSetHideDrawer,
  };

  beforeEach(() => {
    localStorageMock.mockImplementation(() => ({
      getItem: (key: string) => (key === 'SuperAdmin' ? 'true' : null),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic structure', () => {
    render(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} />
      </MemoryRouter>,
    );

    expect(screen.getByText('TalawaLogo')).toBeInTheDocument();
    expect(screen.getByText('talawaAdminPortal')).toBeInTheDocument();
    expect(screen.getByText('menu')).toBeInTheDocument();
  });

  test('shows organization link', () => {
    render(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('organizationsBtn')).toHaveTextContent(
      'my organizations',
    );
    expect(screen.getByTestId('organizationsBtn')).toContainHTML(
      'OrganizationsIcon',
    );
  });

  test('shows roles link for SuperAdmin', () => {
    render(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('rolesBtn')).toHaveTextContent('users');
    expect(screen.getByTestId('rolesBtn')).toContainHTML('RolesIcon');
  });

  test('hides roles link for non-SuperAdmin', () => {
    localStorageMock.mockImplementation(() => ({
      getItem: () => null,
    }));

    render(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('rolesBtn')).not.toBeInTheDocument();
  });

  test('shows community profile link', () => {
    render(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('communityProfileBtn')).toHaveTextContent(
      'communityProfile',
    );
    expect(screen.getByTestId('communityProfileBtn')).toContainHTML(
      'SettingsIcon',
    );
  });

  test('applies active styles for current route', () => {
    render(
      <MemoryRouter initialEntries={['/orglist']}>
        <LeftDrawer {...defaultProps} />
      </MemoryRouter>,
    );

    const orgButton = screen.getByTestId('organizationsBtn');
    expect(orgButton).toHaveStyle('font-weight: bold');
    expect(orgButton).toHaveStyle('color: var(--sidebar-option-text-active)');
  });

  test('handles mobile view click', () => {
    // Set mobile view
    Object.defineProperty(window, 'innerWidth', { value: 800 });

    render(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId('organizationsBtn'));
    expect(mockSetHideDrawer).toHaveBeenCalledWith(true);
  });

  test('initializes hideDrawer state', () => {
    const { rerender } = render(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} hideDrawer={null} />
      </MemoryRouter>,
    );

    expect(mockSetHideDrawer).toHaveBeenCalledWith(false);

    // Test subsequent render
    rerender(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} hideDrawer={false} />
      </MemoryRouter>,
    );
    expect(mockSetHideDrawer).toHaveBeenCalledTimes(1);
  });

  test('renders profile dropdown', () => {
    render(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('profileDropdown')).toBeInTheDocument();
  });

  test('applies correct classes based on hideDrawer', () => {
    const { rerender } = render(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} hideDrawer={false} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('leftDrawerContainer')).toHaveClass(
      'activeDrawer',
    );

    rerender(
      <MemoryRouter>
        <LeftDrawer {...defaultProps} hideDrawer={true} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('leftDrawerContainer')).toHaveClass(
      'inactiveDrawer',
    );
  });
});
