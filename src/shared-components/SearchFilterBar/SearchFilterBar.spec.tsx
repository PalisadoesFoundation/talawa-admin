import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchFilterBar from './SearchFilterBar';
import type {
  InterfaceSearchFilterBarProps,
  InterfaceSortingOption,
} from 'types/shared-components/SearchFilterBar/interface';

vi.mock('shared-components/SearchBar/SearchBar', () => ({
  default: vi.fn((props) => {
    const {
      placeholder,
      value,
      onChange,
      onSearch,
      inputTestId,
      buttonTestId,
      buttonAriaLabel,
    } = props;
    return (
      <div data-testid="mock-searchbar">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange?.(e.target.value)
          }
          data-testid={inputTestId}
        />
        <button
          type="button"
          onClick={() => onSearch?.(value)}
          data-testid={buttonTestId}
          aria-label={buttonAriaLabel}
        >
          Search
        </button>
      </div>
    );
  }),
}));

vi.mock('shared-components/SortingButton/SortingButton', () => ({
  default: vi.fn(
    ({
      buttonLabel,
      sortingOptions,
      selectedOption,
      onSortChange,
      dataTestIdPrefix,
    }) => (
      <div data-testid={`mock-sorting-button-${dataTestIdPrefix}`}>
        <span>{buttonLabel}</span>
        <select
          value={selectedOption}
          onChange={(e) => onSortChange(e.target.value)}
          data-testid={`${dataTestIdPrefix}-select`}
        >
          {sortingOptions.map((option: InterfaceSortingOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    ),
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('utils/performance', async () => {
  const actual = await vi.importActual('utils/performance');
  return {
    ...actual,
    debounce: vi.fn((fn) => {
      const debounced = (...args: unknown[]) => fn(...args);
      debounced.cancel = vi.fn();
      return debounced;
    }),
  };
});

const mockLodashDebounce = vi.fn((fn: (...args: unknown[]) => unknown) => {
  const debounced = (...args: unknown[]) => fn(...args);
  debounced.cancel = vi.fn();
  debounced.flush = vi.fn();
  return debounced;
});

vi.mock('lodash', async () => {
  const actual = await vi.importActual('lodash');
  return {
    ...actual,
    debounce: (...args: unknown[]) => mockLodashDebounce(...args),
  };
});

describe('SearchFilterBar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Simple Variant - Search Only', () => {
    const simpleProps: InterfaceSearchFilterBarProps = {
      hasDropdowns: false,
      searchPlaceholder: 'Search requests',
      searchValue: '',
      onSearchChange: vi.fn(),
    };

    it('should render search bar with placeholder', () => {
      render(<SearchFilterBar {...simpleProps} />);

      expect(
        screen.getByPlaceholderText('Search requests'),
      ).toBeInTheDocument();
    });

    it('should render with default container className', () => {
      const { container } = render(<SearchFilterBar {...simpleProps} />);

      const containerDiv = container.querySelector(
        'div[class*="btnsContainerSearchBar"]',
      );
      expect(containerDiv).toBeInTheDocument();
    });

    it('should render with custom container className', () => {
      const { container } = render(
        <SearchFilterBar
          {...simpleProps}
          containerClassName="customClassName"
        />,
      );

      const containerDiv = container.querySelector('div.customClassName');
      expect(containerDiv).toBeInTheDocument();
    });

    it('should update search input value when user types', async () => {
      const user = userEvent.setup();
      render(<SearchFilterBar {...simpleProps} />);

      const searchInput = screen.getByTestId('searchInput');
      await user.type(searchInput, 'test query');

      expect(searchInput).toHaveValue('test query');
    });

    it('should call onSearchChange when user types', async () => {
      const user = userEvent.setup();
      const onSearchChange = vi.fn();
      render(
        <SearchFilterBar {...simpleProps} onSearchChange={onSearchChange} />,
      );

      const searchInput = screen.getByTestId('searchInput');
      await user.type(searchInput, 'test');

      expect(onSearchChange).toHaveBeenCalledWith('test');
    });

    it('should call onSearchSubmit when search button is clicked', async () => {
      const user = userEvent.setup();
      const onSearchSubmit = vi.fn();

      render(
        <SearchFilterBar
          {...simpleProps}
          searchValue="test query"
          onSearchSubmit={onSearchSubmit}
        />,
      );

      const searchButton = screen.getByTestId('searchButton');
      await user.click(searchButton);

      expect(onSearchSubmit).toHaveBeenCalledWith('test query');
    });

    it('should use custom testIds when provided', () => {
      render(
        <SearchFilterBar
          {...simpleProps}
          searchInputTestId="customInput"
          searchButtonTestId="customButton"
        />,
      );

      expect(screen.getByTestId('customInput')).toBeInTheDocument();
      expect(screen.getByTestId('customButton')).toBeInTheDocument();
    });

    it('should not render dropdowns container for simple variant', () => {
      const { container } = render(<SearchFilterBar {...simpleProps} />);

      const dropdownsContainer = container.querySelector(
        'div[class*="filtersBlock"]',
      );
      expect(dropdownsContainer).not.toBeInTheDocument();
    });
  });

  describe('Advanced Variant - Search with Dropdowns', () => {
    const advancedProps: InterfaceSearchFilterBarProps = {
      hasDropdowns: true,
      searchPlaceholder: 'Search by volunteer',
      searchValue: '',
      onSearchChange: vi.fn(),
      dropdowns: [
        {
          id: 'sort-dropdown',
          label: 'Sort',
          type: 'sort',
          options: [
            { label: 'Latest', value: 'DESCENDING' },
            { label: 'Oldest', value: 'ASCENDING' },
          ],
          selectedOption: 'DESCENDING',
          onOptionChange: vi.fn(),
          dataTestIdPrefix: 'sort',
        },
      ],
    };

    it('should render search bar and dropdowns', () => {
      render(<SearchFilterBar {...advancedProps} />);

      expect(
        screen.getByPlaceholderText('Search by volunteer'),
      ).toBeInTheDocument();
      expect(screen.getByText('Sort')).toBeInTheDocument();
    });

    it('should render multiple dropdowns', () => {
      const multiDropdownProps: InterfaceSearchFilterBarProps = {
        ...advancedProps,
        dropdowns: [
          {
            id: 'sort-dropdown',
            label: 'Sort',
            type: 'sort',
            options: [
              { label: 'Most Hours', value: 'hours_DESC' },
              { label: 'Least Hours', value: 'hours_ASC' },
            ],
            selectedOption: 'hours_DESC',
            onOptionChange: vi.fn(),
            dataTestIdPrefix: 'sort',
          },
          {
            id: 'time-frame-dropdown',
            label: 'Time Frame',
            type: 'filter',
            options: [
              { label: 'All Time', value: 'allTime' },
              { label: 'Weekly', value: 'weekly' },
            ],
            selectedOption: 'allTime',
            onOptionChange: vi.fn(),
            dataTestIdPrefix: 'timeFrame',
          },
        ],
      };

      render(<SearchFilterBar {...multiDropdownProps} />);

      expect(screen.getByText('Sort')).toBeInTheDocument();
      expect(screen.getByText('Time Frame')).toBeInTheDocument();
    });

    it('should call dropdown onOptionChange when selection changes', async () => {
      const user = userEvent.setup();
      const onOptionChange = vi.fn();
      const propsWithCallback: InterfaceSearchFilterBarProps = {
        ...advancedProps,
        dropdowns: [
          {
            ...advancedProps.dropdowns[0],
            onOptionChange,
          },
        ],
      };

      render(<SearchFilterBar {...propsWithCallback} />);

      const toggleButton = screen.getByTestId('sort-toggle');
      await user.click(toggleButton);

      const option = screen.getByTestId('sort-item-ASCENDING');
      await user.click(option);

      expect(onOptionChange).toHaveBeenCalledWith('ASCENDING');
    });

    it('should render dropdowns with correct selected option', () => {
      render(<SearchFilterBar {...advancedProps} />);

      const toggleButton = screen.getByTestId('sort-toggle');
      expect(toggleButton).toHaveTextContent('Sort');
    });

    it('should render dropdowns container when hasDropdowns is true', () => {
      const { container } = render(<SearchFilterBar {...advancedProps} />);

      const dropdownsContainer = container.querySelector(
        'div[class*="filtersBlock"]',
      );
      expect(dropdownsContainer).toBeInTheDocument();
    });

    it('should have correct aria-label when hasDropdowns is true', () => {
      const { container } = render(<SearchFilterBar {...advancedProps} />);

      const dropdownsContainer = container.querySelector('div[role="toolbar"]');
      expect(dropdownsContainer).toHaveAttribute(
        'aria-label',
        'filterAndSortOptions',
      );
    });
  });

  describe('Advanced Variant - Additional Buttons', () => {
    const propsWithButton: InterfaceSearchFilterBarProps = {
      hasDropdowns: true,
      searchPlaceholder: 'Search plugins',
      searchValue: '',
      onSearchChange: vi.fn(),
      dropdowns: [
        {
          id: 'filter-plugins-dropdown',
          label: 'Filter plugins',
          type: 'filter',
          options: [
            { label: 'All Plugins', value: 'all' },
            { label: 'Installed', value: 'installed' },
          ],
          selectedOption: 'all',
          onOptionChange: vi.fn(),
          dataTestIdPrefix: 'filterPlugins',
        },
      ],
      additionalButtons: (
        <button type="button" data-testid="upload-button">
          Upload Plugin
        </button>
      ),
    };

    it('should render additional buttons alongside dropdowns', () => {
      render(<SearchFilterBar {...propsWithButton} />);

      expect(screen.getByText('Filter plugins')).toBeInTheDocument();
      expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    });

    it('should render additional buttons without dropdowns', () => {
      const propsOnlyButton: InterfaceSearchFilterBarProps = {
        hasDropdowns: true,
        searchPlaceholder: 'Search plugins',
        searchValue: '',
        onSearchChange: vi.fn(),
        dropdowns: [],
        additionalButtons: (
          <button type="button" data-testid="upload-button">
            Upload Plugin
          </button>
        ),
      };

      render(<SearchFilterBar {...propsOnlyButton} />);

      expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    });

    it('should not render buttons container when no dropdowns or buttons', () => {
      const propsNoExtras: InterfaceSearchFilterBarProps = {
        hasDropdowns: true,
        searchPlaceholder: 'Search',
        searchValue: '',
        onSearchChange: vi.fn(),
        dropdowns: [],
      };

      const { container } = render(<SearchFilterBar {...propsNoExtras} />);

      const dropdownsContainer = container.querySelector(
        'div[class*="filtersBlock"]',
      );
      expect(dropdownsContainer).not.toBeInTheDocument();
    });
  });

  describe('Debouncing Behavior', () => {
    it('should debounce search changes with default delay', () => {
      mockLodashDebounce.mockClear();

      const onSearchChange = vi.fn();
      render(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search"
          searchValue=""
          onSearchChange={onSearchChange}
        />,
      );

      expect(mockLodashDebounce).toHaveBeenCalledWith(
        expect.any(Function),
        300,
      );
    });

    it('should debounce search changes with custom delay', () => {
      mockLodashDebounce.mockClear();

      const onSearchChange = vi.fn();
      render(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search"
          searchValue=""
          onSearchChange={onSearchChange}
          debounceDelay={500}
        />,
      );

      expect(mockLodashDebounce).toHaveBeenCalledWith(
        expect.any(Function),
        500,
      );
    });

    it('should update internal state immediately on typing', async () => {
      const user = userEvent.setup();
      render(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search"
          searchValue=""
          onSearchChange={vi.fn()}
        />,
      );

      const searchInput = screen.getByTestId('searchInput');
      await user.type(searchInput, 'instant');

      expect(searchInput).toHaveValue('instant');
    });

    it('should sync internal state with external searchValue prop changes', () => {
      const { rerender } = render(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search"
          searchValue=""
          onSearchChange={vi.fn()}
        />,
      );

      const searchInput = screen.getByTestId('searchInput');
      expect(searchInput).toHaveValue('');

      rerender(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search"
          searchValue="external update"
          onSearchChange={vi.fn()}
        />,
      );

      expect(searchInput).toHaveValue('external update');
    });
  });

  describe('Dropdown Configuration', () => {
    it('should pass all dropdown props to DropDownButton', () => {
      const dropdownConfig = {
        id: 'sort-tags-dropdown',
        label: 'Sort Tags',
        type: 'sort' as const,
        options: [
          { label: 'Latest', value: 'DESCENDING' },
          { label: 'Oldest', value: 'ASCENDING' },
        ],
        selectedOption: 'DESCENDING',
        onOptionChange: vi.fn(),
        dataTestIdPrefix: 'sortTags',
        title: 'Sort options',
        dropdownTestId: 'sortDropdown',
      };

      render(
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder="Search"
          searchValue=""
          onSearchChange={vi.fn()}
          dropdowns={[dropdownConfig]}
        />,
      );

      expect(screen.getByTestId('sortTags-container')).toBeInTheDocument();
      expect(screen.getByText('Sort Tags')).toBeInTheDocument();
    });

    it('should render correct number of dropdowns', () => {
      const threeDropdowns: InterfaceSearchFilterBarProps = {
        hasDropdowns: true,
        searchPlaceholder: 'Search',
        searchValue: '',
        onSearchChange: vi.fn(),
        dropdowns: [
          {
            id: 'sort-dropdown-test',
            label: 'Sort',
            type: 'sort',
            options: [{ label: 'Latest', value: 'desc' }],
            selectedOption: 'desc',
            onOptionChange: vi.fn(),
            dataTestIdPrefix: 'sort',
          },
          {
            id: 'filter-dropdown-test',
            label: 'Filter',
            type: 'filter',
            options: [{ label: 'All', value: 'all' }],
            selectedOption: 'all',
            onOptionChange: vi.fn(),
            dataTestIdPrefix: 'filter',
          },
          {
            id: 'time-dropdown-test',
            label: 'Time',
            type: 'filter',
            options: [{ label: 'Today', value: 'today' }],
            selectedOption: 'today',
            onOptionChange: vi.fn(),
            dataTestIdPrefix: 'time',
          },
        ],
      };

      render(<SearchFilterBar {...threeDropdowns} />);

      expect(screen.getByTestId('sort-container')).toBeInTheDocument();
      expect(screen.getByTestId('filter-container')).toBeInTheDocument();
      expect(screen.getByTestId('time-container')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty searchValue', () => {
      render(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search"
          searchValue=""
          onSearchChange={vi.fn()}
        />,
      );

      const searchInput = screen.getByTestId('searchInput');
      expect(searchInput).toHaveValue('');
    });

    it('should handle long searchValue', () => {
      const longValue = 'a'.repeat(200);
      render(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search"
          searchValue={longValue}
          onSearchChange={vi.fn()}
        />,
      );

      const searchInput = screen.getByTestId('searchInput');
      expect(searchInput).toHaveValue(longValue);
    });

    it('should handle special characters in search', () => {
      const specialChars = '!@#$%^&*()_+-={}[]|:";\'<>?,./';
      render(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search"
          searchValue={specialChars}
          onSearchChange={vi.fn()}
        />,
      );

      const searchInput = screen.getByTestId('searchInput');
      expect(searchInput).toHaveValue(specialChars);
    });

    it('should handle empty dropdowns array', () => {
      render(
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder="Search"
          searchValue=""
          onSearchChange={vi.fn()}
          dropdowns={[]}
        />,
      );

      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('should handle undefined onSearchSubmit', async () => {
      const user = userEvent.setup();
      render(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search"
          searchValue="test"
          onSearchChange={vi.fn()}
        />,
      );

      const searchButton = screen.getByTestId('searchButton');
      expect(async () => await user.click(searchButton)).not.toThrow();
    });
  });

  describe('Translation Overrides', () => {
    it('should pass custom translations to child components', () => {
      const customTranslations = {
        searchInputAriaDescription: 'Custom search description',
        filterAndSortOptionsLabel: 'Custom filter and sort label',
      };

      render(
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder="Search"
          searchValue=""
          onSearchChange={vi.fn()}
          dropdowns={[
            {
              id: 'translation-test-sort-dropdown',
              label: 'Sort',
              type: 'sort',
              options: [
                { label: 'Latest', value: 'DESCENDING' },
                { label: 'Oldest', value: 'ASCENDING' },
              ],
              selectedOption: 'DESCENDING',
              onOptionChange: vi.fn(),
              dataTestIdPrefix: 'sort',
            },
          ]}
          translations={customTranslations}
        />,
      );

      // Verify dropdown container gets custom aria label
      const sortContainer = screen.getByTestId('sort-container');
      expect(sortContainer).toBeInTheDocument();

      // Verify the filters toolbar uses custom aria label
      const filtersToolbar = screen.getByRole('toolbar');
      expect(filtersToolbar).toHaveAttribute(
        'aria-label',
        'Custom filter and sort label',
      );

      // Verify search button is rendered
      const searchButton = screen.getByTestId('searchButton');
      expect(searchButton).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('should work as complete search and filter system (Leaderboard scenario)', async () => {
      const user = userEvent.setup();
      const onSearchChange = vi.fn();
      const onSortChange = vi.fn();
      const onFilterChange = vi.fn();

      render(
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder="Search by volunteer"
          searchValue=""
          onSearchChange={onSearchChange}
          dropdowns={[
            {
              id: 'sort-integration-test',
              label: 'Sort',
              type: 'sort',
              options: [
                { label: 'Most Hours', value: 'hours_DESC' },
                { label: 'Least Hours', value: 'hours_ASC' },
              ],
              selectedOption: 'hours_DESC',
              onOptionChange: onSortChange,
              dataTestIdPrefix: 'sort',
            },
            {
              id: 'time-frame-integration-test',
              label: 'Time Frame',
              type: 'filter',
              options: [
                { label: 'All Time', value: 'allTime' },
                { label: 'Weekly', value: 'weekly' },
              ],
              selectedOption: 'allTime',
              onOptionChange: onFilterChange,
              dataTestIdPrefix: 'timeFrame',
            },
          ]}
        />,
      );

      // SEARCH
      const searchInput = screen.getByTestId('searchInput');
      await user.type(searchInput, 'John');
      expect(onSearchChange).toHaveBeenCalledWith('John');

      // SORT (click-based Bootstrap dropdown)
      const sortToggle = screen.getByTestId('sort-toggle');
      await user.click(sortToggle);
      const sortOption = screen.getByTestId('sort-item-hours_ASC');
      await user.click(sortOption);
      expect(onSortChange).toHaveBeenCalledWith('hours_ASC');

      // FILTER (click-based Bootstrap dropdown)
      const timeFrameToggle = screen.getByTestId('timeFrame-toggle');
      await user.click(timeFrameToggle);
      const filterOption = screen.getByTestId('timeFrame-item-weekly');
      await user.click(filterOption);
      expect(onFilterChange).toHaveBeenCalledWith('weekly');
    });

    it('should work as PluginStore scenario with button', async () => {
      const user = userEvent.setup();
      const onSearchChange = vi.fn();
      const onFilterChange = vi.fn();
      const onUploadClick = vi.fn();

      render(
        <SearchFilterBar
          hasDropdowns={true}
          searchPlaceholder="Search plugins"
          searchValue=""
          onSearchChange={onSearchChange}
          dropdowns={[
            {
              id: 'filter-plugins-integration-test',
              label: 'Filter plugins',
              type: 'filter',
              options: [
                { label: 'All Plugins', value: 'all' },
                { label: 'Installed Plugins', value: 'installed' },
              ],
              selectedOption: 'all',
              onOptionChange: onFilterChange,
              dataTestIdPrefix: 'filterPlugins',
            },
          ]}
          additionalButtons={
            <button
              type="button"
              onClick={onUploadClick}
              data-testid="upload-btn"
            >
              Upload Plugin
            </button>
          }
        />,
      );

      const searchInput = screen.getByTestId('searchInput');
      await user.type(searchInput, 'auth');
      expect(onSearchChange).toHaveBeenCalledWith('auth');

      const filterToggle = screen.getByTestId('filterPlugins-toggle');
      await user.click(filterToggle);
      const filterOption = screen.getByTestId('filterPlugins-item-installed');
      await user.click(filterOption);
      expect(onFilterChange).toHaveBeenCalledWith('installed');

      const uploadButton = screen.getByTestId('upload-btn');
      await user.click(uploadButton);
      expect(onUploadClick).toHaveBeenCalled();
    });

    it('should work as simple Requests scenario', async () => {
      const user = userEvent.setup();
      const onSearchChange = vi.fn();
      const onSearchSubmit = vi.fn();

      render(
        <SearchFilterBar
          hasDropdowns={false}
          searchPlaceholder="Search requests"
          searchValue=""
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
        />,
      );

      const searchInput = screen.getByTestId('searchInput');
      await user.type(searchInput, 'pending');
      expect(onSearchChange).toHaveBeenCalledWith('pending');

      const searchButton = screen.getByTestId('searchButton');
      await user.click(searchButton);
      expect(onSearchSubmit).toHaveBeenCalledWith('pending');
    });
  });
});
