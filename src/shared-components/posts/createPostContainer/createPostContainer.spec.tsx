import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from '../../../utils/i18nForTest';

import CreatePostContainer from './createPostContainer';

describe('Create Post Container display and Basic functionality', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOnClick = vi.fn();

  it('renders the create post container with all essential elements', async () => {
    render(
      <I18nextProvider i18n={i18nForTest}>
        <MockedProvider>
          <CreatePostContainer onClick={mockOnClick} />
        </MockedProvider>
      </I18nextProvider>,
    );

    expect(screen.getByText('Start a Post')).toBeInTheDocument();
    expect(screen.getByTestId('browseFilesButton')).toBeInTheDocument();
    expect(screen.getByTestId('postInput')).toBeInTheDocument();
    expect(screen.getByTestId('sendPostButton')).toBeInTheDocument();
  });
});
