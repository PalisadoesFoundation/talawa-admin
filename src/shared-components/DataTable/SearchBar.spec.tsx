import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with placeholder', () => {
    render(
      <SearchBar
        value=""
        onChange={() => {}}
        placeholder="Test Search"
        clear-aria-label="Clear"
      />,
    );
    expect(screen.getByPlaceholderText('Test Search')).toBeInTheDocument();
  });

  it('triggers onChange when typing', async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} clear-aria-label="Clear" />);
    await userEvent.type(screen.getByRole('searchbox'), 'abc');
    expect(onChange).toHaveBeenCalledWith('a');
    expect(onChange).toHaveBeenCalledWith('b');
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('shows clear button only when value is present', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SearchBar
        value=""
        onChange={onChange}
        clear-aria-label="Clear search"
      />,
    );
    expect(screen.queryByLabelText('Clear search')).toBeNull();

    rerender(
      <SearchBar
        value="hello"
        onChange={onChange}
        clear-aria-label="Clear search"
      />,
    );
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const onChange = vi.fn();
    render(
      <SearchBar
        value="hello"
        onChange={onChange}
        clear-aria-label="Clear search"
      />,
    );
    await userEvent.click(screen.getByLabelText('Clear search'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('uses fallback aria-label when not provided', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    // Should fall back to 'Search' when both aria-label and placeholder are omitted
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('uses placeholder as aria-label fallback when aria-label not provided', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Find items" />);
    expect(screen.getByLabelText('Find items')).toBeInTheDocument();
  });

  it('uses fallback clear aria-label when not provided', () => {
    render(<SearchBar value="test" onChange={() => {}} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });
});
