import React from 'react';
import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';

describe('Testing the LoginPage', () => {
  test('should show the text on the website', () => {
    render(<UserCard key="5" image="" firstName="yasharth" lastName="dubey" />);
    expect(screen.getByText('yasharth dubey')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });
});
