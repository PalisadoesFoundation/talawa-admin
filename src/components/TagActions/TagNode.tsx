import type { ApolloError } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import React, { useState } from 'react';
import type {
  InterfaceQueryUserTagChildTags,
  InterfaceTagData,
} from 'utils/interfaces';
import { TAGS_QUERY_LIMIT } from 'utils/organizationTagsUtils';
import styles from './TagActions.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WarningAmberRounded } from '@mui/icons-material';

/**
 * Props for the `TagNode` component.
 */
interface InterfaceTagNodeProps {
  tag: InterfaceTagData;
  checkedTags: Set<string>;
  toggleTagSelection: (tag: InterfaceTagData, isSelected: boolean) => void;
  t: (key: string) => string;
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
  }: {
    data?: {
      getUserTag: InterfaceQueryUserTagChildTags;
    };
    loading: boolean;
    error?: ApolloError;
    refetch: () => void;
    fetchMore: (options: {
      variables: {
        first: number;
        after?: string;
      };
      updateQuery: (
        previousResult: { getUserTag: InterfaceQueryUserTagChildTags },
        options: {
          fetchMoreResult?: { getUserTag: InterfaceQueryUserTagChildTags };
        },
      ) => { getUserTag: InterfaceQueryUserTagChildTags };
    }) => void;
  } = useQuery(USER_TAG_SUB_TAGS, {
    variables: {
      id: tag._id,
      first: TAGS_QUERY_LIMIT,
    },
    skip: !expanded,
  });

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

  const subTagsList = subTagsData?.getUserTag.childTags.edges.map(
    (edge) => edge.node,
  );

  const handleTagClick = (): void => {
    setExpanded(!expanded);
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    toggleTagSelection(tag, e.target.checked);
  };

  const loadMoreSubTags = (): void => {
    fetchMoreSubTags({
      variables: {
        first: TAGS_QUERY_LIMIT,
        after: subTagsData?.getUserTag.childTags.pageInfo.endCursor,
      },
      updateQuery: (
        prevResult: { getUserTag: InterfaceQueryUserTagChildTags },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult?: { getUserTag: InterfaceQueryUserTagChildTags };
        },
      ) => {
        if (!fetchMoreResult) return prevResult;

        return {
          getUserTag: {
            ...fetchMoreResult.getUserTag,
            childTags: {
              ...fetchMoreResult.getUserTag.childTags,
              edges: [
                ...prevResult.getUserTag.childTags.edges,
                ...fetchMoreResult.getUserTag.childTags.edges,
              ],
            },
          },
        };
      },
    });
  };

  return (
    <div className="my-2">
      <div>
        {tag.childTags.totalCount ? (
          <>
            <span
              onClick={handleTagClick}
              className="me-3"
              style={{ cursor: 'pointer' }}
              data-testid={`expandSubTags${tag._id}`}
              aria-label={expanded ? t('collapse') : t('expand')}
            >
              {expanded ? '▼' : '▶'}
            </span>
            <input
              style={{ cursor: 'pointer' }}
              type="checkbox"
              checked={checkedTags.has(tag._id)}
              className="me-2"
              onChange={handleCheckboxChange}
              data-testid={`checkTag${tag._id}`}
              aria-label={t('selectTag')}
            />
            <i className="fa fa-folder mx-2" />{' '}
          </>
        ) : (
          <>
            <span className="me-3">●</span>
            <input
              style={{ cursor: 'pointer' }}
              type="checkbox"
              checked={checkedTags.has(tag._id)}
              className="ms-1 me-2"
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
        <div style={{ marginLeft: '20px' }}>
          <div
            id={`subTagsScrollableDiv${tag._id}`}
            data-testid={`subTagsScrollableDiv${tag._id}`}
            style={{
              height: 300,
              overflow: 'auto',
            }}
            className={`${styles.scrContainer}`}
          >
            <InfiniteScroll
              dataLength={subTagsList?.length ?? 0}
              next={loadMoreSubTags}
              hasMore={
                subTagsData?.getUserTag.childTags.pageInfo.hasNextPage ?? false
              }
              loader={
                <div className="simpleLoader">
                  <div className="spinner" />
                </div>
              }
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
