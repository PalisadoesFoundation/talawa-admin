import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { describe, it, expect, vi } from 'vitest';
import TagNode from './TagNode';
import type { InterfaceTagData } from '../../utils/interfaces';
import type { TFunction } from 'i18next';
import { MOCKS, MOCKS_ERROR_SUBTAGS_QUERY } from './TagActionsMocks';
import { MOCKS_ERROR_SUBTAGS_QUERY1, MOCKS1 } from './TagNodeMocks';

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
describe('TagNode with Mocks', () => {
  it('renders parent tag name', () => {
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

  it('fetches and displays child tags from MOCKS', async () => {
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

  it('handles pagination correctly with second MOCKS item', async () => {
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

    // Verify first set of subtags
    await waitFor(() => {
      expect(screen.getByText('subTag 1')).toBeInTheDocument();
      expect(screen.getByText('subTag 2')).toBeInTheDocument();
    });

    // Trigger load more
    const scrollableDiv = screen.getByTestId(
      `subTagsScrollableDiv${mockTag._id}`,
    );
    fireEvent.scroll(scrollableDiv, { target: { scrollY: 100 } });

    // Verify paginated subtags
    await waitFor(() => {
      expect(screen.getByText('subTag 11')).toBeInTheDocument();
    });
  });

  it('displays error message with MOCKS_ERROR_SUBTAGS_QUERY', async () => {
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

    // Verify error message
    await waitFor(() => {
      expect(
        screen.getByText('errorOccurredWhileLoadingSubTags'),
      ).toBeInTheDocument();
    });
  });
});

describe('MOCKS Structure Validation', () => {
  it('validates the structure of MOCKS[0]', () => {
    const firstMock = MOCKS1[0];

    expect(firstMock.request.query).toBeDefined();
    expect(firstMock.request.variables).toEqual({ id: '1', first: 10 });
    expect(firstMock.result.data?.getChildTags?.childTags?.edges?.length).toBe(
      2,
    );
  });

  it('validates the structure of MOCKS[1] (pagination)', () => {
    const secondMock = MOCKS1[1];

    expect(secondMock.request.query).toBeDefined();
    expect(secondMock.request.variables).toEqual({
      id: '1',
      first: 10,
      after: 'subTag2',
    });
    expect(secondMock.result.data?.getChildTags?.childTags?.edges?.length).toBe(
      1,
    );
  });

  it('validates MOCKS_ERROR_SUBTAGS_QUERY structure', () => {
    const errorMock = MOCKS_ERROR_SUBTAGS_QUERY1[0];

    expect(errorMock.request.query).toBeDefined();
    expect(errorMock.request.variables).toEqual({ id: '1', first: 10 });
    expect(errorMock.error).toBeInstanceOf(Error);
    expect(errorMock.error?.message).toBe(
      'Mock GraphQL Error for fetching subtags',
    );
  });
});
