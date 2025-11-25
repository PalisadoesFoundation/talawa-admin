import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';
import styles from 'style/app-fixed.module.css';

describe('SearchBar', () => {
  const defaultProps = {
    onSearch: vi.fn(),
    inputTestId: 'search-input',
    buttonTestId: 'search-button',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders search input with default placeholder', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });

  it('renders search input with custom placeholder', () => {
    render(<SearchBar {...defaultProps} placeholder="Custom search..." />);
    const input = screen.getByPlaceholderText('Custom search...');
    expect(input).toBeInTheDocument();
  });

  it('updates search term on input change', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByTestId('search-input');

    fireEvent.change(input, { target: { value: 'test search' } });
    expect(input).toHaveValue('test search');
  });

  it('calls onSearch when search button is clicked', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByTestId('search-input');
    const button = screen.getByTestId('search-button');

    fireEvent.change(input, { target: { value: 'test search' } });
    fireEvent.click(button);

    expect(defaultProps.onSearch).toHaveBeenCalledWith('test search');
    expect(defaultProps.onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch when Enter key is pressed', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByTestId('search-input');

    fireEvent.change(input, { target: { value: 'test search' } });
    fireEvent.keyUp(input, { key: 'Enter' });

    expect(defaultProps.onSearch).toHaveBeenCalledWith('test search');
    expect(defaultProps.onSearch).toHaveBeenCalledTimes(1);
  });

  it('does not call onSearch for non-Enter keys', () => {
    render(<SearchBar {...defaultProps} />);
    const input = screen.getByTestId('search-input');

    fireEvent.change(input, { target: { value: 'test search' } });
    fireEvent.keyUp(input, { key: 'Space' });

    expect(defaultProps.onSearch).not.toHaveBeenCalled();
  });

  it('applies default className from styles', () => {
    render(<SearchBar {...defaultProps} />);
    const container = screen.getByTestId('search-input').parentElement;
    expect(container).toHaveClass(styles.input);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-search';
    render(<SearchBar {...defaultProps} className={customClass} />);

    const container = screen.getByTestId('search-input').parentElement;
    expect(container).toHaveClass(customClass);
  });
});
