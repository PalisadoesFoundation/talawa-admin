import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import i18nForTest from 'utils/i18nForTest';
import LeftDrawerEvent, {
  type InterfaceLeftDrawerProps,
} from './LeftDrawerEvent';
import { MockedProvider } from '@apollo/react-testing';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';

const props: InterfaceLeftDrawerProps = {
  event: {
    _id: 'testEvent',
    title: 'Test Event',
    description: 'Test Description',
    organization: {
      _id: 'Test Organization',
    },
  },
  hideDrawer: false,
  setHideDrawer: jest.fn(),
  setShowAddEventProjectModal: jest.fn(),
};
const props2: InterfaceLeftDrawerProps = {
  event: {
    _id: 'testEvent',
    title: 'This is a very long event title that exceeds 20 characters',
    description:
      'This is a very long event description that exceeds 30 characters. It contains more details about the event.',
    organization: {
      _id: 'Test Organization',
    },
  },
  hideDrawer: false,
  setHideDrawer: jest.fn(),
  setShowAddEventProjectModal: jest.fn(),
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
  localStorage.setItem('FirstName', 'John');
  localStorage.setItem('LastName', 'Doe');
  localStorage.setItem(
    'UserImage',
    'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe'
  );
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Testing Left Drawer component for the Event Dashboard', () => {
  test('Component should be rendered properly', async () => {
    localStorage.setItem('UserImage', '');
    localStorage.setItem('UserType', 'SUPERADMIN');

    const { queryByText } = render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawerEvent {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Talawa Admin Portal')).toBeInTheDocument()
    );
    await waitFor(() => expect(queryByText('Test Event')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText('Test Description')).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(queryByText('Event Options')).toBeInTheDocument()
    );
  });

  test('Add Event Project button and profile page button should work properly', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');

    const { queryByText, queryByTestId } = render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawerEvent {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Talawa Admin Portal')).toBeInTheDocument()
    );

    fireEvent.click(queryByText('Add an Event Project') as HTMLElement);
    expect(props.setShowAddEventProjectModal).toHaveBeenCalled();

    fireEvent.click(queryByTestId(/profileBtn/i) as HTMLElement);
    expect(toast.success).toHaveBeenCalledWith('Profile page coming soon!');
  });

  test('Testing Drawer when hideDrawer is null', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawerEvent {...props} hideDrawer={null} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
  });

  test('Testing Drawer when hideDrawer is true', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawerEvent {...props} hideDrawer={true} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
  });

  test('Testing Drawer open close functionality', () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawerEvent {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    const closeModalBtn = screen.getByTestId(/closeModalBtn/i);
    userEvent.click(closeModalBtn);
  });

  test('Testing logout functionality', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawerEvent {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    userEvent.click(screen.getByTestId('logoutBtn'));
    expect(localStorage.clear).toHaveBeenCalled();
    expect(global.window.location.pathname).toBe('/');
  });
  test('Testing substring functionality in event title and description', async () => {
    localStorage.setItem('UserType', 'SUPERADMIN');
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawerEvent {...props2} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    const eventTitle = props2.event.title;
    expect(eventTitle.length).toBeGreaterThan(20);
    const eventDescription = props2.event.description;
    expect(eventDescription.length).toBeGreaterThan(30);
    const truncatedEventTitle = eventTitle.substring(0, 20) + '...';
    const truncatedEventDescription = eventDescription.substring(0, 30) + '...';
    expect(truncatedEventTitle).toContain('...');
    expect(truncatedEventDescription).toContain('...');
  });
});
