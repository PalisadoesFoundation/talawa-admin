import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, afterEach } from 'vitest';
import SearchToggle from './SearchToggle';
import { InterfaceSearchToggleProps } from 'types/shared-components/DropDownButton/interface';

describe('SearchToggle Component', () => {
  const mockOnClick = vi.fn();
  const mockOnChange = vi.fn();
  const mockOnInputClick = vi.fn();

  const defaultProps: InterfaceSearchToggleProps = {
    onClick: mockOnClick,
    value: '',
    onChange: mockOnChange,
    onInputClick: mockOnInputClick,
    dataTestIdPrefix: 'test-toggle',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with required props', () => {
    render(<SearchToggle {...defaultProps} />);
    const input = screen.getByTestId('test-toggle-input');
    expect(input).toBeInTheDocument();
    // Verify caret rendering (line 63 in SearchToggle.tsx)
    expect(screen.getByText('▼')).toBeInTheDocument();
    // Verify icon render condition (lines 43-50 in SearchToggle.tsx)
    expect(screen.queryByTestId('test-toggle-icon')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<SearchToggle {...defaultProps} icon={<span>🔍</span>} />);
    const iconWrapper = screen.getByTestId('test-toggle-icon');
    expect(iconWrapper).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('binds value to input', () => {
    render(<SearchToggle {...defaultProps} value="test value" />);
    const input = screen.getByTestId('test-toggle-input') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('calls onChange handler when typing', async () => {
    render(<SearchToggle {...defaultProps} />);
    const input = screen.getByTestId('test-toggle-input');
    await userEvent.type(input, 'a');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls both onClick and onInputClick when input is clicked', async () => {
    render(<SearchToggle {...defaultProps} />);
    const input = screen.getByTestId('test-toggle-input');
    await userEvent.click(input);

    // Verify implementation lines 57-60
    expect(mockOnInputClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className to the container', () => {
    const { container } = render(
      <SearchToggle {...defaultProps} className="custom-test-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-test-class');
  });

  it('forwards ref to the container div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<SearchToggle {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes other props like placeholder correctly', () => {
    render(<SearchToggle {...defaultProps} placeholder="Type here..." />);
    const input = screen.getByTestId('test-toggle-input');
    expect(input).toHaveAttribute('placeholder', 'Type here...');
  });
});
