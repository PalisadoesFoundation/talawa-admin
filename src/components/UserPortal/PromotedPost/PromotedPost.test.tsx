import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import PromotedPost from './PromotedPost';

const link = new StaticMockLink([], true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

let props = {
  id: '1',
  media: '',
  title: 'Test Post',
};

describe('Testing PromotedPost Test', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PromotedPost {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Component should be rendered properly if prop image is not undefined', async () => {
    props = {
      ...props,
      media: 'data:image/png;base64,bWVkaWEgY29udGVudA==',
    };

    const { queryByRole } = render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PromotedPost {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      const image = queryByRole('img');
      expect(image).toHaveAttribute(
        'src',
        'data:image/png;base64,bWVkaWEgY29udGVudA=='
      );
    });
  });
});

test('Component should display the icon correctly', async () => {
  const { queryByTestId } = render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PromotedPost {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>
  );

  await waitFor(() => {
    const icon = queryByTestId('StarPurple500Icon');
    expect(icon).toBeInTheDocument();
  });
});

test('Component should display the text correctly', async () => {
  const { queryAllByText } = render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PromotedPost {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>
  );

  await waitFor(() => {
    const title = queryAllByText('Test Post') as HTMLElement[];
    expect(title[0]).toBeInTheDocument();
  });
});

test('Component should display the media correctly', async () => {
  props = {
    ...props,
    media: 'data:video',
  };
  const { queryByRole } = render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PromotedPost {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>
  );

  await waitFor(() => {
    const image = queryByRole('video');
    expect(image).toHaveAttribute('src', 'data:video');
  });
});
