import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PeopleTabUserOrganizations from './PeopleTabUserOrganizations';

describe('PeopleTabUserOrganizations', () => {
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

  it('handles click on the action button', () => {
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
    fireEvent.click(button);

    // No onClick is passed in the original component, so here you would just check it exists
    expect(button).toBeInTheDocument();
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
    expect(button).toBeEmptyDOMElement(); // no icon or label
  });
});
