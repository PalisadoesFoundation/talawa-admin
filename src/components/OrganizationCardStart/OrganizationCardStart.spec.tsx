import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationCardStart from './OrganizationCardStart';
import { describe, expect } from 'vitest';

describe('Testing the Organization Cards', () => {
  it('should render props and text elements test for the page component', () => {
    const props = {
      id: '123',
      image: 'https://via.placeholder.com/80',
      name: 'Sample',
    };

    render(<OrganizationCardStart key="456" {...props} />);

    expect(screen.getByText(props.name)).toBeInTheDocument();
  });

  it('Should render text elements when props value is not passed', () => {
    const props = {
      id: '123',
      image: '',
      name: 'Sample',
    };

    render(<OrganizationCardStart key="456" {...props} />);

    expect(screen.getByText(props.name)).toBeInTheDocument();
  });
});
