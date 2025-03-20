import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18n';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import VolunteerContainer from './VolunteerContainer';
import userEvent from '@testing-library/user-event';
import { MOCKS } from './Volunteers/Volunteers.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { act } from 'react-dom/test-utils';

/**
 * Unit tests for the `VolunteerContainer` component.
 *
 * The tests ensure the `VolunteerContainer` component renders correctly with various routes and URL parameters.
 * Mocked dependencies are used to isolate the component and verify its behavior.
 * All tests are covered.
 */

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    }),
  };
});

const mockedUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockedUseParams(),
    Navigate: () => <div data-testid="paramsError">Navigated to root</div>,
  };
});

class TestErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null };

  componentDidCatch(error: any) {
    console.error('Error caught by boundary:', error);
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      return <div>Error occurred: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

const renderVolunteerContainer = async (): Promise<RenderResult> => {
  let result: RenderResult;
  await act(async () => {
    result = render(
      <TestErrorBoundary>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <MemoryRouter initialEntries={['/event/orgId/eventId']}>
            <Provider store={store}>
              <LocalizationProvider>
                <I18nextProvider i18n={i18n}>
                  <VolunteerContainer />
                </I18nextProvider>
              </LocalizationProvider>
            </Provider>
          </MemoryRouter>
        </MockedProvider>
      </TestErrorBoundary>,
    );
  });
  return result!;
};

describe('Testing Volunteer Container', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    mockedUseParams.mockReturnValue({});
    await renderVolunteerContainer();
    const errorElement = await screen.findByTestId('paramsError');
    expect(errorElement).toBeInTheDocument();
  });

  it('Testing Volunteer Container Screen -> Toggle screens', async () => {
    mockedUseParams.mockReturnValue({ orgId: 'orgId', eventId: 'eventId' });

    await act(async () => {
      await renderVolunteerContainer();
      // Wait for Apollo cache to be updated
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    try {
      const individualLabel = await screen.findByTestId(
        'individualRadio',
        {},
        { timeout: 2000 },
      );
      expect(individualLabel).toBeInTheDocument();

      await act(async () => {
        await userEvent.click(individualLabel);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        const groupsLabel = await screen.findByTestId('groupsRadio');
        await userEvent.click(groupsLabel);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        const requestsLabel = await screen.findByTestId('requestsRadio');
        await userEvent.click(requestsLabel);
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
