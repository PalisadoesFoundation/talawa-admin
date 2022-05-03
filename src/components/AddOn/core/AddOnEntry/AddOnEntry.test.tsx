import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddOnEntry from './AddOnEntry';

describe('Testing AddOnEntry', () => {
  const props = {
    id: 'string',
    enabled: true,
    title: 'string',
    description: 'string',
    createdBy: 'string',
    component: 'string',
    installed: true,
    configurable: true,
    modified: true,
  };

  test('should render modal and take info to add plugin for registered organization', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <AddOnEntry {...props} />
      </BrowserRouter>
    );

    expect(getByTestId('AddOnEntry')).toBeInTheDocument();
  });
});
