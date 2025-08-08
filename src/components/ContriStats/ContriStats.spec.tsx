import React from 'react';
import { render, screen } from '@testing-library/react';
import ContriStats from './ContriStats';
import { I18nextProvider } from 'react-i18next';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import type { NormalizedCacheObject } from '@apollo/client';
import i18nForTest from 'utils/i18nForTest';
import { BACKEND_URL } from 'Constant/constant';
import { describe, test, expect } from 'vitest';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: BACKEND_URL,
});

describe('Testing Contribution Stats', () => {
  const props = {
    id: '234',
    recentAmount: '200',
    highestAmount: '500',
    totalAmount: '1000',
  };

  test('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18nForTest}>
          <ContriStats {...props} />
        </I18nextProvider>
      </ApolloProvider>,
    );
    expect(screen.getByText('Recent Contribution: $')).toBeInTheDocument();
    expect(screen.getByText('Highest Contribution: $')).toBeInTheDocument();
    expect(screen.getByText('Total Contribution: $')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
  });
});
