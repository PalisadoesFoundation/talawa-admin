import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationCardStart from './OrganizationCardStart';

describe('Testing the Organization Cards', () => {
  test('should render props and text elements test for the page component', () => {
    render(
      <OrganizationCardStart
        id="624135624625"
        key="5"
        image=""
        name="organization"
      />
    );
    expect(screen.getByText('organization')).toBeInTheDocument();
  });
});
