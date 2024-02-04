import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import OrgScreen from './OrgScreen';
import { MockedProvider } from '@apollo/react-testing';

const props = {
  screenName: 'Organizations',
  children: <div>Test Children</div>,
};

describe('Testing OrgScreen Component [User Portal]', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <OrgScreen {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    // Check childrens are in the document
    expect(screen.getByTestId('childrenContainer')).toBeInTheDocument();
    expect(screen.getByText('Test Children')).toBeInTheDocument();

    // Test change of drawer state on resize of width
    window.innerWidth = 800;
    fireEvent(window, new Event('resize'));

    // Check expand button is present
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('expandButton') as HTMLElement);
    });

    // Check expand button is absent
    expect(screen.queryByTestId('expandButton')).not.toBeInTheDocument();
  });
});
