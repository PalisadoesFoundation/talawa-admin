// SearchingButton.spec.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchingButton from './SearchingButton';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

describe('SearchingButton Component', () => {
  it('renders with default text when no text prop is provided', () => {
    render(<SearchingButton dataTestIdPrefix="searching-button-toggle" />);
    // The default text should be "Select an option"
    expect(
      screen.getByTestId('searching-button-toggle-toggle'),
    ).toHaveTextContent('Select an option');
  });

  it('renders with provided text when text prop is passed', () => {
    render(
      <SearchingButton
        dataTestIdPrefix="searching-button-toggle"
        text="Custom Option"
      />,
    );
    expect(
      screen.getByTestId('searching-button-toggle-toggle'),
    ).toHaveTextContent('Custom Option');
  });

  it('applies the given test ids and toggle id correctly', () => {
    render(
      <SearchingButton
        dataTestIdPrefix="custom-toggle"
        toggleId="custom-dropdown"
        text="Test Option"
      />,
    );

    const toggle = screen.getByTestId('custom-toggle-toggle');

    // data-testid checks
    expect(toggle).toBeInTheDocument();
    expect(screen.getByTestId('custom-toggle-container')).toBeInTheDocument();

    // ✅ IMPORTANT: verify toggleId is applied as HTML id
    expect(toggle).toHaveAttribute('id', 'custom-dropdown');
  });

  it('renders sort icon when type is "sort"', () => {
    render(
      <SearchingButton
        dataTestIdPrefix="sort-toggle"
        text="Sort Option"
        type="sort"
      />,
    );
    // Expect an <svg> to be rendered inside the toggle.
    const toggle = screen.getByTestId('sort-toggle-toggle');
    const svgElement = toggle.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    // Optionally, you can check that the svg element has a class that matches MUI's default (e.g., MuiSvgIcon-root).
    expect(svgElement).toHaveClass('MuiSvgIcon-root');
  });

  it('renders filter icon when type is "filter"', () => {
    render(
      <SearchingButton
        dataTestIdPrefix="filter-toggle"
        text="Filter Option"
        type="filter"
      />,
    );
    const toggle = screen.getByTestId('filter-toggle-toggle');
    const svgElement = toggle.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    // Optionally, check for a class. Since both icons are MUI icons, you might check for differences if you add custom test ids.
    expect(svgElement).toHaveClass('MuiSvgIcon-root');
  });
});
