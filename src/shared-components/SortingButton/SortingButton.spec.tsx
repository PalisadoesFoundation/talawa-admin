
import type { ReactNode, ButtonHTMLAttributes } from 'react';
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

vi.mock('react-bootstrap/Dropdown', async () => {
  const React = await import('react');

  type Props = { children?: ReactNode };
  type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
  };

  const Dropdown = ({ children }: Props) => <div>{children}</div>;

  Dropdown.Toggle = ({ children, ...props }: ButtonProps) => (
    <button {...props}>{children}</button>
  );

  Dropdown.Menu = ({ children }: Props) => <div>{children}</div>;

  Dropdown.Item = ({
    children,
    onClick,
    ...props
  }: ButtonProps & { onClick?: () => void }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );

  return { default: Dropdown };
});

describe('SortingButton', () => {
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
    it('should render the dropdown with correct title', () => {
      const { container } = render(
        <SortingButton {...defaultProps} title="Sort Options" />,
      );

      const dropdown = container.querySelector('.dropdown');
      expect(dropdown).toHaveAttribute('title', 'Sort Options');
    });

    it('should render the sort icon by default', () => {
      render(<SortingButton {...defaultProps} />);

      const icon = screen.getByTestId('sorting-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render the filter icon when type is filter', () => {
      render(<SortingButton {...defaultProps} type="filter" />);

      const icon = screen.getByTestId('sorting-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should display selectedOption as button text when no buttonLabel provided', () => {
      render(<SortingButton {...defaultProps} selectedOption="latest" />);

      expect(screen.getByText('latest')).toBeInTheDocument();
    });

    it('should display buttonLabel when provided', () => {
      render(
        <SortingButton
          {...defaultProps}
          buttonLabel="Sort By"
          selectedOption="latest"
        />,
      );

      expect(screen.getByText('Sort By')).toBeInTheDocument();
      expect(screen.queryByText('latest')).not.toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <SortingButton {...defaultProps} className="custom-class" />,
      );

      const dropdown = container.querySelector('.custom-class');
      expect(dropdown).toBeInTheDocument();
    });

    it('should render with default className', () => {
      const { container } = render(<SortingButton {...defaultProps} />);

      const dropdown = container.querySelector('.dropdown');
      expect(dropdown).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should set aria-label when ariaLabel prop is provided', () => {
      render(
        <SortingButton {...defaultProps} ariaLabel="Select sorting option" />,
      );

      const button = screen.getByRole('button', { expanded: false });
      expect(button).toHaveAttribute('aria-label', 'Select sorting option');
    });

    it('should not set aria-label when ariaLabel prop is not provided', () => {
      render(<SortingButton {...defaultProps} />);

      const button = screen.getByRole('button', { expanded: false });
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

      const button = screen.getByTestId('sort');
      await user.click(button);

      expect(screen.getByText('Latest')).toBeInTheDocument();
      expect(screen.getByText('Oldest')).toBeInTheDocument();
      expect(screen.getByText('Most Popular')).toBeInTheDocument();
      expect(screen.getByText('Least Popular')).toBeInTheDocument();
    });

    it('should call onSortChange with string value when option is clicked', async () => {
      const onSortChange = vi.fn();
      render(<SortingButton {...defaultProps} onSortChange={onSortChange} />);

      const button = screen.getByTestId('sort');
      await user.click(button);

      const latestOption = screen.getByText('Latest');
      await user.click(latestOption);

      expect(onSortChange).toHaveBeenCalledWith('latest');
      expect(onSortChange).toHaveBeenCalledTimes(1);
    });

    it('should call onSortChange with number value when option is clicked', async () => {
      const onSortChange = vi.fn();
      render(<SortingButton {...defaultProps} onSortChange={onSortChange} />);

      const button = screen.getByTestId('sort');
      await user.click(button);

      const popularOption = screen.getByText('Most Popular');
      await user.click(popularOption);

      expect(onSortChange).toHaveBeenCalledWith(1);
      expect(onSortChange).toHaveBeenCalledTimes(1);
    });

    it('should render options with correct data-testid attributes', async () => {
      render(<SortingButton {...defaultProps} />);

      const button = screen.getByTestId('sort');
      await user.click(button);

      expect(screen.getByTestId('latest')).toBeInTheDocument();
      expect(screen.getByTestId('oldest')).toBeInTheDocument();
      expect(screen.getByTestId('1')).toBeInTheDocument();
      expect(screen.getByTestId('2')).toBeInTheDocument();
    });
  });

  describe('Variant Behavior', () => {
    it('should show outline-success variant when selectedOption is empty string', () => {
      render(<SortingButton {...defaultProps} selectedOption="" />);

      const button = screen.getByRole('button', { expanded: false });
      expect(button).toHaveClass('btn-outline-success');
    });

    it('should show success variant when selectedOption is not empty string', () => {
      render(<SortingButton {...defaultProps} selectedOption="latest" />);

      const button = screen.getByRole('button', { expanded: false });
      expect(button).toHaveClass('btn-success');
    });

    it('should show success variant when selectedOption is a number', () => {
      render(<SortingButton {...defaultProps} selectedOption={1} />);

      const button = screen.getByRole('button', { expanded: false });
      expect(button).toHaveClass('btn-success');
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

      expect(screen.getByTestId('custom-prefix')).toBeInTheDocument();
    });

    it('should apply dropdownTestId to the dropdown container', () => {
      render(
        <SortingButton {...defaultProps} dropdownTestId="custom-dropdown" />,
      );

      const dropdown = screen.getByTestId('custom-dropdown');
      expect(dropdown).toBeInTheDocument();
    });

    it('should render img icon when icon prop is provided', () => {
      render(<SortingButton {...defaultProps} icon="/icons/custom-sort.svg" />);

      // img should be rendered
      const img = screen.getByAltText('sortingIcon');
      expect(img).toBeInTheDocument();

      // correct src
      expect(img).toHaveAttribute('src', '/icons/custom-sort.svg');

      // alt text from i18n key
      expect(img).toHaveAttribute('alt', 'sortingIcon');

      // default MUI icon should NOT be rendered
      expect(screen.queryByTestId('sorting-icon')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty sortingOptions array', async () => {
      render(<SortingButton {...defaultProps} sortingOptions={[]} />);

      const button = screen.getByTestId('sort');
      await user.click(button);

      // Should not crash and dropdown should still render
      expect(button).toBeInTheDocument();
    });

    it('should handle undefined selectedOption', () => {
      render(<SortingButton {...defaultProps} selectedOption={undefined} />);

      const button = screen.getByRole('button', { expanded: false });
      expect(button).toBeInTheDocument();
    });

    it('should handle selectedOption that does not match any option value', () => {
      render(<SortingButton {...defaultProps} selectedOption="non-existent" />);

      const button = screen.getByRole('button', { expanded: false });
      expect(button).toHaveClass('btn-success');
    });

    it('should handle invalid numeric selectedOption and display it without preselecting an option', async () => {
      render(
        <SortingButton
          {...defaultProps}
          selectedOption={999}
          buttonLabel="Sort By"
        />,
      );

      const button = screen.getByRole('button', { expanded: false });

      // Button should render with the label
      expect(screen.getByText('Sort By')).toBeInTheDocument();

      // Button should show success variant (not empty)
      expect(button).toHaveClass('btn-success');

      // Open dropdown and verify no option matches 999
      await user.click(button);

      // All options should be visible but none should be "active" or preselected
      expect(screen.getByText('Latest')).toBeInTheDocument();
      expect(screen.getByText('Oldest')).toBeInTheDocument();
      expect(screen.getByText('Most Popular')).toBeInTheDocument();
      expect(screen.getByText('Least Popular')).toBeInTheDocument();
    });
  });
});
