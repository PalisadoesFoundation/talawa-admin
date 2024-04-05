import React from 'react';
<<<<<<< HEAD
import { render, screen, fireEvent } from '@testing-library/react';
=======
import { render, screen } from '@testing-library/react';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
import { BrowserRouter } from 'react-router-dom';

import CollapsibleDropdown from './CollapsibleDropdown';
import type { InterfaceCollapsibleDropdown } from './CollapsibleDropdown';

<<<<<<< HEAD
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
=======
const props: InterfaceCollapsibleDropdown = {
  screenName: 'SubCategory 1',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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
<<<<<<< HEAD
    render(
      <BrowserRouter>
        <CollapsibleDropdown {...props} />
      </BrowserRouter>,
    );
=======
    render(<CollapsibleDropdown {...props} />);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    expect(screen.getByText('DropDown Category')).toBeInTheDocument();
    expect(screen.getByText('SubCategory 1')).toBeInTheDocument();
    expect(screen.getByText('SubCategory 2')).toBeInTheDocument();
  });

  test('Dropdown should be rendered and functioning correctly', () => {
    render(
      <BrowserRouter>
        <CollapsibleDropdown {...props} />
<<<<<<< HEAD
      </BrowserRouter>,
=======
      </BrowserRouter>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
    const parentDropdownBtn = screen.getByTestId('collapsible-dropdown');
    const activeDropdownBtn = screen.getByText('SubCategory 1');
    const nonActiveDropdownBtn = screen.getByText('SubCategory 2');

    // Check if dropdown is rendered with correct classes
<<<<<<< HEAD
    activeDropdownBtn.click();
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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

<<<<<<< HEAD
    // Check if dropdown is collapsed after clicking on it
    fireEvent.click(parentDropdownBtn);
    expect(props.setShowDropdown).toHaveBeenCalledWith(false);

    // Check if dropdown is expanded after clicking on it again
    fireEvent.click(parentDropdownBtn);
    expect(props.setShowDropdown).toHaveBeenCalledWith(true);
=======
    // Check if dropdown is expanded by default since the screenName prop passes
    // the same value as the name prop of the subTarget
    expect(parentDropdownBtn).toHaveAttribute('aria-expanded', 'true');

    // Check if dropdown is collapsed after clicking on it
    parentDropdownBtn.click();
    expect(parentDropdownBtn).toHaveAttribute('aria-expanded', 'false');

    // Check if dropdown is expanded after clicking on it again
    parentDropdownBtn.click();
    expect(parentDropdownBtn).toHaveAttribute('aria-expanded', 'true');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

    // Click on non active dropdown button and check if it navigates to the correct url
    nonActiveDropdownBtn.click();
    expect(window.location.pathname).toBe('/sub-category-2');
  });
});
