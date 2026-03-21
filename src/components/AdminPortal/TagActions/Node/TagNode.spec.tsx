import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { describe, it, expect, vi } from 'vitest';
import TagNode from './TagNode';
import type { InterfaceTagData } from 'utils/interfaces';
import { MOCKS, MOCKS_ERROR_SUBTAGS_QUERY } from '../TagActionsMocks';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from 'utils/i18nForTest';

const mockTag: InterfaceTagData = {
  _id: '1',
  name: 'Parent Tag',
  childTags: { totalCount: 2 },
  parentTag: { _id: '0' },
  usersAssignedTo: { totalCount: 0 },
  ancestorTags: [
    {
      _id: '2',
      name: 'Ancestor Tag 1',
    },
  ],
};

const mockCheckedTags: Set<string> = new Set<string>();
let mockToggleTagSelection: ReturnType<typeof vi.fn>;

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  mockToggleTagSelection = vi.fn();
  user = userEvent.setup();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('TagNode', () => {
  it('renders the tag name', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={[]}>
          <TagNode
            tag={mockTag}
            checkedTags={mockCheckedTags}
            toggleTagSelection={mockToggleTagSelection}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    expect(screen.getByText('Parent Tag')).toBeInTheDocument();
  });

  it('calls toggleTagSelection when the checkbox is clicked', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={MOCKS}>
          <TagNode
            tag={mockTag}
            checkedTags={mockCheckedTags}
            toggleTagSelection={mockToggleTagSelection}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const checkbox = screen.getByTestId(`checkTag${mockTag._id}`);
    await user.click(checkbox);
    expect(mockToggleTagSelection).toHaveBeenCalledWith(mockTag, true);
  });

  it('expands and fetches subtags when expand icon is clicked', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={MOCKS}>
          <TagNode
            tag={mockTag}
            checkedTags={mockCheckedTags}
            toggleTagSelection={mockToggleTagSelection}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });
  });

  it('displays error state if fetching subtags fails', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={MOCKS_ERROR_SUBTAGS_QUERY}>
          <TagNode
            tag={mockTag}
            checkedTags={mockCheckedTags}
            toggleTagSelection={mockToggleTagSelection}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByTestId('cursor-pagination-error')).toBeInTheDocument();
    });
  });

  it('loads more subtags via load more button', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={MOCKS}>
          <TagNode
            tag={mockTag}
            checkedTags={mockCheckedTags}
            toggleTagSelection={mockToggleTagSelection}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
    });

    // CursorPaginationManager renders a load-more button when hasNextPage is true
    const loadMoreButton = screen.getByTestId('load-more-button');
    await user.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByText('subTag 11')).toBeInTheDocument();
    });
  });

  it('handles tag without childTags (leaf tag)', () => {
    const leafTag: InterfaceTagData = {
      _id: 'leaf-tag',
      name: 'Leaf Tag',
      childTags: { totalCount: 0 },
      parentTag: { _id: 'parent' },
      usersAssignedTo: { totalCount: 0 },
      ancestorTags: [],
    };

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={[]}>
          <TagNode
            tag={leafTag}
            checkedTags={mockCheckedTags}
            toggleTagSelection={mockToggleTagSelection}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    expect(screen.getByText('Leaf Tag')).toBeInTheDocument();
    expect(screen.getByText('●')).toBeInTheDocument();
    expect(
      screen.queryByTestId(`expandSubTags${leafTag._id}`),
    ).not.toBeInTheDocument();
  });

  it('shows CursorPaginationManager when expanded with valid data', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={MOCKS}>
          <TagNode
            tag={mockTag}
            checkedTags={mockCheckedTags}
            toggleTagSelection={mockToggleTagSelection}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    await user.click(expandIcon);

    await waitFor(() => {
      expect(
        screen.getByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('cursor-pagination-manager'),
      ).toBeInTheDocument();
    });
  });

  it('collapses subtags when expand icon is clicked again', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={MOCKS}>
          <TagNode
            tag={mockTag}
            checkedTags={mockCheckedTags}
            toggleTagSelection={mockToggleTagSelection}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);

    // Expand
    await user.click(expandIcon);
    await waitFor(() => {
      expect(
        screen.getByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).toBeInTheDocument();
    });

    // Collapse
    await user.click(expandIcon);
    await waitFor(() => {
      expect(
        screen.queryByTestId(`subTagsScrollableDiv${mockTag._id}`),
      ).not.toBeInTheDocument();
    });
  });
});
