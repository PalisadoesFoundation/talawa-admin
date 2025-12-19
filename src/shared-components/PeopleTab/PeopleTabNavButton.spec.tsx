// PeopleTabNavbarButton.spec.tsx
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PeopleTabNavbarButton from './PeopleTabNavbarButton';

// Mock a simple SVG icon
const MockIcon = () => <svg data-testid="mockIcon" />;

describe('PeopleTabNavbarButton', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title correctly', () => {
    render(<PeopleTabNavbarButton title="Events" action={vi.fn()} />);

    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('renders an icon if provided', () => {
    render(
      <PeopleTabNavbarButton
        title="Events"
        icon={<MockIcon />}
        action={vi.fn()}
      />,
    );

    expect(screen.getByTestId('mockIcon')).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    render(
      <PeopleTabNavbarButton title="Events" isActive={true} action={vi.fn()} />,
    );

    const buttonDiv = screen.getByText('Events').closest('div');
    expect(buttonDiv).toHaveClass('active');
  });

  it('calls action function when clicked', () => {
    const actionMock = vi.fn();

    render(<PeopleTabNavbarButton title="Events" action={actionMock} />);

    const buttonDiv = screen.getByText('Events').closest('div');
    if (buttonDiv) fireEvent.click(buttonDiv);

    expect(actionMock).toHaveBeenCalledTimes(1);
  });

  it('applies testId correctly', () => {
    render(
      <PeopleTabNavbarButton
        title="Events"
        action={vi.fn()}
        testId="peopleTabEventsBtn"
      />,
    );

    expect(screen.getByTestId('peopleTabEventsBtn')).toBeInTheDocument();
  });
});
