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
    expect(screen.getByTestId('searching-button-toggle')).toHaveTextContent(
      'Select an option',
    );
  });

  it('renders with provided text when text prop is passed', () => {
    render(
      <SearchingButton
        dataTestIdPrefix="searching-button-toggle"
        text="Custom Option"
      />,
    );
    expect(screen.getByTestId('searching-button-toggle')).toHaveTextContent(
      'Custom Option',
    );
  });

  it('applies the given test ids to the dropdown and toggle', () => {
    render(
      <SearchingButton
        dataTestIdPrefix="custom-toggle"
        dropdownTestId="custom-dropdown"
        text="Test Option"
      />,
    );
    // Check that the toggle button has the custom test id.
    expect(screen.getByTestId('custom-toggle')).toBeInTheDocument();
    // Check that the Dropdown container has the custom test id.
    expect(screen.getByTestId('custom-dropdown')).toBeInTheDocument();
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
    const toggle = screen.getByTestId('sort-toggle');
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
    const toggle = screen.getByTestId('filter-toggle');
    const svgElement = toggle.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    // Optionally, check for a class. Since both icons are MUI icons, you might check for differences if you add custom test ids.
    expect(svgElement).toHaveClass('MuiSvgIcon-root');
  });

  // Optionally, simulate a click to open the dropdown.
  it('opens the dropdown when the toggle is clicked', async () => {
    render(
      <SearchingButton
        dataTestIdPrefix="click-toggle"
        dropdownTestId="click-dropdown"
        text="Click Option"
      />,
    );
    const toggle = screen.getByTestId('click-toggle');
    await userEvent.click(toggle);
    // The Dropdown itself is rendered with data-testid "click-dropdown"
    expect(screen.getByTestId('click-dropdown')).toBeInTheDocument();
  });
});
