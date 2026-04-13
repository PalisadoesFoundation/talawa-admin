import { useMemo } from 'react';
import { getRootFolderIds } from './tagTreeRenderer';
import type {
  InterfaceTagFolderItem,
  InterfaceTagSelectionItem,
  InterfaceUseTagActionsNavigationParams,
  InterfaceUseTagActionsNavigationResult,
} from 'types/AdminPortal/TagActions/interface';

/**
 * Recursively checks whether a folder subtree contains any selectable tags.
 *
 * @param folderId - Folder id to evaluate.
 * @param folderStateMap - Indexed folder state tree.
 * @param visited - Cycle guard for defensive traversal.
 * @returns True when this folder or any descendant folder has visible tags.
 */
const hasVisibleDataInFolder = (
  folderId: string,
  folderStateMap: Map<string, InterfaceTagFolderItem>,
  visited: Set<string> = new Set(),
): boolean => {
  if (visited.has(folderId)) {
    return false;
  }

  visited.add(folderId);

  const folder = folderStateMap.get(folderId);
  if (!folder) {
    return false;
  }

  if (folder.tags.length > 0) {
    return true;
  }

  if (!folder.loaded) {
    return false;
  }

  return folder.childFolderIds.some((childFolderId) =>
    hasVisibleDataInFolder(childFolderId, folderStateMap, visited),
  );
};

/**
 * Derives folder navigation state for the TagActions modal.
 *
 * @param params - Current folder context, folder map, search term, and action mode.
 * @returns Root/current folder context, breadcrumbs, and filtered folders/tags to render.
 */
export const useTagActionsNavigation = ({
  currentFolderId,
  folderStateMap,
  searchTerm,
  tagActionType,
}: InterfaceUseTagActionsNavigationParams): InterfaceUseTagActionsNavigationResult => {
  const rootFolderIds = useMemo(
    () => getRootFolderIds(folderStateMap),
    [folderStateMap],
  );

  const currentFolder = currentFolderId
    ? (folderStateMap.get(currentFolderId) ?? null)
    : null;

  const breadcrumbFolderIds = useMemo(() => {
    if (!currentFolderId) {
      return [] as string[];
    }

    const path: string[] = [];
    let cursor: string | null = currentFolderId;

    while (cursor) {
      path.unshift(cursor);
      cursor = folderStateMap.get(cursor)?.parentFolderId ?? null;
    }

    return path;
  }, [currentFolderId, folderStateMap]);

  const visibleFolderIds = useMemo(() => {
    const folderIds =
      currentFolderId === null
        ? rootFolderIds
        : (currentFolder?.childFolderIds ?? []);

    if (!searchTerm) {
      return tagActionType === 'removeFromTags'
        ? folderIds.filter((folderId) =>
            hasVisibleDataInFolder(folderId, folderStateMap),
          )
        : folderIds;
    }

    return folderIds.filter((folderId) => {
      const folder = folderStateMap.get(folderId);
      const matchesSearch = (folder?.name ?? '')
        .toLowerCase()
        .includes(searchTerm);

      if (tagActionType === 'removeFromTags') {
        return (
          matchesSearch && hasVisibleDataInFolder(folderId, folderStateMap)
        );
      }

      return matchesSearch;
    });
  }, [
    currentFolder,
    currentFolderId,
    folderStateMap,
    rootFolderIds,
    searchTerm,
    tagActionType,
  ]);

  const visibleTags = useMemo(() => {
    if (!currentFolder) {
      return [] as InterfaceTagSelectionItem[];
    }

    if (!searchTerm) {
      return currentFolder.tags;
    }

    return currentFolder.tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm),
    );
  }, [currentFolder, searchTerm]);

  return {
    rootFolderIds,
    currentFolder,
    breadcrumbFolderIds,
    visibleFolderIds,
    visibleTags,
  };
};
