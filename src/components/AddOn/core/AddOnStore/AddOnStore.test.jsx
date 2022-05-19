import React from 'react';
import { render, screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import AddOnStore from './AddOnStore';
import { store } from 'state/store';

describe('Testing AddOnStore Component', () => {
  const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
  });

  test('Should render the component properly and tests available plugins', () => {
    useSelectorMock.mockReturnValue({
      addonStore: [
        {
          id: '123',
          key: '564',
          title: 'Testing',
          description: 'This one is for testing purpose',
          createdBy: 'John Doe',
          component: 'This is a component',
          configurable: false,
        },
      ],
      installed: [],
      targets: [
        {
          name: 'Dashboard',
          url: '/orgdash/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'People',
          url: '/orgpeople/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'Events',
          url: '/orgevents/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'Contributions',
          url: '/orgcontribution/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'Posts',
          url: '/orgpost/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'Plugins',
          subTargets: [
            {
              name: 'Plugin Store',
              url: '/orgstore/id=6236dae0a2632725b46b5da9',
              icon: 'fa-store',
            },
          ],
        },
      ],
    });

    const { container } = render(
      <BrowserRouter>
        <reactRedux.Provider store={store}>
          <AddOnStore />
        </reactRedux.Provider>
      </BrowserRouter>
    );

    expect(container.textContent).not.toBe('Loading data...');
    expect(screen.getAllByText(/Plugins/i)).toBeTruthy();
    expect(screen.getByText(/John Doe/i)).toBeTruthy();
    expect(screen.getByText(/This one is for testing purpose/i)).toBeTruthy();
  });

  test('Should tests installed plugins', () => {
    useSelectorMock.mockReturnValue({
      addonStore: [],
      installed: [
        {
          id: '789',
          key: '663',
          title: 'Testing',
          description: 'This is a installed Plugin',
          createdBy: 'Sam Francisco',
          component: 'This is a component',
          enabled: true,
          installed: true,
          configurable: true,
        },
        {
          id: '739',
          key: '223',
          title: 'Testing 1',
          description: 'This is a disabled Plugin',
          createdBy: 'Sam Smith',
          component: 'This is a component',
          enabled: false,
          installed: true,
          configurable: true,
        },
      ],
      targets: [
        {
          name: 'Dashboard',
          url: '/orgdash/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'People',
          url: '/orgpeople/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'Events',
          url: '/orgevents/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'Contributions',
          url: '/orgcontribution/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'Posts',
          url: '/orgpost/id=6236dae0a2632725b46b5da9',
        },
        {
          name: 'Plugins',
          subTargets: [
            {
              name: 'Plugin Store',
              url: '/orgstore/id=6236dae0a2632725b46b5da9',
              icon: 'fa-store',
            },
          ],
        },
      ],
    });

    const { container } = render(
      <BrowserRouter>
        <reactRedux.Provider store={store}>
          <AddOnStore />
        </reactRedux.Provider>
      </BrowserRouter>
    );

    expect(container.textContent).not.toBe('Loading data...');

    expect(screen.getAllByText(/Plugins/i)).toBeTruthy();

    userEvent.click(screen.getByText('Installed'));

    expect(screen.getByText(/Sam Francisco/i)).toBeTruthy();
    expect(screen.getByText(/This is a installed Plugin/i)).toBeTruthy();

    userEvent.click(screen.getByRole('radio', { name: /disabled/i }));

    expect(screen.getByText(/Sam Smith/i)).toBeTruthy();
    expect(screen.getByText(/This is a disabled Plugin/i)).toBeTruthy();

    userEvent.click(screen.getByRole('radio', { name: /enabled/i }));

    userEvent.click(screen.getByText('Available'));
  });
});
