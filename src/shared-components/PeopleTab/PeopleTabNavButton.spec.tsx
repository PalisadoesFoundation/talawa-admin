import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PeopleTabNavbarButton from './PeopleTabNavbarButton';

const MockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="icon" {...props} />
);

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

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('changes icon fill when active', () => {
    render(
      <PeopleTabNavbarButton
        title="Events"
        icon={<MockIcon />}
        isActive
        action={vi.fn()}
      />,
    );

    expect(screen.getByTestId('icon')).toHaveAttribute(
      'fill',
      'var(--bs-black)',
    );
  });

  it('calls action function when clicked', () => {
    const actionMock = vi.fn();

    render(<PeopleTabNavbarButton title="Events" action={actionMock} />);

    fireEvent.click(screen.getByText('Events'));
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
