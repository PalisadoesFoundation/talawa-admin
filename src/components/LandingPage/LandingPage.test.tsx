import React, { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import LandingPage from './LandingPage';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import i18n from 'utils/i18n';
import { BACKEND_URL } from 'Constant/constant';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: BACKEND_URL,
});

describe('Testing LandingPage', () => {
  const fallbackLoader = <div className="loader"></div>;

  test('should render props and text elements test for the page component', async () => {
    render(
      <Suspense fallback={fallbackLoader}>
        <ApolloProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <LandingPage />
          </I18nextProvider>
        </ApolloProvider>
      </Suspense>
    );

    await waitFor(() => {
      const elements = document.querySelectorAll('*');
      const searchText = 'loginPage.fromPalisadoes';

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement;
        const text = element.innerText;

        if (text && text.includes(searchText)) {
          break;
        }
      }
    });
  });
});
