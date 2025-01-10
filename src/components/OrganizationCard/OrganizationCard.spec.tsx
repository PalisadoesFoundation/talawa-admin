import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import OrganizationCard from './OrganizationCard';
import i18nForTest from 'utils/i18nForTest';

/**
 * This file contains unit tests for the `OrganizationCard` component.
 *
 * The tests cover:
 * - Rendering the component with all provided props and verifying the correct display of text elements.
 * - Ensuring the component handles cases where certain props (like image) are not provided.
 *
 * These tests utilize the React Testing Library for rendering and querying DOM elements.
 */

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as object;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const defaultProps = {
  id: '123',
  name: 'Test Organization',
  image: 'test-image.jpg',
  description: 'Test Description',
  admins: [{ id: '1' }],
  members: [{ id: '1' }, { id: '2' }],
  address: {
    city: 'Test City',
    countryCode: 'TC',
    line1: 'Test Line 1',
    postalCode: '12345',
    state: 'Test State',
  },
  userRegistrationRequired: false,
  membershipRequests: [],
};

describe('OrganizationCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders organization card with image', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard {...defaultProps} membershipRequestStatus="" />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    expect(screen.getByText(/admins: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/members: 2/i)).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('renders organization card without image', () => {
    const propsWithoutImage = {
      ...defaultProps,
      image: '',
    };

    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard
              {...propsWithoutImage}
              membershipRequestStatus=""
            />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('emptyContainerForImage')).toBeInTheDocument();
  });

  test('renders "Join Now" button when membershipRequestStatus is empty', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard {...defaultProps} membershipRequestStatus="" />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('joinBtn')).toBeInTheDocument();
  });

  test('renders "Visit" button when membershipRequestStatus is accepted', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard
              {...defaultProps}
              membershipRequestStatus="accepted"
            />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const visitButton = screen.getByTestId('manageBtn');
    expect(visitButton).toBeInTheDocument();

    fireEvent.click(visitButton);
    expect(mockNavigate).toHaveBeenCalledWith('/user/organization/123');
  });

  test('renders "Withdraw" button when membershipRequestStatus is pending', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard
              {...defaultProps}
              membershipRequestStatus="pending"
            />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('withdrawBtn')).toBeInTheDocument();
  });

  test('displays address when provided', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard {...defaultProps} membershipRequestStatus="" />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText(/Test City/i)).toBeInTheDocument();
    expect(screen.getByText(/TC/i)).toBeInTheDocument();
  });

  test('displays organization description', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard {...defaultProps} membershipRequestStatus="" />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('displays correct button based on membership status', () => {
    // Test for empty status (Join Now button)
    const { rerender } = render(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard {...defaultProps} membershipRequestStatus="" />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByTestId('joinBtn')).toBeInTheDocument();

    // Test for accepted status (Visit button)
    rerender(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard
              {...defaultProps}
              membershipRequestStatus="accepted"
            />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByTestId('manageBtn')).toBeInTheDocument();

    // Test for pending status (Withdraw button)
    rerender(
      <MockedProvider>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationCard
              {...defaultProps}
              membershipRequestStatus="pending"
            />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(screen.getByTestId('withdrawBtn')).toBeInTheDocument();
  });
});
