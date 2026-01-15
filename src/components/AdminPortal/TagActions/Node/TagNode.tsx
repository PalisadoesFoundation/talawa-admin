/**
 * Component: TagNode
 *
 * This component renders a tag node that can be expanded to display its subtags.
 * It supports infinite scrolling for loading subtags and allows users to select tags
 * using checkboxes. The component is recursive, enabling nested subtags to be displayed.
 *
 * @param props - The props for the TagNode component.
 * @param tag - The tag data to be displayed.
 * @param checkedTags - A set of tag IDs that are currently selected.
 * @param toggleTagSelection - Callback function to toggle the selection state of a tag.
 * @param t - Translation function for i18n.
 *
 * @remarks
 * - The component uses the `@apollo/client` `useQuery` hook to fetch subtags.
 * - Infinite scrolling is implemented using the `react-infinite-scroll-component` library.
 * - Displays a loader while fetching subtags and handles errors gracefully.
 *
 * @example
 * ```tsx
 * <TagNode
 *   tag={tagData}
 *   checkedTags={selectedTags}
 *   toggleTagSelection={handleToggleTag}
 *   t={t}
 * />
 * ```
 *
 * @returns A React functional component that renders a tag node with optional subtags.
 */
// translation-check-keyPrefix: manageTag
import { useQuery } from '@apollo/client';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import React, { useState } from 'react';
import type {
  InterfaceQueryUserTagChildTags,
  InterfaceTagData,
} from 'utils/interfaces';
import type { InterfaceOrganizationSubTagsQuery } from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import styles from 'style/app-fixed.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'shared-components/InfiniteScrollLoader/InfiniteScrollLoader';
import { WarningAmberRounded } from '@mui/icons-material';
import type { TFunction } from 'i18next';
import componentStyle from '../TagAction.module.css';
interface InterfaceTagNodeProps {
  tag: InterfaceTagData;
  checkedTags: Set<string>;
  toggleTagSelection: (tag: InterfaceTagData, isSelected: boolean) => void;
  t: TFunction<'translation', 'manageTag'>;
}

/**
 * Renders the Tags which can be expanded to list subtags.
 */
const TagNode: React.FC<InterfaceTagNodeProps> = ({
  tag,
  checkedTags,
  toggleTagSelection,
  t,
}) => {
  const [expanded, setExpanded] = useState(false);

  const {
    data: subTagsData,
    loading: subTagsLoading,
    error: subTagsError,
    fetchMore: fetchMoreSubTags,
  }: InterfaceOrganizationSubTagsQuery = useQuery(USER_TAG_SUB_TAGS, {
    variables: { id: tag._id, first: TAGS_QUERY_DATA_CHUNK_SIZE },
    skip: !expanded,
  });

  const loadMoreSubTags = (): void => {
    fetchMoreSubTags({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: subTagsData?.getChildTags.childTags.pageInfo.endCursor,
      },
      updateQuery: (
        prevResult: { getChildTags: InterfaceQueryUserTagChildTags },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult?: { getChildTags: InterfaceQueryUserTagChildTags };
        },
      ) => {
        if (!fetchMoreResult) return prevResult;

        return {
          getChildTags: {
            ...fetchMoreResult.getChildTags,
            childTags: {
              ...fetchMoreResult.getChildTags.childTags,
              edges: [
                ...prevResult.getChildTags.childTags.edges,
                ...fetchMoreResult.getChildTags.childTags.edges,
              ],
            },
          },
        };
      },
    });
  };

  if (subTagsError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={`${styles.errorIcon} fs-6`} />
          <h6 className="fw-bold text-danger text-center">
            {t('errorOccurredWhileLoadingSubTags')}
          </h6>
        </div>
      </div>
    );
  }

  const subTagsList =
    subTagsData?.getChildTags.childTags.edges.map((edge) => edge.node) ?? [];

  const handleTagClick = (): void => {
    setExpanded(!expanded);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    toggleTagSelection(tag, e.target.checked);
  };

  return (
    <div className="my-2">
      <div>
        {tag.childTags.totalCount ? (
          <>
            <span
              onClick={handleTagClick}
              className={`me-3 ${componentStyle.cursorPointer}`}
              data-testid={`expandSubTags${tag._id}`}
              aria-label={expanded ? t('collapse') : t('expand')}
            >
              {expanded ? '▼' : '▶'}
            </span>
            <input
              type="checkbox"
              checked={checkedTags.has(tag._id)}
              className={`me-2 ${componentStyle.cursorPointer}`}
              onChange={handleCheckboxChange}
              data-testid={`checkTag${tag._id}`}
              id={`checkbox-${tag._id}`}
              aria-label={t('selectTag')}
            />
            <i className="fa fa-folder mx-2" />{' '}
          </>
        ) : (
          <>
            <span className="me-3">●</span>
            <input
              type="checkbox"
              checked={checkedTags.has(tag._id)}
              className={`ms-1 me-2 ${componentStyle.cursorPointer}`}
              onChange={handleCheckboxChange}
              data-testid={`checkTag${tag._id}`}
              aria-label={tag.name}
            />
            <i className="fa fa-tag mx-2" />{' '}
          </>
        )}

        {tag.name}
      </div>

      {expanded && subTagsLoading && (
        <div className="ms-5">
          <div className={styles.simpleLoader}>
            <div className={styles.spinner} />
          </div>
        </div>
      )}
      {expanded && subTagsList?.length && (
        <div className="me-4">
          <div
            // i18n-ignore-next-line
            id={`subTagsScrollableDiv${tag._id}`}
            // i18n-ignore-next-line
            data-testid={`subTagsScrollableDiv${tag._id}`}
            className={componentStyle.subtagsScrollableDiv}
          >
            <InfiniteScroll
              dataLength={subTagsList?.length ?? 0}
              next={loadMoreSubTags}
              hasMore={
                subTagsData?.getChildTags.childTags.pageInfo.hasNextPage ??
                false
              }
              loader={<InfiniteScrollLoader />}
              // i18n-ignore-next-line
              scrollableTarget={`subTagsScrollableDiv${tag._id}`}
            >
              {subTagsList.map((tag: InterfaceTagData) => (
                <div key={tag._id} data-testid="orgUserSubTags">
                  <TagNode
                    tag={tag}
                    checkedTags={checkedTags}
                    toggleTagSelection={toggleTagSelection}
                    t={t}
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
