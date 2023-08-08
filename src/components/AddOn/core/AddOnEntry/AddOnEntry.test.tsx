import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';

import type { NormalizedCacheObject } from '@apollo/client';
import { BACKEND_URL } from 'Constant/constant';

const httpLink = new HttpLink({
  uri: BACKEND_URL,
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token') || '',
  },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([httpLink]),
});

describe('Testing AddOnEntry', () => {
  const props = {
    id: 'string',
    enabled: true,
    title: 'string',
    description: 'string',
    createdBy: 'string',
    component: 'string',
    installed: true,
    configurable: true,
    modified: true,
    isInstalled: true,
    getInstalledPlugins: (): { sample: string } => {
      return { sample: 'sample' };
    },
  };

  // test('should render modal and take info to add plugin for registered organization', () => {
  // const { getByTestId } = render(
  //   <ApolloProvider client={client}>
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <I18nextProvider i18n={i18nForTest}>
  //           {<AddOnEntry {...props} />}
  //         </I18nextProvider>
  //       </BrowserRouter>
  //     </Provider>
  //   </ApolloProvider>
  // );
  // expect(getByTestId('AddOnEntry')).toBeInTheDocument();
  // });
});
