import type { ApolloClient } from '@apollo/client';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { TAG_FOLDER_TREE_NODE } from 'GraphQl/Queries/userTagQueries';
import type {
  InterfaceTagFolderItem,
  InterfaceTagFolderNodeQuery,
  InterfaceTagSelectionItem,
} from 'types/AdminPortal/TagActions/interface';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

interface InterfaceLoadFolderNodeParams {
  folderId: string;
  loadingFolderIdsRef: MutableRefObject<Set<string>>;
  setFolderStateMap: Dispatch<
    SetStateAction<Map<string, InterfaceTagFolderItem>>
  >;
  tagsByFolderMap: Map<string, InterfaceTagSelectionItem[]>;
  client: ApolloClient<object>;
  tCommon: (key: string) => string;
}

export const loadFolderNode = async ({
  folderId,
  loadingFolderIdsRef,
  setFolderStateMap,
  tagsByFolderMap,
  client,
  tCommon,
}: InterfaceLoadFolderNodeParams): Promise<void> => {
  if (loadingFolderIdsRef.current.has(folderId)) {
    return;
  }

  loadingFolderIdsRef.current.add(folderId);

  setFolderStateMap((prev) => {
    const next = new Map(prev);
    const existing = next.get(folderId);

    if (existing) {
      next.set(folderId, { ...existing, loading: true });
    }

    return next;
  });

  const childFoldersById = new Map<
    string,
    { id: string; name: string; parentFolderId: string | null }
  >();
  let childFoldersAfter: string | null | undefined = null;
  let hasNextChildFolders = true;
  const tagsForFolder = tagsByFolderMap.get(folderId) ?? [];

  try {
    while (hasNextChildFolders) {
      const result: { data: InterfaceTagFolderNodeQuery } = (await client.query(
        {
          query: TAG_FOLDER_TREE_NODE,
          variables: {
            input: { id: folderId },
            childFoldersAfter: hasNextChildFolders ? childFoldersAfter : null,
            childFoldersFirst: 32,
          },
          fetchPolicy: 'network-only',
        },
      )) as { data: InterfaceTagFolderNodeQuery };

      const currentFolder: InterfaceTagFolderNodeQuery['tagFolder'] =
        result.data.tagFolder;
      if (!currentFolder) break;

      (currentFolder.childFolders?.edges ?? []).forEach(
        (edge: {
          node: {
            id: string;
            name: string;
            parentFolder?: { id: string } | null;
          };
        }) => {
          const { node } = edge;
          childFoldersById.set(node.id, {
            id: node.id,
            name: node.name,
            parentFolderId: node.parentFolder?.id ?? null,
          });
        },
      );

      const childFoldersPageInfo:
        | {
            endCursor?: string | null;
            hasNextPage?: boolean;
          }
        | null
        | undefined = currentFolder.childFolders?.pageInfo;

      hasNextChildFolders = Boolean(childFoldersPageInfo?.hasNextPage);
      childFoldersAfter = childFoldersPageInfo?.endCursor;
    }

    setFolderStateMap((prev) => {
      const next = new Map(prev);
      const existing = next.get(folderId);

      if (!existing) {
        return prev;
      }

      const childFolderIds = Array.from(childFoldersById.keys());

      next.set(folderId, {
        ...existing,
        childFolderIds,
        tags: tagsForFolder,
        loaded: true,
        loading: false,
      });

      childFoldersById.forEach((child) => {
        const previous = next.get(child.id);
        next.set(child.id, {
          id: child.id,
          name: child.name,
          parentFolderId: child.parentFolderId,
          childFolderIds: previous?.childFolderIds ?? [],
          tags: previous?.tags ?? tagsByFolderMap.get(child.id) ?? [],
          loaded: previous?.loaded ?? false,
          loading: previous?.loading ?? false,
        });
      });

      return next;
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : tCommon('error');
    NotificationToast.error(errorMessage);

    setFolderStateMap((prev) => {
      const next = new Map(prev);
      const existing = next.get(folderId);

      if (existing) {
        next.set(folderId, { ...existing, loading: false });
      }

      return next;
    });
  } finally {
    loadingFolderIdsRef.current.delete(folderId);
  }
};
