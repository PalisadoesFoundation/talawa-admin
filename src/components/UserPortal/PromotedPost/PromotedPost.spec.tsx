import React from 'react';
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

  const renderComponent = (newProps?: Partial<InterfacePromotedPostProps>) => {
    return render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PromotedPost {...props} {...newProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  it('Component should be rendered properly', async () => {
    const { getAllByText } = renderComponent();

    await waitFor(() => {
      const titleElements = getAllByText('Test Post');
      expect(titleElements.length).toBeGreaterThan(0);
    });
  });

  it('Component should be rendered properly if prop image is not undefined', async () => {
    const { getAllByText, getByRole } = renderComponent({
      image: 'promotedPostImage',
    });

    await waitFor(() => {
      const titleElements = getAllByText('Test Post');
      expect(titleElements.length).toBeGreaterThan(0);
    });
    expect(getByRole('img')).toHaveAttribute('src', 'promotedPostImage');
  });

  it('Component should display the icon correctly', async () => {
    const { queryByTestId } = renderComponent();

    await waitFor(() => {
      const icon = queryByTestId('star-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  it('Component should display the text correctly', async () => {
    const { queryAllByText } = renderComponent();

    await waitFor(() => {
      const title = queryAllByText('Test Post');
      expect(title[0]).toBeInTheDocument();
    });
  });

  it('Component should display the image correctly when image prop is provided', async () => {
    const { queryByRole } = renderComponent({ image: 'promotedPostImage' });

    await waitFor(() => {
      const image = queryByRole('img');
      expect(image).toHaveAttribute('src', 'promotedPostImage');
    });
  });

  it('Component should not display image when image prop is empty', async () => {
    const { queryByRole } = renderComponent({ image: '' });

    await waitFor(() => {
      const image = queryByRole('img');
      expect(image).not.toBeInTheDocument();
    });
  });

  it('Component should not display image when image prop is null', async () => {
    const { queryByRole } = renderComponent({ image: null });

    await waitFor(() => {
      const image = queryByRole('img');
      expect(image).not.toBeInTheDocument();
    });
  });

  it('Component should not display image when image prop is undefined', async () => {
    const { queryByRole } = renderComponent({ image: undefined });

    await waitFor(() => {
      const image = queryByRole('img');
      expect(image).not.toBeInTheDocument();
    });
  });
});
