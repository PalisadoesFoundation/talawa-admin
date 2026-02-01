import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortingButton from './SortingButton';
import type { InterfaceSortingOption } from 'types/shared-components/SearchFilterBar/interface';
let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup({
    delay: null, // IMPORTANT: disables timers
  });
});

describe('SortingButton', () => {
  vi.mock('shared-components/DropDownButton/DropDownButton', async () => ({
    default: vi.fn((props) => {
      const {
        id,
        options,
        onSelect,
        ariaLabel,
        buttonLabel,
        icon,
        parentContainerStyle,
        dataTestIdPrefix,
      } = props;

      return (
        <div
          id={id}
          data-testid={`${dataTestIdPrefix}-container`}
          className={parentContainerStyle}
        >
          <button
            type="button"
            data-testid={`${dataTestIdPrefix}-toggle`}
            aria-label={ariaLabel}
          >
            {icon}
            {buttonLabel}
          </button>

          <div data-testid={`${dataTestIdPrefix}-menu`}>
            {options.map((option: { label: string; value: string }) => (
              <button
                type="button"
                key={option.value}
                data-testid={option.value}
                onClick={() => onSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      );
    }),
  }));
  const mockSortingOptions: InterfaceSortingOption[] = [
    { label: 'Latest', value: 'latest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Most Popular', value: 1 },
    { label: 'Least Popular', value: 2 },
  ];

  const defaultProps = {
    sortingOptions: mockSortingOptions,
    selectedOption: 'latest',
    onSortChange: vi.fn(),
    dataTestIdPrefix: 'sort',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should expose the title via aria-label for accessibility', () => {
      render(<SortingButton {...defaultProps} title="Sort Options" />);

      const button = screen.getByTestId('sort-toggle');
      expect(button).toHaveAttribute('aria-label', 'Sort Options');
    });

    it('should render the sort icon by default', () => {
      render(<SortingButton {...defaultProps} />);

      const icon = screen.getByTestId('sorting-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveAttribute('data-icon-type', 'sort');
    });

    it('should render the filter icon when type is filter', () => {
      render(<SortingButton {...defaultProps} type="filter" />);

      const icon = screen.getByTestId('sorting-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveAttribute('data-icon-type', 'filter');
    });

    it('should display selectedOption as button text when no buttonLabel is provided', () => {
      render(<SortingButton {...defaultProps} selectedOption="latest" />);

      const button = screen.getByTestId('sort-toggle');
      expect(button).toHaveTextContent('latest');
    });

    it('should display buttonLabel when provided', () => {
      render(
        <SortingButton
          {...defaultProps}
          buttonLabel="Sort By"
          selectedOption="latest"
        />,
      );

      const button = screen.getByTestId('sort-toggle');

      expect(button).toHaveTextContent('Sort By');
      expect(button).not.toHaveTextContent('latest');
    });

    it('should apply the custom className to the dropdown container', () => {
      render(<SortingButton {...defaultProps} className="custom-class" />);

      const container = screen.getByTestId('sort-container');
      expect(container.className).toContain('custom-class');
    });

    it('should render the sorting button with default styling', () => {
      render(<SortingButton {...defaultProps} />);

      const button = screen.getByTestId('sort-toggle');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should set aria-label when ariaLabel prop is provided', () => {
      render(
        <SortingButton {...defaultProps} ariaLabel="Select sorting option" />,
      );

      const button = screen.getByTestId('sort-toggle');
      expect(button).toHaveAttribute('aria-label', 'Select sorting option');
    });

    it('should not set aria-label when ariaLabel prop is not provided', () => {
      render(<SortingButton {...defaultProps} />);

      const button = screen.getByTestId('sort-toggle');
      expect(button).not.toHaveAttribute('aria-label');
    });

    it('should set aria-hidden on the icon', () => {
      render(<SortingButton {...defaultProps} />);

      const icon = screen.getByTestId('sorting-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Dropdown Functionality', () => {
    it('should render all sorting options in the dropdown menu', async () => {
      render(<SortingButton {...defaultProps} />);

      await user.click(screen.getByTestId('sort-toggle'));

      expect(screen.getByTestId('latest')).toBeInTheDocument();
      expect(screen.getByTestId('oldest')).toBeInTheDocument();
      expect(screen.getByTestId('1')).toBeInTheDocument();
      expect(screen.getByTestId('2')).toBeInTheDocument();
    });

    it('should call onSortChange with string value when an option is selected', async () => {
      const onSortChange = vi.fn();
      render(<SortingButton {...defaultProps} onSortChange={onSortChange} />);

      await user.click(screen.getByTestId('sort-toggle'));
      await user.click(screen.getByTestId('latest'));

      expect(onSortChange).toHaveBeenCalledTimes(1);
      expect(onSortChange).toHaveBeenCalledWith('latest');
    });

    it('should call onSortChange with stringified number value when an option is selected', async () => {
      const onSortChange = vi.fn();
      render(<SortingButton {...defaultProps} onSortChange={onSortChange} />);

      await user.click(screen.getByTestId('sort-toggle'));
      await user.click(screen.getByTestId('1'));

      expect(onSortChange).toHaveBeenCalledTimes(1);
      expect(onSortChange).toHaveBeenCalledWith('1');
    });

    it('should render options with correct data-testid attributes', async () => {
      render(<SortingButton {...defaultProps} />);

      const button = screen.getByTestId('sort-toggle');
      await user.click(button);

      expect(screen.getByTestId('latest')).toBeInTheDocument();
      expect(screen.getByTestId('oldest')).toBeInTheDocument();
      expect(screen.getByTestId('1')).toBeInTheDocument();
      expect(screen.getByTestId('2')).toBeInTheDocument();
    });
  });

  describe('Variant Behavior', () => {
    it('should render correctly when selectedOption is an empty string', () => {
      render(<SortingButton {...defaultProps} selectedOption="" />);

      const button = screen.getByTestId('sort-toggle');
      expect(button).toBeInTheDocument();
    });

    it('should render correctly when selectedOption is provided', () => {
      render(<SortingButton {...defaultProps} selectedOption="latest" />);

      const button = screen.getByTestId('sort-toggle');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('latest');
    });

    it('should render correctly when selectedOption is a number', () => {
      render(<SortingButton {...defaultProps} selectedOption={1} />);

      const button = screen.getByTestId('sort-toggle');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('1');
    });
  });

  describe('Icon Types', () => {
    it('should render SortIcon for sort type', () => {
      render(<SortingButton {...defaultProps} type="sort" />);

      const icon = screen.getByTestId('sorting-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon-type', 'sort');
    });

    it('should render FilterAltOutlined for filter type', () => {
      render(<SortingButton {...defaultProps} type="filter" />);

      const icon = screen.getByTestId('sorting-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon-type', 'filter');
    });
  });

  describe('Data Test IDs', () => {
    it('should apply dataTestIdPrefix to the dropdown toggle', () => {
      render(
        <SortingButton {...defaultProps} dataTestIdPrefix="custom-prefix" />,
      );

      const toggle = screen.getByTestId('custom-prefix-toggle');
      expect(toggle).toBeInTheDocument();
    });

    it('should apply dropdownTestId to the dropdown container', () => {
      render(
        <SortingButton {...defaultProps} dropdownTestId="custom-dropdown" />,
      );

      const container = screen.getByTestId('sort-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('id', 'custom-dropdown');
    });

    it('should render img icon when icon prop is provided', () => {
      render(<SortingButton {...defaultProps} icon="/icons/custom-sort.svg" />);

      const img = screen.getByAltText('sortingIcon');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/icons/custom-sort.svg');

      // default MUI icon should NOT be rendered
      expect(screen.queryByTestId('sorting-icon')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty sortingOptions array', async () => {
      render(<SortingButton {...defaultProps} sortingOptions={[]} />);

      const button = screen.getByTestId('sort-toggle');
      await user.click(button);

      // Should not crash and dropdown should still render
      expect(button).toBeInTheDocument();
    });

    it('should handle undefined selectedOption', () => {
      render(<SortingButton {...defaultProps} selectedOption={undefined} />);

      const button = screen.getByTestId('sort-toggle');
      expect(button).toBeInTheDocument();
    });

    it('should handle selectedOption that does not match any option value', () => {
      render(<SortingButton {...defaultProps} selectedOption="non-existent" />);

      const button = screen.getByTestId('sort-toggle');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('non-existent');
    });

    it('should handle invalid numeric selectedOption without breaking dropdown behavior', async () => {
      render(
        <SortingButton
          {...defaultProps}
          selectedOption={999}
          buttonLabel="Sort By"
        />,
      );

      const button = screen.getByTestId('sort-toggle');

      // Button should render with the provided label
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Sort By');

      // Open dropdown
      await user.click(button);

      // All options should still be rendered
      expect(screen.getByTestId('latest')).toBeInTheDocument();
      expect(screen.getByTestId('oldest')).toBeInTheDocument();
      expect(screen.getByTestId('1')).toBeInTheDocument();
      expect(screen.getByTestId('2')).toBeInTheDocument();
    });
  });
});
