import { render, waitFor } from '@testing-library/react';
import { AverageRating } from './AverageRating';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { NotificationToastContainer } from 'components/NotificationToast/NotificationToast';
import { vi, describe, expect, it } from 'vitest';
import { nonEmptyProps } from '../../EventStatsMocks';

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: Record<string, unknown>) => {
        if (key === 'eventStats.averageRating.title')
          return 'Average Review Score';
        if (key === 'eventStats.averageRating.rated')
          return `Rated ${options?.score} / 5`;
        return key;
      },
    }),
  };
});

describe('Testing Average Rating Card', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('The component should be rendered and the Score should be shown', async () => {
    const { queryByText } = render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <NotificationToastContainer />
            <AverageRating {...nonEmptyProps} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

    await waitFor(() =>
      expect(queryByText('Average Review Score')).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(queryByText('Rated 5.00 / 5')).toBeInTheDocument(),
    );
  });
});
