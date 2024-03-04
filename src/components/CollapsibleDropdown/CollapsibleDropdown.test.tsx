import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import CollapsibleDropdown from './CollapsibleDropdown';
import type { InterfaceCollapsibleDropdown } from './CollapsibleDropdown';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/orgstore',
    state: {},
    key: '',
    search: '',
    hash: '',
  }),
}));

const props: InterfaceCollapsibleDropdown = {
  showDropdown: true,
  setShowDropdown: jest.fn(),
  target: {
    name: 'DropDown Category',
    url: undefined,
    subTargets: [
      {
        name: 'SubCategory 1',
        url: '/sub-category-1',
        icon: 'fa fa-home',
      },
      {
        name: 'SubCategory 2',
        url: '/sub-category-2',
        icon: 'fa fa-home',
      },
    ],
  },
};

describe('Testing CollapsibleDropdown component', () => {
  test('Component should be rendered properly', () => {
    render(
      <BrowserRouter>
        <CollapsibleDropdown {...props} />
      </BrowserRouter>,
    );
    expect(screen.getByText('DropDown Category')).toBeInTheDocument();
    expect(screen.getByText('SubCategory 1')).toBeInTheDocument();
    expect(screen.getByText('SubCategory 2')).toBeInTheDocument();
  });

  test('Dropdown should be rendered and functioning correctly', () => {
    render(
      <BrowserRouter>
        <CollapsibleDropdown {...props} />
      </BrowserRouter>,
    );
    const parentDropdownBtn = screen.getByTestId('collapsible-dropdown');
    const activeDropdownBtn = screen.getByText('SubCategory 1');
    const nonActiveDropdownBtn = screen.getByText('SubCategory 2');

    // Check if dropdown is rendered with correct classes
    activeDropdownBtn.click();
    expect(parentDropdownBtn).toBeInTheDocument();
    expect(parentDropdownBtn).toHaveClass('text-white');
    expect(parentDropdownBtn).toHaveClass('btn-success');

    // Check if active dropdown is rendered with correct classes
    expect(activeDropdownBtn).toBeInTheDocument();
    expect(activeDropdownBtn).toHaveClass('text-white');
    expect(activeDropdownBtn).toHaveClass('btn-success');

    // Check if inactive dropdown is rendered with correct classes
    expect(nonActiveDropdownBtn).toBeInTheDocument();
    expect(nonActiveDropdownBtn).toHaveClass('text-secondary');
    expect(nonActiveDropdownBtn).toHaveClass('btn-light');

    // Check if dropdown is collapsed after clicking on it
    fireEvent.click(parentDropdownBtn);
    expect(props.setShowDropdown).toHaveBeenCalledWith(false);

    // Check if dropdown is expanded after clicking on it again
    fireEvent.click(parentDropdownBtn);
    expect(props.setShowDropdown).toHaveBeenCalledWith(true);

    // Click on non active dropdown button and check if it navigates to the correct url
    nonActiveDropdownBtn.click();
    expect(window.location.pathname).toBe('/sub-category-2');
  });
});
