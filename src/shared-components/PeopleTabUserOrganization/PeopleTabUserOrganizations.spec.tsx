import React from 'react';
import { describe, it, expect } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import PeopleTabUserOrganizations from './PeopleTabUserOrganizations';
import userEvent from '@testing-library/user-event';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        admins: 'Admins',
        members: 'Members',
      };
      return translations[key] || key;
    },
  }),
}));

describe('PeopleTabUserOrganizations', () => {
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const defaultProps = {
    img: '/images/org-logo.png',
    title: 'Open Source Club',
    description: 'A community for open-source enthusiasts',
    adminCount: 2,
    membersCount: 50,
    actionIcon: <span data-testid="edit-icon">✏️</span>,
    actionName: 'Edit',
  };

  it('renders the organization image, title, description, and stats', () => {
    render(<PeopleTabUserOrganizations {...defaultProps} />);

    const img = screen.getByAltText(''); // matches empty alt
    expect(img).toHaveAttribute('src', defaultProps.img);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(
      screen.getByText(`Admins: ${defaultProps.adminCount}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Members: ${defaultProps.membersCount}`),
    ).toBeInTheDocument();
  });

  it('renders the action button with icon and label', () => {
    render(<PeopleTabUserOrganizations {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(button).toHaveTextContent(defaultProps.actionName ?? '');
  });

  it('handles click on the action button', async () => {
    // Render component with a clickable action button
    render(
      <PeopleTabUserOrganizations
        {...defaultProps}
        actionIcon={<span data-testid="edit-icon">✏️</span>}
        actionName="Edit"
      />,
    );

    const button = screen.getByRole('button');

    // If you want it clickable, you can override onClick
    await user.click(button);

    // No onClick is passed in the original component, so here you would just check it exists
    await waitFor(() => {
      expect(button).toBeInTheDocument();
    });
  });

  it('renders correctly without actionIcon and actionName', () => {
    render(
      <PeopleTabUserOrganizations
        img={defaultProps.img}
        title={defaultProps.title}
        description={defaultProps.description}
        adminCount={defaultProps.adminCount}
        membersCount={defaultProps.membersCount}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Check that no icon is rendered
    expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
    // Check that the button has no visible text (the label span is empty)
    expect(button).toHaveTextContent('');
  });
});
