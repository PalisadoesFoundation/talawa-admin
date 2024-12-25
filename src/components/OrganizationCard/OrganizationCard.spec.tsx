import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationCard from './OrganizationCard';

/**
 * This file contains unit tests for the `OrganizationCard` component.
 *
 * The tests cover:
 * - Rendering the component with all provided props and verifying the correct display of text elements.
 * - Ensuring the component handles cases where certain props (like image) are not provided.
 *
 * These tests utilize the React Testing Library for rendering and querying DOM elements.
 */

describe('Testing the Organization Card', () => {
  it('should render props and text elements test for the page component', () => {
    const props = {
      id: '123',
      image: 'https://via.placeholder.com/80',
      firstName: 'John',
      lastName: 'Doe',
      name: 'Sample',
    };

    render(<OrganizationCard {...props} />);

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText(/Owner:/i)).toBeInTheDocument();
    expect(screen.getByText(props.firstName)).toBeInTheDocument();
    expect(screen.getByText(props.lastName)).toBeInTheDocument();
  });

  it('Should render text elements when props value is not passed', () => {
    const props = {
      id: '123',
      image: '',
      firstName: 'John',
      lastName: 'Doe',
      name: 'Sample',
    };

    render(<OrganizationCard {...props} />);

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText(/Owner:/i)).toBeInTheDocument();
    expect(screen.getByText(props.firstName)).toBeInTheDocument();
    expect(screen.getByText(props.lastName)).toBeInTheDocument();
  });
});
