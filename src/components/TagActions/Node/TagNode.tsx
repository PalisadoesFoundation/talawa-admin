/**
 * Component: TagNode
 *
 * This component renders a tag node that can be expanded to display its subtags.
 * It supports infinite scrolling for loading subtags and allows users to select tags
 * using checkboxes. The component is recursive, enabling nested subtags to be displayed.
 *
 * @component
 * @param {InterfaceTagNodeProps} props - The props for the TagNode component.
 * @param {InterfaceTagData} props.tag - The tag data to be displayed.
 * @param {Set<string>} props.checkedTags - A set of tag IDs that are currently selected.
 * @param {(tag: InterfaceTagData, isSelected: boolean) => void} props.toggleTagSelection -
 *        Callback function to toggle the selection state of a tag.
 * @param {TFunction<'translation', 'manageTag'>} props.t - Translation function for i18n.
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
 * @returns {React.FC} A React functional component that renders a tag node with optional subtags.
 */
import { useQuery } from '@apollo/client';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import React, { useState } from 'react';
import type {
  InterfaceQueryUserTagChildTags,
  InterfaceTagData,
} from 'utils/interfaces';
import type { InterfaceOrganizationSubTagsQuery } from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import styles from '../../../style/app-fixed.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';
import { WarningAmberRounded } from '@mui/icons-material';
import type { TFunction } from 'i18next';

interface InterfaceTagNodeProps {
  tag: InterfaceTagData & { id: string; name: string };
  checkedTags: Set<string>;
  toggleTagSelection: (
    tag: InterfaceTagData & { id: string },
    isSelected: boolean,
  ) => void;
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
    variables: {
      id: tag.id,
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
    },
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
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            {t('errorOccurredWhileLoadingSubTags')}
          </h6>
        </div>
      </div>
    );
  }
  console.log('Querying tag:', tag.id);
  console.log('Subtag data:', subTagsData);
  console.log('Subtags loading:', subTagsLoading);

  const subTagsList =
    subTagsData?.getChildTags.childTags.edges.map((edge) => edge.node) ?? [];

  const handleTagClick = (): void => {
    setExpanded(!expanded);
    console.log('Tag expanded state: ', !expanded);
    console.log('Querying with variables:', {
      id: tag.id,
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
    });
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    toggleTagSelection(tag, e.target.checked);
  };

  return (
    <div className="my-2">
      <div>
        <>
          <span
            onClick={handleTagClick}
            className="me-3"
            style={{ cursor: 'pointer' }}
            data-testid={`expandSubTags${tag.id}`}
            aria-label={expanded ? t('collapse') : t('expand')}
          >
            {expanded ? '▼' : '▶'}
          </span>
          <input
            style={{ cursor: 'pointer' }}
            type="checkbox"
            checked={checkedTags.has(tag.id)}
            className="me-2"
            onChange={handleCheckboxChange}
            data-testid={`checkTag${tag.id}`}
            id={`checkbox-${tag.id}`}
            aria-label={tag.name}
          />
          <i
            className={`fa ${tag.childTags ? 'fa-folder' : 'fa-tag'} mx-2`}
          />{' '}
        </>

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
        <div style={{ marginLeft: '20px' }}>
          <div
            id={`subTagsScrollableDiv${tag.id}`}
            data-testid={`subTagsScrollableDiv${tag.id}`}
            style={{
              maxHeight: 300,
              overflow: 'auto',
            }}
          >
            <InfiniteScroll
              dataLength={subTagsList?.length ?? 0}
              next={loadMoreSubTags}
              hasMore={
                subTagsData?.getChildTags.childTags.pageInfo.hasNextPage ??
                false
              }
              loader={<InfiniteScrollLoader />}
              scrollableTarget={`subTagsScrollableDiv${tag.id}`}
            >
              {subTagsList.map((tag: InterfaceTagData) => (
                <div key={tag.id} data-testid="orgUserSubTags">
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
