import React, { act } from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import PromotedPost from './PromotedPost';

/**
 * Unit tests for the PromotedPost component.
 *
 * 1. **Render check**: Verifies the component renders correctly with props like title and image.
 * 2. **Image prop check**: Tests if the component renders correctly with an image.
 * 3. **Icon display**: Ensures the icon (StarPurple500Icon) is displayed.
 * 4. **Text display**: Checks that the post title is displayed correctly.
 * 5. **Image display**: Verifies the correct image is displayed when the image prop is set.
 *
 * GraphQL data is mocked for backend simulation.
 */

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
  image: '',
  title: 'Test Post',
};

describe('Testing PromotedPost Test', () => {
  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PromotedPost {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  it('Component should be rendered properly if prop image is not undefined', async () => {
    props = {
      ...props,
      image: 'promotedPostImage',
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PromotedPost {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });
});

it('Component should display the icon correctly', async () => {
  const { queryByTestId } = render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PromotedPost {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await waitFor(() => {
    const icon = queryByTestId('StarPurple500Icon');
    expect(icon).toBeInTheDocument();
  });
});

it('Component should display the text correctly', async () => {
  const { queryAllByText } = render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <PromotedPost {...props} />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await waitFor(() => {
    const title = queryAllByText('Test Post') as HTMLElement[];
    expect(title[0]).toBeInTheDocument();
  });
});

it('Component should display the image correctly', async () => {
  props = {
    ...props,
    image: 'promotedPostImage',
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
    </MockedProvider>,
  );

  await waitFor(() => {
    const image = queryByRole('img');
    expect(image).toHaveAttribute('src', 'promotedPostImage');
  });
});
