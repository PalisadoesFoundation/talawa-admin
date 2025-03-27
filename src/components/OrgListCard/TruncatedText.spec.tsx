import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import TruncatedText from './TruncatedText';
import * as useDebounceModule from './useDebounce';

// Mock useDebounce hook with a function we can control
vi.mock('./useDebounce', () => {
  const mockFn = vi.fn(() => ({
    debouncedCallback: vi.fn(),
    cancel: vi.fn(),
  }));
  return { default: mockFn };
});

describe('TruncatedText', () => {
  let originalGetComputedStyle: typeof window.getComputedStyle;
  let addEventListenerSpy: any;
  let removeEventListenerSpy: any;

  beforeEach(() => {
    // Save original method
    originalGetComputedStyle = window.getComputedStyle;

    // Mock getComputedStyle to control font size
    window.getComputedStyle = vi.fn().mockReturnValue({
      fontSize: '16px',
    });

    // Spy on event listeners
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // Mock offset properties
    Object.defineProperty(HTMLHeadingElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 200,
    });
  });

  afterEach(() => {
    // Restore original methods
    window.getComputedStyle = originalGetComputedStyle;
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
    cleanup();
    vi.resetAllMocks();
  });

  it('renders with correct class name', () => {
    render(<TruncatedText text="Test text" />);
    const textElement = screen.getByRole('heading', { level: 6 });
    expect(textElement).toHaveClass('text-secondary');
  });

  it('displays full text when text is short enough', () => {
    const shortText = 'Short text';
    render(<TruncatedText text={shortText} />);
    const textElement = screen.getByRole('heading');
    expect(textElement.textContent).toBe(shortText);
    expect(textElement.textContent).not.toContain('...');
  });

  it('truncates text when it exceeds available width', () => {
    // Long text that will exceed the mocked offsetWidth
    const longText =
      'This is a very long text that should definitely be truncated because it exceeds the available width';
    render(<TruncatedText text={longText} />);

    const textElement = screen.getByRole('heading');
    expect(textElement.textContent).not.toBe(longText);
    expect(textElement.textContent?.endsWith('...')).toBe(true);
    expect(textElement.textContent?.length).toBeLessThan(longText.length);
  });

  it('uses maxWidthOverride if provided', () => {
    const longText = 'This is a fairly long text';
    // Render with a very small max width to force truncation
    render(<TruncatedText text={longText} maxWidthOverride={50} />);

    const textElement = screen.getByRole('heading');
    expect(textElement.textContent).not.toBe(longText);
    expect(textElement.textContent?.endsWith('...')).toBe(true);
  });

  it('recalculates truncation when component props change', () => {
    const { rerender } = render(<TruncatedText text="Initial text" />);

    // Change the text prop
    rerender(<TruncatedText text="New text value" />);
    const textElement = screen.getByRole('heading');
    expect(textElement.textContent).toBe('New text value');

    // Change the maxWidthOverride prop
    rerender(<TruncatedText text="New text value" maxWidthOverride={60} />);
    expect(textElement.textContent?.endsWith('...')).toBe(true);
  });

  it('adds resize event listener on mount and removes it on unmount', () => {
    const { unmount } = render(<TruncatedText text="Test text" />);

    // Check if event listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );

    // Unmount to test cleanup
    unmount();

    // Check if event listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });

  it('recalculates truncation on window resize', () => {
    const debouncedCallbackMock = vi.fn();

    vi.spyOn(useDebounceModule, 'default').mockReturnValue({
      debouncedCallback: debouncedCallbackMock,
      cancel: vi.fn(),
    });

    render(<TruncatedText text="Test text for resize" />);

    window.dispatchEvent(new Event('resize'));

    expect(debouncedCallbackMock).toHaveBeenCalled();
  });

  it('handles null ref gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<TruncatedText text="Test text" />);

    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringMatching(/Cannot read prop.*null/),
    );

    consoleSpy.mockRestore();
  });

  it('demonstrates font size scaling issue in truncation calculation', () => {
    const testText =
      'This is a test text that should be consistently truncated';

    // Mock a specific element width
    Object.defineProperty(HTMLHeadingElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 200,
    });

    // First render with a small font size (e.g., 12px)
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      fontSize: '12px',
    } as CSSStyleDeclaration);

    const { rerender } = render(<TruncatedText text={testText} />);
    const smallFontText = screen.getByRole('heading').textContent || '';

    // Now render with a large font size (e.g., 24px)
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      fontSize: '24px',
    } as CSSStyleDeclaration);

    rerender(<TruncatedText text={testText} />);
    const largeFontText = screen.getByRole('heading').textContent || '';

    // The current formula (0.065 + fontSize * 0.002) means that:
    // - At 12px: charPerPx = 0.065 + 12 * 0.002 = 0.089
    // - At 24px: charPerPx = 0.065 + 24 * 0.002 = 0.113

    // Log the actual results
    console.log(`Small font (12px) text: ${smallFontText}`);
    console.log(`Large font (24px) text: ${largeFontText}`);

    const results = {
      smallFontLength: smallFontText.length,
      largeFontLength: largeFontText.length,
      isScalingCorrect: largeFontText.length <= smallFontText.length,
    };

    console.log('Test results:', results);

    // EXPECTED BEHAVIOR: Larger font should show FEWER characters
    // But the current formula causes the opposite to happen
    expect(results.largeFontLength).toBeLessThan(results.smallFontLength);

    // The failure demonstrates that the component has a bug in its character-per-pixel calculation.
    // To fix this bug, the formula should be changed :
    //   const charPerPx = 0.065 + fontSize * 0.002;
  });
});
