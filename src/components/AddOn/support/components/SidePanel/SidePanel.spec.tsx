import React from 'react';
import { render, screen } from '@testing-library/react';
import SidePanel from './SidePanel';
import { ApolloProvider } from '@apollo/client';
import { client } from 'components/AddOn/mocks';

describe('Testing Contribution Stats', () => {
  /**
   * Props to be passed to the `SidePanel` component during the test.
   */
  const props = {
    collapse: true,
    children: '234',
  };
  /**
   * Verifies that the `SidePanel` component renders correctly with given props.
   */
  test('should render props and text elements test for the SidePanel component', () => {
    render(
      <ApolloProvider client={client}>
        <SidePanel {...props} />
      </ApolloProvider>,
    );
    expect(screen.getByTestId('SidePanel')).toBeInTheDocument();
  });
});
