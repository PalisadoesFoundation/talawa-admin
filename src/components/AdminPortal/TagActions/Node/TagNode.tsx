/**
 * Component: TagNode
 *
 * This component renders a tag-folder node that can be expanded to display child folders.
 * It supports infinite scrolling for loading child folders and allows users to select tags
 * using checkboxes. The component is recursive, enabling nested folder nodes to be displayed.
 *
 * @param props - The props for the TagNode component.
 * @param tag - The tag data to be displayed.
 * @param checkedTags - A set of tag IDs that are currently selected.
 * @param toggleTagSelection - Callback function to toggle the selection state of a tag.
 *
 * @remarks
 * - The component uses the `@apollo/client` `useQuery` hook to fetch child folders.
 * - Infinite scrolling is implemented using the `react-infinite-scroll-component` library.
 * - Displays a loader while fetching child folders and handles errors gracefully.
 *
 * @example
 * ```tsx
 * <TagNode
 *   tag={tagData}
 *   checkedTags={selectedTags}
 *   toggleTagSelection={handleToggleTag}
 * />
 * ```
 *
 * @returns A React functional component that renders a tag node with optional child folders.
 */
// translation-check-keyPrefix: manageTag
import { useQuery } from '@apollo/client';
import { TAG_FOLDER_CHILD_FOLDERS_FOR_NODE } from 'GraphQl/Queries/userTagQueries';
import React, { useState } from 'react';
import type {
  InterfaceQueryTagFolderChildFolders,
  InterfaceTagData,
} from 'utils/interfaces';
import type { InterfaceTagFolderChildFoldersQuery } from 'utils/organizationTagsUtils';
import type { InterfaceTagNodeProps } from 'types/AdminPortal/TagActions/interface';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import styles from './TagNode.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'shared-components/InfiniteScrollLoader/InfiniteScrollLoader';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import { useTranslation } from 'react-i18next';

/**
 * Renders tags that can be expanded to list child folders.
 */
const TagNode: React.FC<InterfaceTagNodeProps> = ({
  tag,
  checkedTags,
  toggleTagSelection,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
  const [expanded, setExpanded] = useState(false);

  const {
    data: childFoldersData,
    loading: childFoldersLoading,
    error: childFoldersError,
    fetchMore: fetchMoreChildFolders,
  }: InterfaceTagFolderChildFoldersQuery = useQuery(
    TAG_FOLDER_CHILD_FOLDERS_FOR_NODE,
    {
      variables: { id: tag._id, first: TAGS_QUERY_DATA_CHUNK_SIZE },
      skip: !expanded,
    },
  );

  const loadMoreChildFolders = (): void => {
    fetchMoreChildFolders({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: childFoldersData?.tagFolder.childFolders.pageInfo.endCursor,
      },
      updateQuery: (
        prevResult: { tagFolder: InterfaceQueryTagFolderChildFolders },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult?: { tagFolder: InterfaceQueryTagFolderChildFolders };
        },
      ) => {
        if (!fetchMoreResult) return prevResult;

        return {
          tagFolder: {
            ...fetchMoreResult.tagFolder,
            childFolders: {
              ...fetchMoreResult.tagFolder.childFolders,
              edges: [
                ...prevResult.tagFolder.childFolders.edges,
                ...fetchMoreResult.tagFolder.childFolders.edges,
              ],
            },
          },
        };
      },
    });
  };

  if (childFoldersError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className={styles.loadingError}>
            {t('errorOccurredWhileLoadingChildFolders')}
          </h6>
        </div>
      </div>
    );
  }

  const childFolderNodes =
    childFoldersData?.tagFolder.childFolders.edges.map((edge) => edge.node) ??
    [];

  const handleTagClick = (): void => {
    setExpanded(!expanded);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    toggleTagSelection(tag, e.target.checked);
  };

  return (
    <div className={styles.childTags}>
      <div>
        {tag.childTags.totalCount ? (
          <>
            <span
              onClick={handleTagClick}
              className={styles.expandChildFolders}
              data-testid={`expandChildFolders${tag._id}`}
              aria-label={expanded ? t('collapse') : t('expand')}
            >
              {expanded ? '▼' : '▶'}
            </span>
            <input
              type="checkbox"
              checked={checkedTags.has(tag._id)}
              className={styles.checkTags}
              onChange={handleCheckboxChange}
              data-testid={`checkTag${tag._id}`}
              id={`checkbox-${tag._id}`}
              aria-label={t('selectTag')}
            />
            Folder{' '}
          </>
        ) : (
          <>
            <span className={styles.dotSeparator}>●</span>
            <input
              type="checkbox"
              checked={checkedTags.has(tag._id)}
              className={styles.checkTagsExtend}
              onChange={handleCheckboxChange}
              data-testid={`checkTag${tag._id}`}
              aria-label={tag.name}
            />
            Tag{' '}
          </>
        )}

        {tag.name}
      </div>

      {expanded && childFoldersLoading && (
        <div className={styles.simpleLoaderContainer}>
          <div className={styles.simpleLoader}>
            <div className={styles.spinner} />
          </div>
        </div>
      )}
      {expanded && childFolderNodes?.length && (
        <div className={styles.childFoldersScrollableContainer}>
          <div
            // i18n-ignore-next-line
            id={`childFoldersScrollableDiv${tag._id}`}
            // i18n-ignore-next-line
            data-testid={`childFoldersScrollableDiv${tag._id}`}
            className={styles.childFoldersScrollableDiv}
          >
            <InfiniteScroll
              dataLength={childFolderNodes?.length ?? 0}
              next={loadMoreChildFolders}
              hasMore={
                childFoldersData?.tagFolder.childFolders.pageInfo.hasNextPage ??
                false
              }
              loader={<InfiniteScrollLoader />}
              // i18n-ignore-next-line
              scrollableTarget={`childFoldersScrollableDiv${tag._id}`}
            >
              {childFolderNodes.map((tag: InterfaceTagData) => (
                <div key={tag._id} data-testid="orgUserChildFolders">
                  <TagNode
                    tag={tag}
                    checkedTags={checkedTags}
                    toggleTagSelection={toggleTagSelection}
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagNode;
