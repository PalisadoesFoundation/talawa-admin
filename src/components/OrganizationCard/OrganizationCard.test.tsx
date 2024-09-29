import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationCard from './OrganizationCard';

describe('Testing the Organization Card', () => {
  test('should render props and text elements test for the page component', () => {
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

  test('Should render text elements when props value is not passed', () => {
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
