import { render, screen, act } from '@testing-library/react';
import TruncatedText from './TruncatedText';
import React from 'react';
import { vi } from 'vitest';

const originalOffsetWidth = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'offsetWidth',
);

const mockLayout = (width: number, fontSize = '16px') => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: width,
  });

  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    fontSize,
  } as CSSStyleDeclaration);
};

describe('TruncatedText Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalOffsetWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        'offsetWidth',
        originalOffsetWidth,
      );
    }
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test('renders h6 element with correct class', () => {
    render(<TruncatedText text="Hello" />);
    const heading = screen.getByRole('heading', { level: 6 });
    expect(heading).toHaveClass('text-secondary');
  });

  test('renders full text when width allows', () => {
    render(<TruncatedText text="This is a long text" maxWidthOverride={500} />);
    expect(screen.getByText('This is a long text')).toBeInTheDocument();
  });

  test('truncates text when width is small', () => {
    mockLayout(40);

    render(<TruncatedText text="This is a long text" />);

    const truncated = screen.getByText((content) => content.endsWith('...'));

    expect(truncated).toBeInTheDocument();
  });

  test('handles empty text safely', () => {
    render(<TruncatedText text="" />);
    const heading = screen.getByRole('heading', { level: 6 });
    expect(heading.textContent).toBe('');
  });

  test('recalculates truncation on window resize (debounced)', () => {
    mockLayout(300);

    render(
      <TruncatedText text="This is a very long text that should truncate" />,
    );

    mockLayout(40);

    act(() => {
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(100);
    });

    const truncated = screen.getByText((content) => content.endsWith('...'));

    expect(truncated).toBeInTheDocument();
  });

  test('cleans up resize listener on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<TruncatedText text="Cleanup test" />);

    const resizeCall = addSpy.mock.calls.find(([type]) => type === 'resize');
    expect(resizeCall).toBeTruthy();
    const resizeHandler = resizeCall?.[1];
    expect(typeof resizeHandler).toBe('function');

    unmount();

    expect(
      removeSpy.mock.calls.some(
        ([type, handler]) => type === 'resize' && handler === resizeHandler,
      ),
    ).toBe(true);
  });
});
