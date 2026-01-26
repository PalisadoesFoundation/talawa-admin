import React, { act } from 'react';
import { render, waitFor } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import type { InterfacePromotedPostProps } from 'types/UserPortal/PromotedPost/interface';
import { BrowserRouter } from 'react-router';
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
 * 6. **No image**: Verifies the image is not rendered when image prop is falsy.
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

describe('Testing PromotedPost Component', () => {
  let props: InterfacePromotedPostProps;

  beforeEach(() => {
    props = {
      id: '1',
      image: '',
      title: 'Test Post',
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Component should be rendered properly', async () => {
    const { getAllByText } = render(
      <MockedProvider link={link}>
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
    const titleElements = getAllByText('Test Post');
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it('Component should be rendered properly if prop image is not undefined', async () => {
    props.image = 'promotedPostImage';

    const { getAllByText, getByRole } = render(
      <MockedProvider link={link}>
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
    const titleElements = getAllByText('Test Post');
    expect(titleElements.length).toBeGreaterThan(0);
    expect(getByRole('img')).toHaveAttribute('src', 'promotedPostImage');
  });

  it('Component should display the icon correctly', async () => {
    const { queryByTestId } = render(
      <MockedProvider link={link}>
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
      const icon = queryByTestId('star-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  it('Component should display the text correctly', async () => {
    const { queryAllByText } = render(
      <MockedProvider link={link}>
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
      const title = queryAllByText('Test Post');
      expect(title[0]).toBeInTheDocument();
    });
  });

  it('Component should display the image correctly when image prop is provided', async () => {
    props.image = 'promotedPostImage';

    const { queryByRole } = render(
      <MockedProvider link={link}>
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

  it('Component should not display image when image prop is empty', async () => {
    props.image = '';

    const { queryByRole } = render(
      <MockedProvider link={link}>
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
      expect(image).not.toBeInTheDocument();
    });
  });

  it('Component should not display image when image prop is null', async () => {
    const propsWithNull = {
      ...props,
      image: null,
    };

    const { queryByRole } = render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PromotedPost {...propsWithNull} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const image = queryByRole('img');
      expect(image).not.toBeInTheDocument();
    });
  });

  it('Component should not display image when image prop is undefined', async () => {
    const propsWithUndefined = {
      ...props,
      image: undefined,
    };

    const { queryByRole } = render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PromotedPost {...propsWithUndefined} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const image = queryByRole('img');
      expect(image).not.toBeInTheDocument();
    });
  });
});
