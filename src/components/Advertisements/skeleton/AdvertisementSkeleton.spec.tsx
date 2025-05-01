import React from 'react';
import { describe, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { AdvertisementSkeleton } from './AdvertisementSkeleton';

describe('Testing Advertisement Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Testing AdvertisementSkeleton Component', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <MockedProvider addTypename={false}>
              <AdvertisementSkeleton />
            </MockedProvider>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );

    console.log(screen.debug());
    expect(screen.getByTestId('skeleton-1')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-2')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-3')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-4')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-5')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-6')).toBeInTheDocument();
  });
});
