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

const props: InterfacePropType = {
  event: {
    _id: 'testEvent',
    title: 'Test Event',
    description: 'Test Description',
    organization: {
      _id: 'Test Organization',
    },
  },
  setShowAddEventProjectModal: jest.fn(),
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

describe('Testing Left Drawer Wrapper component for the Event Dashboard', () => {
  test('Component should be rendered properly and the close menu button should function', async () => {
    const { queryByText, queryByTestId } = render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LeftDrawerEventWrapper {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Event Management')).toBeInTheDocument()
    );
    fireEvent.click(queryByTestId('closeLeftDrawerBtn') as HTMLElement);
  });
});
