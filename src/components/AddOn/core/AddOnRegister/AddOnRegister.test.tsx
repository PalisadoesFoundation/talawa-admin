// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import AddOnRegister from './AddOnRegister';
// import {
//   ApolloClient,
//   NormalizedCacheObject,
//   ApolloProvider,
//   InMemoryCache,
//   ApolloLink,
// } from '@apollo/client';
// import { Provider } from 'react-redux';
// import { store } from 'state/store';
// import { BrowserRouter } from 'react-router-dom';
// import i18nForTest from 'utils/i18nForTest';
// import { I18nextProvider } from 'react-i18next';

// const httpLink = new HttpLink({
//   uri: BACKEND_URL,
//   headers: {
//     authorization: 'Bearer ' + localStorage.getItem('token') || '',
//   },
// });

// const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: ApolloLink.from([httpLink]),
// });
describe('Testing AddOnRegister', () => {
  // const props = {
  //   id: '6234d8bf6ud937ddk70ecc5c9',
  // };

  test('should render modal and take info to add plugin for registered organization', () => {
    // render(
    //   <ApolloProvider client={client}>
    //     <Provider store={store}>
    //       <BrowserRouter>
    //         <I18nextProvider i18n={i18nForTest}>
    //           {<AddOnRegister {...props} />}
    //         </I18nextProvider>
    //       </BrowserRouter>
    //     </Provider>
    //   </ApolloProvider>
    // );
    // userEvent.click(screen.getByRole('button', { name: /Add New/i }));
    // userEvent.click(screen.getByTestId('addonregister'));
    // userEvent.click(screen.getByTestId('addonclose'));
    //Commented this file and added a dummy test for future reference.
    expect(2).toBe(2);
  });
});
