import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';

import i18nForTest from 'utils/i18nForTest';
import type { InterfaceOrgListCardProps } from './OrgListCard';
import OrgListCard from './OrgListCard';
import { IS_SAMPLE_ORGANIZATION_QUERY } from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem, removeItem } = useLocalStorage();

// Mock window.location
const mockAssign = vi.fn();
Object.defineProperty(window, 'location', {
  value: { assign: mockAssign },
  writable: true,
});

const MOCKS = [
  {
    request: {
      query: IS_SAMPLE_ORGANIZATION_QUERY,
      variables: {
        isSampleOrganizationId: 'xyz',
      },
    },
    result: {
      data: {
        isSampleOrganization: true,
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const props: InterfaceOrgListCardProps = {
  data: {
    _id: 'xyz',
    name: 'Dogs Care',
    image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
    address: {
      city: 'Sample City',
      countryCode: 'US',
      dependentLocality: 'Sample Dependent Locality',
      line1: '123 Sample Street',
      line2: 'Apartment 456',
      postalCode: '12345',
      sortingCode: 'ABC-123',
      state: 'Sample State',
    },
    admins: [
      {
        _id: '123',
      },
      {
        _id: '456',
      },
    ],
    members: [],
    createdAt: '04/07/2019',
    creator: {
      _id: 'abc',
      firstName: 'John',
      lastName: 'Doe',
    },
  },
};

describe('Testing the Super Dash List', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render props and text elements test for the page component', async () => {
    removeItem('id');
    setItem('id', '123'); // Means the user is an admin

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByAltText(/Dogs Care image/i)).toBeDefined();
    expect(screen.getByText(/Admins:/i)).toBeDefined();
    expect(screen.getByText(/Members:/i)).toBeDefined();
    expect(screen.getByText('Dogs Care')).toBeDefined();
    expect(screen.getByText(/Sample City/i)).toBeDefined();
    expect(screen.getByText(/123 Sample Street/i)).toBeDefined();
    expect(screen.getByTestId(/manageBtn/i)).toBeDefined();
    expect(screen.getByTestId(/flaskIcon/i)).toBeDefined();

    await userEvent.click(screen.getByTestId(/manageBtn/i));
    removeItem('id');
  });

  test('Testing if the props data is not provided', () => {
    window.location.assign('/orgdash');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(mockAssign).toHaveBeenCalledWith('/orgdash');
  });

  test('Testing if component is rendered properly when image is null', () => {
    const imageNullProps = {
      ...props,
      ...{ data: { ...props.data, ...{ image: null } } },
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...imageNullProps} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId(/emptyContainerForImage/i)).toBeDefined();
  });

  test('Testing if user is redirected to orgDash screen', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrgListCard {...props} />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await userEvent.click(screen.getByTestId('manageBtn'));
  });
});
