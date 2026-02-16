import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import CollapsibleDropdown from './CollapsibleDropdown';
import type { InterfaceCollapsibleDropdown } from 'types/DropDown/interface';
import { store } from 'state/store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { describe, expect, test, vi, afterEach, beforeEach } from 'vitest';
import type { Location } from '@remix-run/router';
import userEvent from '@testing-library/user-event';

afterEach(() => {
  vi.clearAllMocks();
});

let currentLocation: Location = {
  pathname: '/orgstore',
  state: {},
  key: '',
  search: '',
  hash: '',
};

vi.mock('react-router', async (importOriginal) => {
  const mod = (await importOriginal()) as object;

  return {
    ...mod,
    useLocation: () => currentLocation,
  };
});

// Mock IconComponent to expose fill prop for testing
vi.mock('components/IconComponent/IconComponent', () => ({
  default: ({ name, fill }: { name: string; fill?: string }) => (
    <div data-testid="mocked-icon-component" data-name={name} data-fill={fill}>
      {name}Icon
    </div>
  ),
}));

const createProps = (
  overrides: Partial<InterfaceCollapsibleDropdown> = {},
): InterfaceCollapsibleDropdown => ({
  showDropdown: true,
  setShowDropdown: vi.fn(),
  target: {
    name: 'DropDown Category',
    url: undefined,
    subTargets: [
      {
        name: 'SubCategory 1',
        url: '/sub-category-1',
        icon: 'fa fa-home',
      },
      {
        name: 'SubCategory 2',
        url: '/sub-category-2',
        icon: 'fa fa-home',
      },
    ],
  },
  ...overrides,
});

const renderComponent = (
  props: InterfaceCollapsibleDropdown,
  initialEntries: string[] = ['/'],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Provider store={store}>
        <I18nextProvider i18n={i18nForTest}>
          <CollapsibleDropdown {...props} />
        </I18nextProvider>
      </Provider>
    </MemoryRouter>,
  );
};

describe('Testing CollapsibleDropdown component', () => {
  beforeEach(() => {
    currentLocation = {
      pathname: '/orgstore',
      state: {},
      key: '',
      search: '',
      hash: '',
    };
  });

  test('Component should be rendered properly', () => {
    const props = createProps();
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <CollapsibleDropdown {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );
    expect(screen.getByText('DropDown Category')).toBeInTheDocument();
    expect(screen.getByText('SubCategory 1')).toBeInTheDocument();
    expect(screen.getByText('SubCategory 2')).toBeInTheDocument();
  });

  test('Dropdown should be rendered and functioning correctly', async () => {
    const user = userEvent.setup();
    const props = createProps();
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <CollapsibleDropdown {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );
    const parentDropdownBtn = screen.getByTestId('collapsible-dropdown');
    const activeDropdownBtn = screen.getByText('SubCategory 1');
    const nonActiveDropdownBtn = screen.getByText('SubCategory 2');

    // Check if dropdown is rendered with correct classes
    await user.click(activeDropdownBtn);
    expect(parentDropdownBtn).toBeInTheDocument();
    expect(parentDropdownBtn.className).toMatch(/^_leftDrawerActiveButton_/);

    // Check if active dropdown is rendered with correct classes
    expect(activeDropdownBtn).toBeInTheDocument();
    expect(activeDropdownBtn.className).toMatch(
      /^_leftDrawerCollapseActiveButton_/,
    );

    // Check if inactive dropdown is rendered with correct classes
    expect(nonActiveDropdownBtn).toBeInTheDocument();
    expect(nonActiveDropdownBtn.className).toMatch(
      /^_leftDrawerInactiveButton_/,
    );

    // Check if dropdown is collapsed after clicking on it
    // Since showDropdown is true (controlled component), clicking calls setShowDropdown(!true) = false
    await user.click(parentDropdownBtn);
    expect(props.setShowDropdown).toHaveBeenCalledWith(false);

    // Clicking again also calls setShowDropdown(false) since the controlled prop is still true
    // (The component doesn't control its own state, the parent does via the prop)
    await user.click(parentDropdownBtn);
    // Both calls should be with false since showDropdown prop remains true throughout
    expect(props.setShowDropdown).toHaveBeenLastCalledWith(false);

    // Click on non-active dropdown button and check if it navigates to the correct URL
    await user.click(nonActiveDropdownBtn);
    expect(window.location.pathname).toBe('/sub-category-2');
  });

  describe('useEffect location change logic', () => {
    test('shows dropdown automatically when path includes orgstore', () => {
      currentLocation = {
        pathname: '/orgstore/items',
        state: {},
        key: '',
        search: '',
        hash: '',
      };
      const props = createProps({ showDropdown: false });
      renderComponent(props, ['/orgstore/items']);

      expect(props.setShowDropdown).toHaveBeenCalledWith(true);
    });

    test('hides dropdown when navigating away from orgstore', () => {
      currentLocation = {
        pathname: '/dashboard',
        state: {},
        key: '',
        search: '',
        hash: '',
      };
      const props = createProps({ showDropdown: true });
      renderComponent(props, ['/dashboard']);

      expect(props.setShowDropdown).toHaveBeenCalledWith(false);
    });
  });

  describe('Icon color changes based on state', () => {
    test('applies correct icon color when dropdown is shown', () => {
      const props = createProps({ showDropdown: true });
      renderComponent(props);

      const dropdownButton = screen.getByTestId('collapsible-dropdown');
      const iconWrapper = dropdownButton.querySelector(
        '[class*="collapsibleDropdownIconWrapper"]',
      );
      expect(iconWrapper).toBeInTheDocument();

      // Verify the IconComponent receives the correct fill prop
      const iconElement = screen.getByTestId('mocked-icon-component');
      expect(iconElement).toHaveAttribute('data-fill', 'var(--bs-black)');
    });

    test('applies correct icon color when dropdown is hidden', () => {
      const props = createProps({ showDropdown: false });
      renderComponent(props);

      const dropdownButton = screen.getByTestId('collapsible-dropdown');
      const iconWrapper = dropdownButton.querySelector(
        '[class*="collapsibleDropdownIconWrapper"]',
      );
      expect(iconWrapper).toBeInTheDocument();

      // Verify the IconComponent receives the correct fill prop
      const iconElement = screen.getByTestId('mocked-icon-component');
      expect(iconElement).toHaveAttribute('data-fill', 'var(--bs-secondary)');
    });
  });

  describe('Chevron icon direction', () => {
    test('displays chevron-up icon when dropdown is expanded', () => {
      const props = createProps({ showDropdown: true });
      renderComponent(props);

      const dropdownButton = screen.getByTestId('collapsible-dropdown');
      const chevronIcon = dropdownButton.querySelector('i.fa');
      expect(chevronIcon).toBeInTheDocument();
      expect(chevronIcon?.className).toContain('fa-chevron-up');
      expect(chevronIcon?.className).not.toContain('fa-chevron-down');
    });

    test('displays chevron-down icon when dropdown is collapsed', () => {
      const props = createProps({ showDropdown: false });
      renderComponent(props);

      const dropdownButton = screen.getByTestId('collapsible-dropdown');
      const chevronIcon = dropdownButton.querySelector('i.fa');
      expect(chevronIcon).toBeInTheDocument();
      expect(chevronIcon?.className).toContain('fa-chevron-down');
      expect(chevronIcon?.className).not.toContain('fa-chevron-up');
    });
  });

  describe('aria-expanded attribute', () => {
    test('sets aria-expanded to true when dropdown is shown', () => {
      const props = createProps({ showDropdown: true });
      renderComponent(props);

      const dropdownButton = screen.getByTestId('collapsible-dropdown');
      expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('sets aria-expanded to false when dropdown is hidden', () => {
      const props = createProps({ showDropdown: false });
      renderComponent(props);

      const dropdownButton = screen.getByTestId('collapsible-dropdown');
      expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Navigation through all subTargets', () => {
    test('navigates correctly to each subTarget', async () => {
      const user = userEvent.setup();
      const props = createProps({
        target: {
          name: 'DropDown Category',
          url: undefined,
          subTargets: [
            {
              name: 'SubCategory 1',
              url: '/sub-category-1',
              icon: 'fa fa-home',
            },
            {
              name: 'SubCategory 2',
              url: '/sub-category-2',
              icon: 'fa fa-folder',
            },
            {
              name: 'SubCategory 3',
              url: '/sub-category-3',
              icon: 'fa fa-cog',
            },
          ],
        },
      });

      render(
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CollapsibleDropdown {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>,
      );

      // Verify all subTargets are rendered
      expect(screen.getByText('SubCategory 1')).toBeInTheDocument();
      expect(screen.getByText('SubCategory 2')).toBeInTheDocument();
      expect(screen.getByText('SubCategory 3')).toBeInTheDocument();

      // Verify each subTarget has correct testId
      expect(
        screen.getByTestId('collapsible-dropdown-btn-0'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('collapsible-dropdown-btn-1'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('collapsible-dropdown-btn-2'),
      ).toBeInTheDocument();

      // Navigate to first subTarget
      const subTarget1 = screen.getByText('SubCategory 1');
      await user.click(subTarget1);
      expect(window.location.pathname).toBe('/sub-category-1');

      // Navigate to second subTarget
      const subTarget2 = screen.getByText('SubCategory 2');
      await user.click(subTarget2);
      expect(window.location.pathname).toBe('/sub-category-2');

      // Navigate to third subTarget
      const subTarget3 = screen.getByText('SubCategory 3');
      await user.click(subTarget3);
      expect(window.location.pathname).toBe('/sub-category-3');
    });

    test('renders subTargets with correct navigation links', () => {
      const props = createProps();
      render(
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CollapsibleDropdown {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>,
      );

      // Find links and verify their href attributes
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', '/sub-category-1');
      expect(links[1]).toHaveAttribute('href', '/sub-category-2');
    });
  });

  describe('Button styling based on dropdown state', () => {
    test('applies active button styles when dropdown is shown', () => {
      const props = createProps({ showDropdown: true });
      renderComponent(props);

      const dropdownButton = screen.getByTestId('collapsible-dropdown');
      expect(dropdownButton.className).toMatch(/leftDrawerActiveButton/);
    });

    test('applies inactive button styles when dropdown is hidden', () => {
      const props = createProps({ showDropdown: false });
      renderComponent(props);

      const dropdownButton = screen.getByTestId('collapsible-dropdown');
      expect(dropdownButton.className).toMatch(/leftDrawerInactiveButton/);
    });
  });

  describe('SubTarget icons rendering', () => {
    test('renders icons for each subTarget', () => {
      const props = createProps();
      renderComponent(props);

      // Each subTarget has an icon element
      const subTargetLinks = screen.getAllByRole('link');

      expect(subTargetLinks.length).toBeGreaterThan(0);
      subTargetLinks.forEach((link) => {
        const iconElement = link.querySelector('i.fa');
        expect(iconElement).toBeInTheDocument();
      });
    });
  });
});
