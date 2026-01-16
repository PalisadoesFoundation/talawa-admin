import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with placeholder', () => {
    render(
      <SearchBar value="" onChange={() => {}} placeholder="Test Search" />,
    );
    expect(screen.getByPlaceholderText('Test Search')).toBeInTheDocument();
  });

  it('triggers onChange when typing', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'abc' },
    });
    expect(onChange).toHaveBeenCalledWith('abc');
  });

  it('shows clear button only when value is present', () => {
    const onChange = vi.fn();
    const { rerender } = render(<SearchBar value="" onChange={onChange} />);
    expect(screen.queryByLabelText('Clear search')).toBeNull();

    rerender(<SearchBar value="hello" onChange={onChange} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    const onChange = vi.fn();
    render(<SearchBar value="hello" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
