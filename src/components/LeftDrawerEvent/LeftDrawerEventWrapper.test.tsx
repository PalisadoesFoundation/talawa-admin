import React from 'react';
import 'jest-localstorage-mock';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import {
  type InterfacePropType,
  LeftDrawerEventWrapper,
} from './LeftDrawerEventWrapper';
import { MockedProvider } from '@apollo/react-testing';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';
<<<<<<< HEAD
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();
=======
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const props: InterfacePropType = {
  event: {
    _id: 'testEvent',
    title: 'Test Event',
    description: 'Test Description',
    organization: {
      _id: 'Test Organization',
    },
  },
<<<<<<< HEAD
=======
  setShowAddEventProjectModal: jest.fn(),
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  children: null,
};

const mocks = [
  {
    request: {
      query: EVENT_FEEDBACKS,
      variables: {
        id: 'testEvent',
      },
    },
    result: {
      data: {
        event: {
          _id: 'testEvent',
          feedback: [],
          averageFeedbackScore: 5,
        },
      },
    },
  },
];

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Jest)
// They are required by the feedback statistics component
jest.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: jest.fn(),
  PieChart: jest.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: jest.fn(),
}));

beforeEach(() => {
<<<<<<< HEAD
  setItem('FirstName', 'John');
  setItem('LastName', 'Doe');
  setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
=======
  localStorage.setItem('FirstName', 'John');
  localStorage.setItem('LastName', 'Doe');
  localStorage.setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe'
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  );
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Testing Left Drawer Wrapper component for the Event Dashboard', () => {
  test('Component should be rendered properly and the close menu button should function', async () => {
<<<<<<< HEAD
    const { queryByText, getByTestId } = render(
=======
    const { queryByText, queryByTestId } = render(
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawerEventWrapper {...props} />
          </I18nextProvider>
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
    );

    const pageContainer = getByTestId('mainpageright');
    expect(pageContainer.className).toMatch(/pageContainer/i);
    await waitFor(() =>
      expect(queryByText('Event Management')).toBeInTheDocument(),
    );
    // Resize window to trigger handleResize
    window.innerWidth = 800; // Set a width less than or equal to 820
    fireEvent(window, new Event('resize'));

    await waitFor(() => {
      fireEvent.click(getByTestId('openMenu') as HTMLElement);
    });

    // sets hideDrawer to true
    await waitFor(() => {
      fireEvent.click(getByTestId('menuBtn') as HTMLElement);
    });

    // Resize window back to a larger width
    window.innerWidth = 1000; // Set a larger width
    fireEvent(window, new Event('resize'));

    // sets hideDrawer to false
    await waitFor(() => {
      fireEvent.click(getByTestId('openMenu') as HTMLElement);
    });

    // sets hideDrawer to true
    await waitFor(() => {
      fireEvent.click(getByTestId('menuBtn') as HTMLElement);
    });
=======
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Event Management')).toBeInTheDocument()
    );
    fireEvent.click(queryByTestId('closeLeftDrawerBtn') as HTMLElement);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  });
});
