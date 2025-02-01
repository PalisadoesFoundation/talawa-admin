import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';

import i18nForTest from 'utils/i18nForTest';
import type { InterfaceOrgListCardPropsPG } from './OrgListCard';
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

const props: InterfaceOrgListCardPropsPG = {
  data: {
    id: 'xyz',
    name: 'Dogs Care',
    avatarURL: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
    description: 'Dog care center',
    members: {
      edges: [],
    },
    addressLine1: 'Texas, USA',
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
    expect(screen.getByText(/Members:/i)).toBeDefined();
    expect(screen.getByText('Dogs Care')).toBeDefined();
    expect(screen.getByText(/Texas/i)).toBeDefined();
    expect(screen.getByTestId(/manageBtn/i)).toBeDefined();

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
      ...{ data: { ...props.data, ...{ avatarURL: null } } },
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
