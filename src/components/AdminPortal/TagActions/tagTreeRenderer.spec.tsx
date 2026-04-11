import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { getRootFolderIds, renderFolderTree } from './tagTreeRenderer';
import type {
  InterfaceTagFolderItem,
  InterfaceTagSelectionItem,
} from 'types/AdminPortal/TagActions/interface';

const styles: Record<string, string> = {
  indent0: 'indent0',
  indent1: 'indent1',
  listItem: 'listItem',
  folderRow: 'folderRow',
  folderToggleButton: 'folderToggleButton',
  listItemLabel: 'listItemLabel',
  tagRow: 'tagRow',
  listCheckbox: 'listCheckbox',
  tagIcon: 'tagIcon',
  tagName: 'tagName',
  folderLoadingRow: 'folderLoadingRow',
  folderEmptyRow: 'folderEmptyRow',
};

const makeFolder = (
  id: string,
  name: string,
  childFolderIds: string[] = [],
  tags: InterfaceTagSelectionItem[] = [],
): InterfaceTagFolderItem => ({
  id,
  name,
  parentFolderId: null,
  childFolderIds,
  tags,
  loaded: true,
  loading: false,
});

const createParams = (
  folderStateMap: Map<string, InterfaceTagFolderItem>,
  searchTerm: string,
) => ({
  folderStateMap,
  expandedFolderIds: new Set<string>(),
  checkedTags: new Set<string>(),
  searchTerm,
  styles,
  onToggleFolderExpansion: vi.fn(),
  onToggleTagSelection: vi.fn(),
  noTagsFoundText: 'No tags found',
});

describe('tagTreeRenderer visibility', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('hides folder when child folder id points to a missing folder', () => {
    const parent = makeFolder('parent-1', 'Operations', ['missing-child']);
    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [parent.id, parent],
    ]);

    const items = renderFolderTree(
      parent.id,
      0,
      createParams(folderStateMap, 'finance'),
    );

    render(<ul>{items}</ul>);

    expect(screen.queryByText('Operations')).not.toBeInTheDocument();
  });

  test('shows folder when folder name matches search term', () => {
    const folder = makeFolder('folder-1', 'Finance Team');
    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [folder.id, folder],
    ]);

    const items = renderFolderTree(
      folder.id,
      0,
      createParams(folderStateMap, 'fin'),
    );

    render(<ul>{items}</ul>);

    expect(screen.getByText('Finance Team')).toBeInTheDocument();
  });

  test('shows folder when one of its tags matches search term', () => {
    const folder = makeFolder(
      'folder-2',
      'Operations',
      [],
      [{ id: 'tag-1', name: 'Alpha Tag' }],
    );
    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [folder.id, folder],
    ]);

    const items = renderFolderTree(
      folder.id,
      0,
      createParams(folderStateMap, 'alpha'),
    );

    render(<ul>{items}</ul>);

    expect(screen.getByText('Operations')).toBeInTheDocument();
  });

  test('shows parent folder when a child folder matches search term', () => {
    const parent = makeFolder('parent-2', 'Root Folder', ['child-1']);
    const child = {
      ...makeFolder('child-1', 'Engineering'),
      parentFolderId: 'parent-2',
    };

    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [parent.id, parent],
      [child.id, child],
    ]);

    const items = renderFolderTree(
      parent.id,
      0,
      createParams(folderStateMap, 'engine'),
    );

    render(<ul>{items}</ul>);

    expect(screen.getByText('Root Folder')).toBeInTheDocument();
  });

  test('renders tag row with indent and checked state, then toggles selection', async () => {
    const user = userEvent.setup();
    const tag = { id: 'tag-42', name: 'Platform Tag' };
    const folder = makeFolder('folder-42', 'Platform', [], [tag]);
    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [folder.id, folder],
    ]);
    const onToggleTagSelection = vi.fn();

    const items = renderFolderTree(folder.id, 0, {
      folderStateMap,
      expandedFolderIds: new Set<string>(['folder-42']),
      checkedTags: new Set<string>(['tag-42']),
      searchTerm: '',
      styles,
      onToggleFolderExpansion: vi.fn(),
      onToggleTagSelection,
      noTagsFoundText: 'No tags found',
    });

    render(<ul>{items}</ul>);

    const tagCheckbox = screen.getByTestId('checkTagtag-42');
    expect(tagCheckbox).toBeInTheDocument();
    expect(tagCheckbox).toBeChecked();
    expect(tagCheckbox.closest('label')).toHaveClass('indent1');

    await user.click(tagCheckbox);
    expect(onToggleTagSelection).toHaveBeenCalledWith(tag, false);
  });

  test('returns only root folder ids sorted by folder name', () => {
    const alphaRoot = makeFolder('root-a', 'Alpha');
    const zetaRoot = makeFolder('root-z', 'Zeta');
    const childFolder = {
      ...makeFolder('child-1', 'Child Folder'),
      parentFolderId: 'root-a',
    };

    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [zetaRoot.id, zetaRoot],
      [childFolder.id, childFolder],
      [alphaRoot.id, alphaRoot],
    ]);

    expect(getRootFolderIds(folderStateMap)).toEqual(['root-a', 'root-z']);
  });

  test('calls onToggleFolderExpansion with folder id on expand button click', async () => {
    const user = userEvent.setup();
    const folder = makeFolder('folder-expand-1', 'Expandable Folder');
    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [folder.id, folder],
    ]);
    const onToggleFolderExpansion = vi.fn();

    const items = renderFolderTree(folder.id, 0, {
      folderStateMap,
      expandedFolderIds: new Set<string>(),
      checkedTags: new Set<string>(),
      searchTerm: '',
      styles,
      onToggleFolderExpansion,
      onToggleTagSelection: vi.fn(),
      noTagsFoundText: 'No tags found',
    });

    render(<ul>{items}</ul>);

    await user.click(screen.getByTestId('expandFolderfolder-expand-1'));

    expect(onToggleFolderExpansion).toHaveBeenCalledWith('folder-expand-1');
  });

  test('renders child folder rows when parent folder is expanded', () => {
    const parent = makeFolder('parent-rec', 'Parent Folder', ['child-rec']);
    const child = {
      ...makeFolder('child-rec', 'Child Folder'),
      parentFolderId: 'parent-rec',
    };

    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [parent.id, parent],
      [child.id, child],
    ]);

    const items = renderFolderTree(parent.id, 0, {
      folderStateMap,
      expandedFolderIds: new Set<string>(['parent-rec']),
      checkedTags: new Set<string>(),
      searchTerm: '',
      styles,
      onToggleFolderExpansion: vi.fn(),
      onToggleTagSelection: vi.fn(),
      noTagsFoundText: 'No tags found',
    });

    render(<ul>{items}</ul>);

    expect(screen.getByText('Parent Folder')).toBeInTheDocument();
    expect(screen.getByText('Child Folder')).toBeInTheDocument();
  });

  test('renders loading row when expanded folder is in loading state', () => {
    const loadingFolder: InterfaceTagFolderItem = {
      ...makeFolder('folder-loading-1', 'Loading Folder'),
      loading: true,
      loaded: false,
    };

    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [loadingFolder.id, loadingFolder],
    ]);

    const items = renderFolderTree(loadingFolder.id, 0, {
      folderStateMap,
      expandedFolderIds: new Set<string>(['folder-loading-1']),
      checkedTags: new Set<string>(),
      searchTerm: '',
      styles,
      onToggleFolderExpansion: vi.fn(),
      onToggleTagSelection: vi.fn(),
      noTagsFoundText: 'No tags found',
    });

    const { container } = render(<ul>{items}</ul>);

    expect(container.querySelector('.folderLoadingRow')).toBeInTheDocument();
  });

  test('renders empty row when expanded folder is loaded with no children and no tags', () => {
    const emptyFolder: InterfaceTagFolderItem = {
      ...makeFolder('folder-empty-1', 'Empty Folder'),
      loaded: true,
      loading: false,
      childFolderIds: [],
      tags: [],
    };

    const folderStateMap = new Map<string, InterfaceTagFolderItem>([
      [emptyFolder.id, emptyFolder],
    ]);

    const items = renderFolderTree(emptyFolder.id, 0, {
      folderStateMap,
      expandedFolderIds: new Set<string>(['folder-empty-1']),
      checkedTags: new Set<string>(),
      searchTerm: '',
      styles,
      onToggleFolderExpansion: vi.fn(),
      onToggleTagSelection: vi.fn(),
      noTagsFoundText: 'No tags found',
    });

    const { container } = render(<ul>{items}</ul>);

    expect(container.querySelector('.folderEmptyRow')).toBeInTheDocument();
    expect(screen.getByText('No tags found')).toBeInTheDocument();
  });
});
