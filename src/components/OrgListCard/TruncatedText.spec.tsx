import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import TruncatedText from './TruncatedText';

const mockCancel = vi.fn();

vi.mock('./useDebounce', () => ({
  default: (callback: () => void) => {
    return {
      debouncedCallback: callback, // Execute immediately for tests when used as handler
      cancel: mockCancel,
    };
  },
}));

describe('TruncatedText Component', () => {
  const originalGetComputedStyle = window.getComputedStyle;
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetWidth',
  );

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore originals
    window.getComputedStyle = originalGetComputedStyle;
    if (originalOffsetWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'offsetWidth',
        originalOffsetWidth,
      );
    }
    vi.restoreAllMocks();
  });

  const mockLayout = (offsetWidth: number, fontSize: string = '16px') => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: offsetWidth,
    });

    window.getComputedStyle = vi.fn().mockImplementation(() => ({
      fontSize: fontSize,
    })) as unknown as typeof window.getComputedStyle;
  };

  test('renders full text when it fits within width', () => {
    mockLayout(1000, '16px');
    render(<TruncatedText text="Short text" />);
    expect(screen.getByText('Short text')).toBeDefined();
  });

  test('truncates text when it exceeds max width', () => {
    mockLayout(100, '16px');
    render(<TruncatedText text="This is a long text" />);
    expect(screen.getByText('This i...')).toBeDefined();
  });

  test('uses maxWidthOverride if provided', () => {
    mockLayout(100, '16px');
    render(
      <TruncatedText text="This is a long text" maxWidthOverride={1000} />,
    );
    expect(screen.getByText('This is a long text')).toBeDefined();
  });

  test('uses offsetWidth when maxWidthOverride is 0', () => {
    // 0 is falsy, so it should fallback to offsetWidth
    mockLayout(100, '16px'); // 100px -> truncates
    render(<TruncatedText text="This is a long text" maxWidthOverride={0} />);
    expect(screen.getByText('This i...')).toBeDefined();
  });

  test('uses small maxWidthOverride and truncates accordingly', () => {
    // Large offsetWidth that would normally fit the full text
    mockLayout(1000, '16px');
    // But override with small width to force truncation
    render(<TruncatedText text="This is a long text" maxWidthOverride={50} />);
    // With maxWidthOverride=50, text should be truncated
    expect(screen.getByText(/\.\.\./)).toBeDefined();
  });

  test('uses offsetWidth when maxWidthOverride is explicitly undefined', () => {
    mockLayout(100, '16px');
    render(
      <TruncatedText text="This is a long text" maxWidthOverride={undefined} />,
    );
    // Should use offsetWidth (100) and truncate
    expect(screen.getByText('This i...')).toBeDefined();
  });

  test('uses offsetWidth when maxWidthOverride is null', () => {
    mockLayout(100, '16px');
    render(
      <TruncatedText
        text="This is a long text"
        maxWidthOverride={null as unknown as number}
      />,
    );
    // Should use offsetWidth (100) and truncate
    expect(screen.getByText('This i...')).toBeDefined();
  });

  test('recalculates when text prop changes', () => {
    mockLayout(1000, '16px');
    const { rerender } = render(<TruncatedText text="Short" />);
    expect(screen.getByText('Short')).toBeDefined();

    // Change text prop to trigger useEffect
    rerender(
      <TruncatedText text="This is a much longer text that should fit" />,
    );
    expect(
      screen.getByText('This is a much longer text that should fit'),
    ).toBeDefined();
  });

  test('recalculates when maxWidthOverride prop changes', () => {
    mockLayout(1000, '16px');
    const { rerender } = render(
      <TruncatedText text="This is a long text" maxWidthOverride={1000} />,
    );
    expect(screen.getByText('This is a long text')).toBeDefined();

    // Change maxWidthOverride to trigger useEffect with smaller width
    rerender(
      <TruncatedText text="This is a long text" maxWidthOverride={50} />,
    );
    expect(screen.getByText(/\.\.\./)).toBeDefined();
  });
  test('recalculates on resize', () => {
    mockLayout(1000, '16px');
    render(<TruncatedText text="Resize me please" />);
    expect(screen.getByText('Resize me please')).toBeDefined();

    mockLayout(50, '16px');
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(screen.getByText('R...')).toBeDefined();
  });

  test('handles empty text', () => {
    mockLayout(1000, '16px');
    render(<TruncatedText text="" />);
    const heading = screen.getByRole('heading', { level: 6 });
    expect(heading.textContent).toBe('');
  });

  test('cleans up event listener on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<TruncatedText text="Test" />);

    expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(mockCancel).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
