import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import Tooltip from './Tooltip';

describe('Tooltip component', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test('renders children correctly', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
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
        <button>Hover me</button>
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
        <button>Hover me</button>
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
        <button>Focus me</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Focus me' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    // Focus the button
    await user.click(button);
    vi.advanceTimersByTime(0);

    await waitFor(() => {
      expect(tooltip).toHaveAttribute('aria-hidden', 'false');
    });
  });

  test('hides tooltip on blur', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <div>
        <Tooltip content="Tooltip text" delayShow={0} delayHide={0}>
          <button>Focus me</button>
        </Tooltip>
        <button>Other button</button>
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
        <button>Hover me</button>
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
        <button>Hover me</button>
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
        <button>Hover me</button>
      </Tooltip>,
    );

    let tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('top');

    rerender(
      <Tooltip content="Tooltip text" placement="bottom">
        <button>Hover me</button>
      </Tooltip>,
    );
    tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('bottom');

    rerender(
      <Tooltip content="Tooltip text" placement="left">
        <button>Hover me</button>
      </Tooltip>,
    );
    tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('left');

    rerender(
      <Tooltip content="Tooltip text" placement="right">
        <button>Hover me</button>
      </Tooltip>,
    );
    tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('right');
  });

  test('renders just children when content is empty', () => {
    render(
      <Tooltip content="">
        <button>No tooltip</button>
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
        <button>Hover me</button>
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
        <button>Hover me</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip.className).toContain('custom-tooltip');
  });
});
