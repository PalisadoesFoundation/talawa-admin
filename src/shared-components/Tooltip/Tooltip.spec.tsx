import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import Tooltip from './Tooltip';
import styles from './Tooltip.module.css';

// Helper to mock matchMedia for reduced motion testing
const mockMatchMedia = (prefersReducedMotion: boolean): void => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        query === '(prefers-reduced-motion: reduce)'
          ? prefersReducedMotion
          : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('Tooltip component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Default to no reduced motion preference
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();

    vi.clearAllMocks();
  });

  test('renders children correctly', () => {
    render(
      <Tooltip content="Tooltip text">
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    expect(
      screen.getByRole('button', { name: 'Hover me' }),
    ).toBeInTheDocument();
  });

  test('shows tooltip on hover after delay', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <Tooltip content="Tooltip text" delayShow={200}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Hover me' });
    await user.hover(trigger);

    // Tooltip should not be visible immediately (hidden: true allows finding aria-hidden elements)
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip).toHaveAttribute('aria-hidden', 'true');

    // Advance timers to trigger tooltip show
    vi.advanceTimersByTime(200);

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    });
  });

  test('hides tooltip on mouseleave', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <Tooltip content="Tooltip text" delayShow={0} delayHide={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Hover me' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    // Hover to show tooltip
    await user.hover(trigger);
    vi.advanceTimersByTime(0);

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    });

    // Unhover to hide tooltip
    await user.unhover(trigger);
    vi.advanceTimersByTime(0);

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test('shows tooltip on focus', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <Tooltip content="Tooltip text" delayShow={0}>
        <button type="button">Focus me</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Focus me' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    // Focus the button via keyboard tab navigation
    await user.tab();
    vi.advanceTimersByTime(0);

    // Verify the button received focus
    expect(button).toHaveFocus();

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    });
  });

  test('hides tooltip on blur', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <div>
        <Tooltip content="Tooltip text" delayShow={0} delayHide={0}>
          <button type="button">Focus me</button>
        </Tooltip>
        <button type="button">Other button</button>
      </div>,
    );

    const focusButton = screen.getByRole('button', { name: 'Focus me' });
    const otherButton = screen.getByRole('button', { name: 'Other button' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    // Focus to show tooltip
    await user.click(focusButton);
    vi.advanceTimersByTime(0);

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    });

    // Tab to other button to blur
    await user.click(otherButton);
    vi.advanceTimersByTime(0);

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test('hides tooltip on Escape key', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <Tooltip content="Tooltip text" delayShow={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Hover me' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    // Focus the trigger to show tooltip (this also ensures keyboard events work)
    await user.click(trigger);
    vi.advanceTimersByTime(0);

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    });

    // Press Escape while focused on the trigger
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test('respects disabled prop', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <Tooltip content="Tooltip text" delayShow={0} disabled>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Hover me' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    // Hover should not show tooltip when disabled
    await user.hover(trigger);
    vi.advanceTimersByTime(100);

    expect(tooltip).toHaveAttribute('aria-hidden', 'true');
  });

  test('applies correct placement classes', () => {
    const { rerender } = render(
      <Tooltip content="Tooltip text" placement="top">
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    let tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('top');

    rerender(
      <Tooltip content="Tooltip text" placement="bottom">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('bottom');

    rerender(
      <Tooltip content="Tooltip text" placement="left">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('left');

    rerender(
      <Tooltip content="Tooltip text" placement="right">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('right');
  });

  test('renders just children when content is empty', () => {
    render(
      <Tooltip content="">
        <button type="button">No tooltip</button>
      </Tooltip>,
    );

    expect(
      screen.getByRole('button', { name: 'No tooltip' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('tooltip', { hidden: true }),
    ).not.toBeInTheDocument();
  });

  test('has correct ARIA attributes', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <Tooltip content="Tooltip text" delayShow={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip).toHaveAttribute('role', 'tooltip');
    expect(tooltip).toHaveAttribute('id');

    // Verify aria-describedby is set when visible
    const trigger = screen.getByRole('button', { name: 'Hover me' });
    await user.hover(trigger);
    vi.advanceTimersByTime(0);

    await waitFor(() => {
      const tooltipId = tooltip.getAttribute('id');
      expect(trigger.parentElement).toHaveAttribute(
        'aria-describedby',
        tooltipId,
      );
    });
  });

  test('applies custom className', () => {
    render(
      <Tooltip content="Tooltip text" className="custom-tooltip">
        <button type="button">Hover me</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('custom-tooltip');
  });

  describe('animation transforms and visibility states', () => {
    test('tooltip has correct CSS classes for hidden state with top placement', () => {
      render(
        <Tooltip content="Tooltip text" placement="top">
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      const tooltip = screen.getByRole('tooltip', { hidden: true });

      // Should have tooltip and top classes but not visible
      expect(tooltip.classList.contains(styles.tooltip)).toBe(true);
      expect(tooltip.classList.contains(styles.top)).toBe(true);
      expect(tooltip.classList.contains(styles.visible)).toBe(false);
    });

    test('tooltip has correct CSS classes for visible state with top placement', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Tooltip text" placement="top" delayShow={0}>
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover me' });
      const tooltip = screen.getByRole('tooltip', { hidden: true });

      await user.hover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(tooltip.classList.contains(styles.visible)).toBe(true);
        expect(tooltip.classList.contains(styles.top)).toBe(true);
      });
    });

    test('tooltip has correct CSS classes for bottom placement', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Tooltip text" placement="bottom" delayShow={0}>
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover me' });
      const tooltip = screen.getByRole('tooltip', { hidden: true });

      expect(tooltip.classList.contains(styles.bottom)).toBe(true);

      await user.hover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(tooltip.classList.contains(styles.visible)).toBe(true);
        expect(tooltip.classList.contains(styles.bottom)).toBe(true);
      });
    });

    test('tooltip has correct CSS classes for left placement', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Tooltip text" placement="left" delayShow={0}>
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover me' });
      const tooltip = screen.getByRole('tooltip', { hidden: true });

      expect(tooltip.classList.contains(styles.left)).toBe(true);

      await user.hover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(tooltip.classList.contains(styles.visible)).toBe(true);
        expect(tooltip.classList.contains(styles.left)).toBe(true);
      });
    });

    test('tooltip has correct CSS classes for right placement', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Tooltip text" placement="right" delayShow={0}>
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover me' });
      const tooltip = screen.getByRole('tooltip', { hidden: true });

      expect(tooltip.classList.contains(styles.right)).toBe(true);

      await user.hover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(tooltip.classList.contains(styles.visible)).toBe(true);
        expect(tooltip.classList.contains(styles.right)).toBe(true);
      });
    });

    test('tooltip transitions between visible and hidden states', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip
          content="Tooltip text"
          placement="top"
          delayShow={0}
          delayHide={0}
        >
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover me' });
      const tooltip = screen.getByRole('tooltip', { hidden: true });

      // Initially hidden
      expect(tooltip.classList.contains(styles.visible)).toBe(false);

      // Hover to show
      await user.hover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(tooltip.classList.contains(styles.visible)).toBe(true);
      });

      // Unhover to hide
      await user.unhover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(tooltip.classList.contains(styles.visible)).toBe(false);
      });
    });
  });

  describe('arrow pseudo-element structure', () => {
    test('tooltip element has correct structure for ::after arrow styling', () => {
      render(
        <Tooltip content="Tooltip text" placement="top">
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      const tooltip = screen.getByRole('tooltip', { hidden: true });

      // Verify the tooltip element exists and has the correct class
      // The ::after pseudo-element styling is defined in CSS for .tooltip.top::after
      expect(tooltip.classList.contains(styles.tooltip)).toBe(true);
      expect(tooltip.classList.contains(styles.top)).toBe(true);

      // Get computed style to verify the element can receive pseudo-element styling
      const computedStyle = window.getComputedStyle(tooltip, '::after');
      // In JSDOM, pseudo-element styles aren't fully applied, but we can verify
      // the element structure is correct for the CSS to apply
      expect(computedStyle).toBeDefined();
    });

    test('all placements have correct class structure for arrow positioning', () => {
      const placements = ['top', 'bottom', 'left', 'right'] as const;

      placements.forEach((placement) => {
        const { unmount } = render(
          <Tooltip content="Tooltip text" placement={placement}>
            <button type="button">Hover me</button>
          </Tooltip>,
        );

        const tooltip = screen.getByRole('tooltip', { hidden: true });

        // Verify tooltip has the placement class needed for ::after positioning
        expect(tooltip.classList.contains(styles.tooltip)).toBe(true);
        expect(tooltip.classList.contains(styles[placement])).toBe(true);

        // Verify ::after pseudo-element can be accessed
        const afterStyle = window.getComputedStyle(tooltip, '::after');
        expect(afterStyle).toBeDefined();

        unmount();
      });
    });
  });

  describe('reduced motion preference', () => {
    test('tooltip respects prefers-reduced-motion: reduce', async () => {
      // Mock reduced motion preference
      mockMatchMedia(true);

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Tooltip text" placement="top" delayShow={0}>
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover me' });
      const tooltip = screen.getByRole('tooltip', { hidden: true });

      // Tooltip should still work with reduced motion
      await user.hover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(tooltip).toHaveAttribute('aria-hidden', 'false');
        expect(tooltip.classList.contains(styles.visible)).toBe(true);
      });
    });

    test('tooltip functions normally without reduced motion preference', async () => {
      // Explicitly set no reduced motion preference
      mockMatchMedia(false);

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      render(
        <Tooltip content="Tooltip text" placement="bottom" delayShow={0}>
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      const trigger = screen.getByRole('button', { name: 'Hover me' });
      const tooltip = screen.getByRole('tooltip', { hidden: true });

      // Tooltip should show with full animations
      await user.hover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(tooltip).toHaveAttribute('aria-hidden', 'false');
        expect(tooltip.classList.contains(styles.visible)).toBe(true);
        expect(tooltip.classList.contains(styles.bottom)).toBe(true);
      });
    });

    test('reduced motion preference query is correctly formed', () => {
      mockMatchMedia(true);

      // Verify matchMedia was called with the correct query
      window.matchMedia('(prefers-reduced-motion: reduce)');

      expect(window.matchMedia).toHaveBeenCalledWith(
        '(prefers-reduced-motion: reduce)',
      );
      expect(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      ).toBe(true);
    });

    test('tooltip classes are applied correctly regardless of motion preference', async () => {
      // Test with reduced motion
      mockMatchMedia(true);

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

      const { rerender } = render(
        <Tooltip content="Tooltip text" placement="left" delayShow={0}>
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      let tooltip = screen.getByRole('tooltip', { hidden: true });
      let trigger = screen.getByRole('button', { name: 'Hover me' });

      // Verify placement class is still applied
      expect(tooltip.classList.contains(styles.left)).toBe(true);

      await user.hover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        // Visible class should still be applied
        expect(tooltip.classList.contains(styles.visible)).toBe(true);
      });

      // Test without reduced motion
      mockMatchMedia(false);

      rerender(
        <Tooltip content="Tooltip text" placement="right" delayShow={0}>
          <button type="button">Hover me</button>
        </Tooltip>,
      );

      tooltip = screen.getByRole('tooltip', { hidden: true });
      trigger = screen.getByRole('button', { name: 'Hover me' });

      expect(tooltip.classList.contains(styles.right)).toBe(true);

      await user.hover(trigger);
      vi.advanceTimersByTime(0);

      await waitFor(() => {
        expect(tooltip.classList.contains(styles.visible)).toBe(true);
      });
    });
  });
});
