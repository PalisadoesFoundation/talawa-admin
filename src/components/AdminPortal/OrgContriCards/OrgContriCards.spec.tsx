import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { render, screen } from '@testing-library/react';
import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { Defer20220824Handler } from '@apollo/client/incremental';
import { LocalState } from '@apollo/client/local-state';
import { ApolloProvider } from '@apollo/client/react';
import { I18nextProvider } from 'react-i18next';

import OrgContriCards from './OrgContriCards';
import i18nForTest from 'utils/i18nForTest';
import { BACKEND_URL } from 'Constant/constant';
import { describe, expect } from 'vitest';
const client: ApolloClient = new ApolloClient({
  cache: new InMemoryCache(),

  link: new HttpLink({
    uri: BACKEND_URL,
  }),

  /*
  Inserted by Apollo Client 3->4 migration codemod.
  If you are not using the `@client` directive in your application,
  you can safely remove this option.
  */
  localState: new LocalState({}),

  /*
  Inserted by Apollo Client 3->4 migration codemod.
  If you are not using the `@defer` directive in your application,
  you can safely remove this option.
  */
  incrementalHandler: new Defer20220824Handler(),
});

describe('Testing the Organization Contributions Cards', () => {
  const props = {
    key: '123',
    id: '123',
    userName: 'John Doe',
    contriDate: dayjs.utc().format('DD/MM/YYYY'),
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
    expect(
      screen.getByText(dayjs.utc().format('DD/MM/YYYY')),
    ).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('QW56DA88')).toBeInTheDocument();
    expect(screen.getByText('johndoe@gmail.com')).toBeInTheDocument();
  });
});

/*
Start: Inserted by Apollo Client 3->4 migration codemod.
Copy the contents of this block into a `.d.ts` file in your project to enable correct response types in your custom links.
If you do not use the `@defer` directive in your application, you can safely remove this block.
*/

import '@apollo/client';
import { Defer20220824Handler } from '@apollo/client/incremental';

declare module '@apollo/client' {
  export interface TypeOverrides extends Defer20220824Handler.TypeOverrides {}
}

/*
End: Inserted by Apollo Client 3->4 migration codemod.
*/
