import React from 'react';
import Button from 'shared-components/Button/Button';
import InfiniteScrollLoader from 'shared-components/InfiniteScrollLoader/InfiniteScrollLoader';
import type {
  InterfaceTagFolderItem,
  InterfaceTagSelectionItem,
} from 'types/AdminPortal/TagActions/interface';

interface InterfaceTagTreeRendererParams {
  folderStateMap: Map<string, InterfaceTagFolderItem>;
  expandedFolderIds: Set<string>;
  checkedTags: Set<string>;
  searchTerm: string;
  styles: Record<string, string>;
  onToggleFolderExpansion: (folderId: string) => void;
  onToggleTagSelection: (
    tag: InterfaceTagSelectionItem,
    isSelected: boolean,
  ) => void;
  noTagsFoundText: string;
}

const MAX_INDENT_LEVEL = 12;

const getIndentClassName = (
  depth: number,
  styles: Record<string, string>,
): string => {
  const safeDepth = Math.max(0, Math.min(depth, MAX_INDENT_LEVEL));
  return styles[`indent${safeDepth}`] ?? styles.indent0;
};

const doesTagMatchSearch = (
  tag: InterfaceTagSelectionItem,
  searchTerm: string,
): boolean => !searchTerm || tag.name.toLowerCase().includes(searchTerm);

const folderHasVisibleContent = (
  folderId: string,
  params: InterfaceTagTreeRendererParams,
): boolean => {
  const { folderStateMap, searchTerm } = params;

  if (!searchTerm) return true;

  const folder = folderStateMap.get(folderId);
  if (!folder) return false;

  if (folder.name.toLowerCase().includes(searchTerm)) return true;
  if (folder.tags.some((tag) => doesTagMatchSearch(tag, searchTerm))) {
    return true;
  }

  return folder.childFolderIds.some((childFolderId) =>
    folderHasVisibleContent(childFolderId, params),
  );
};

const renderTagRow = (
  tag: InterfaceTagSelectionItem,
  depth: number,
  params: InterfaceTagTreeRendererParams,
): JSX.Element => {
  const { styles, checkedTags, onToggleTagSelection } = params;
  const indentClassName = getIndentClassName(depth, styles);

  return (
    <li key={tag.id} className={styles.listItem}>
      <label
        className={`${styles.listItemLabel} ${styles.tagRow} ${indentClassName}`}
        data-testid="orgUserTag"
      >
        <input
          type="checkbox"
          className={styles.listCheckbox}
          checked={checkedTags.has(tag.id)}
          onChange={(e) => onToggleTagSelection(tag, e.target.checked)}
          data-testid={`checkTag${tag.id}`}
          aria-label={tag.name}
        />
        <i className={`fa fa-tag me-2 ${styles.tagIcon}`} aria-hidden="true" />
        <span className={styles.tagName}>{tag.name}</span>
      </label>
    </li>
  );
};

export const getRootFolderIds = (
  folderStateMap: Map<string, InterfaceTagFolderItem>,
): string[] =>
  Array.from(folderStateMap.values())
    .filter((folder) => folder.parentFolderId === null)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((folder) => folder.id);

export const renderFolderTree = (
  folderId: string,
  depth: number,
  params: InterfaceTagTreeRendererParams,
): JSX.Element[] => {
  const { folderStateMap, expandedFolderIds, searchTerm, styles } = params;
  const folder = folderStateMap.get(folderId);

  if (!folder || !folderHasVisibleContent(folder.id, params)) {
    return [];
  }

  const isExpanded = expandedFolderIds.has(folder.id);
  const visibleTags = folder.tags.filter((tag) =>
    doesTagMatchSearch(tag, searchTerm),
  );
  const hasKnownChildren =
    folder.childFolderIds.length > 0 || visibleTags.length > 0;
  const rowIndentClassName = getIndentClassName(depth, styles);
  const childIndentClassName = getIndentClassName(depth + 1, styles);

  const row: JSX.Element = (
    <li key={`folder-${folder.id}`} className={styles.listItem}>
      <div className={`${styles.folderRow} ${rowIndentClassName}`}>
        <Button
          type="button"
          variant="outline"
          className={styles.folderToggleButton}
          onClick={() => params.onToggleFolderExpansion(folder.id)}
          data-testid={`expandFolder${folder.id}`}
          aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
        >
          <i
            className={`fa ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'}`}
            aria-hidden="true"
          />
        </Button>
        <i className="fa fa-folder me-2" aria-hidden="true" />
        <span>{folder.name}</span>
      </div>
    </li>
  );

  if (!isExpanded) {
    return [row];
  }

  const childFolderRows = folder.childFolderIds.flatMap((childFolderId) =>
    renderFolderTree(childFolderId, depth + 1, params),
  );

  const tagRows = visibleTags.map((tag) =>
    renderTagRow(tag, depth + 1, params),
  );

  const loadingRow = folder.loading ? (
    <li key={`folder-loading-${folder.id}`} className={styles.listItem}>
      <div className={`${styles.folderLoadingRow} ${childIndentClassName}`}>
        <InfiniteScrollLoader />
      </div>
    </li>
  ) : null;

  const emptyRow =
    !folder.loading && folder.loaded && !hasKnownChildren ? (
      <li key={`folder-empty-${folder.id}`} className={styles.listItem}>
        <div className={`${styles.folderEmptyRow} ${childIndentClassName}`}>
          {params.noTagsFoundText}
        </div>
      </li>
    ) : null;

  return [
    row,
    ...(loadingRow ? [loadingRow] : []),
    ...(emptyRow ? [emptyRow] : []),
    ...childFolderRows,
    ...tagRows,
  ];
};
