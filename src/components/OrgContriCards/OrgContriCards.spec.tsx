import React from 'react';
import { render, screen } from '@testing-library/react';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';

import OrgContriCards from './OrgContriCards';
import i18nForTest from 'utils/i18nForTest';
import { BACKEND_URL } from 'Constant/constant';
import { describe, expect } from 'vitest';
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: BACKEND_URL,
});

describe('Testing the Organization Contributions Cards', () => {
  const props = {
    key: '123',
    id: '123',
    userName: 'John Doe',
    contriDate: '06/03/2022',
    contriAmount: '500',
    contriTransactionId: 'QW56DA88',
    userEmail: 'johndoe@gmail.com',
  };

  it('should render props and text elements test for the page component', () => {
    render(
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgContriCards
            id={props.key}
            key={props.id}
            userName={props.userName}
            contriDate={props.contriDate}
            contriAmount={props.contriAmount}
            contriTransactionId={props.contriTransactionId}
            userEmail={props.userEmail}
          />
        </I18nextProvider>
      </ApolloProvider>,
    );
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('06/03/2022')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('QW56DA88')).toBeInTheDocument();
    expect(screen.getByText('johndoe@gmail.com')).toBeInTheDocument();
  });
});
