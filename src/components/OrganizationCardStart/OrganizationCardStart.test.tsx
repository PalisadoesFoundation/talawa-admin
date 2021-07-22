import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganizationCardStart from './OrganizationCardStart';

describe('Testing the LoginPage', () => {
  test('should show the text on the website', () => {
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
