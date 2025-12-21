import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import UserPortalCard from './UserPortalCard';

describe('UserPortalCard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders with imageSlot, children, and actionsSlot', () => {
    render(
      <UserPortalCard
        ariaLabel="test-card"
        imageSlot={<div>Image</div>}
        actionsSlot={<button type="button">Action</button>}
      >
        <span>Content</span>
      </UserPortalCard>,
    );

    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('renders with only children', () => {
    render(
      <UserPortalCard ariaLabel="only-content">
        <span>Only Content</span>
      </UserPortalCard>,
    );

    expect(screen.getByText('Only Content')).toBeInTheDocument();
    expect(screen.queryByTestId('user-portal-card-image')).toBeNull();
    expect(screen.queryByTestId('user-portal-card-actions')).toBeNull();
  });

  test('renders with only imageSlot', () => {
    render(
      <UserPortalCard ariaLabel="image-only" imageSlot={<div>Avatar</div>}>
        <span>Body</span>
      </UserPortalCard>,
    );

    expect(screen.getByText('Avatar')).toBeInTheDocument();
  });

  test('renders with only actionsSlot', () => {
    render(
      <UserPortalCard
        ariaLabel="actions-only"
        actionsSlot={<button type="button">More</button>}
      >
        <span>Body</span>
      </UserPortalCard>,
    );

    expect(screen.getByText('More')).toBeInTheDocument();
  });

  test('applies compact variant class', () => {
    render(
      <UserPortalCard ariaLabel="compact" variant="compact">
        <span>Compact</span>
      </UserPortalCard>,
    );

    const card = screen.getByTestId('user-portal-card');
    expect(card.className).toMatch(/variantCompact/);
  });

  test('merges custom className', () => {
    render(
      <UserPortalCard ariaLabel="custom" className="custom-class">
        <span>Test</span>
      </UserPortalCard>,
    );

    const card = screen.getByTestId('user-portal-card');
    expect(card.className).toContain('custom-class');
  });

  test('uses custom dataTestId', () => {
    render(
      <UserPortalCard ariaLabel="custom-id" dataTestId="custom-card">
        <span>Test</span>
      </UserPortalCard>,
    );

    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
    expect(screen.getByTestId('custom-card-content')).toBeInTheDocument();
  });

  test('applies aria-label from props', () => {
    render(
      <UserPortalCard ariaLabel="accessible-card">
        <span>A11y</span>
      </UserPortalCard>,
    );

    const card = screen.getByRole('group');
    expect(card).toHaveAttribute('aria-label', 'accessible-card');
  });

  test('applies standard variant class', () => {
    render(
      <UserPortalCard ariaLabel="standard" variant="standard">
        <span>Standard</span>
      </UserPortalCard>,
    );

    const card = screen.getByTestId('user-portal-card');
    expect(card.className).toMatch(/variantStandard/);
  });

  test('applies expanded variant class', () => {
    render(
      <UserPortalCard ariaLabel="expanded" variant="expanded">
        <span>Expanded</span>
      </UserPortalCard>,
    );

    const card = screen.getByTestId('user-portal-card');
    expect(card.className).toMatch(/variantExpanded/);
  });

  test('defaults to standard variant when variant prop is omitted', () => {
    render(
      <UserPortalCard ariaLabel="default">
        <span>Default</span>
      </UserPortalCard>,
    );

    const card = screen.getByTestId('user-portal-card');
    expect(card.className).toMatch(/variantStandard/);
  });

  test('handles undefined ariaLabel gracefully', () => {
    render(
      <UserPortalCard>
        <span>Content</span>
      </UserPortalCard>,
    );

    const card = screen.getByTestId('user-portal-card');
    expect(card).toBeInTheDocument();
    expect(card).not.toHaveAttribute('aria-label');
  });
});
