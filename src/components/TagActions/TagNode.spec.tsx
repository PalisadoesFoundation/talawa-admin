import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { describe, it, expect, vi } from 'vitest';
import TagNode from './TagNode';
import type { InterfaceTagData } from '../../utils/interfaces';
import type { TFunction } from 'i18next';
import { MOCKS, MOCKS_ERROR_SUBTAGS_QUERY } from './TagActionsMocks';

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
const mockToggleTagSelection = vi.fn();
const mockT: TFunction<'translation', 'manageTag'> = ((key: string) =>
  key) as TFunction<'translation', 'manageTag'>;

describe('TagNode', () => {
  // Existing tests
  it('renders the tag name', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    expect(screen.getByText('Parent Tag')).toBeInTheDocument();
  });

  it('calls toggleTagSelection when the checkbox is clicked', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const checkbox = screen.getByTestId(`checkTag${mockTag._id}`);
    fireEvent.click(checkbox);
    expect(mockToggleTagSelection).toHaveBeenCalledWith(mockTag, true);
  });

  // Existing subtag tests
  it('expands and fetches subtags when expand icon is clicked', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });
  });

  it('displays an error message if fetching subtags fails', async () => {
    render(
      <MockedProvider mocks={MOCKS_ERROR_SUBTAGS_QUERY} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      expect(
        screen.getByText('errorOccurredWhileLoadingSubTags'),
      ).toBeInTheDocument();
    });
  });

  it('loads more subtags on scroll', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
    });

    const scrollableDiv = screen.getByTestId(
      `subTagsScrollableDiv${mockTag._id}`,
    );
    fireEvent.scroll(scrollableDiv, { target: { scrollY: 100 } });

    await waitFor(() => {
      expect(screen.getByText('subTag 11')).toBeInTheDocument();
    });
  });
});

describe('Mock Data Structure', () => {
  it('correctly handles paginated data loading', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    // Expand the tag
    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    // Wait for initial data
    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });

    // Trigger pagination
    const scrollableDiv = screen.getByTestId(
      `subTagsScrollableDiv${mockTag._id}`,
    );
    fireEvent.scroll(scrollableDiv, { target: { scrollY: 100 } });

    // Verify paginated data
    await waitFor(() => {
      expect(screen.getByText('subTag 11')).toBeInTheDocument();
    });
  });

  it('maintains correct state during loading', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <TagNode
          tag={mockTag}
          checkedTags={mockCheckedTags}
          toggleTagSelection={mockToggleTagSelection}
          t={mockT}
        />
      </MockedProvider>,
    );

    const expandIcon = screen.getByTestId(`expandSubTags${mockTag._id}`);
    fireEvent.click(expandIcon);

    // Verify loading state
    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
    });
  });
});
