import { useQuery } from '@apollo/client';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import React, { useState } from 'react';
import type {
  InterfaceQueryUserTagChildTags,
  InterfaceTagData,
} from 'utils/interfaces';
import type { InterfaceOrganizationSubTagsQuery } from 'utils/organizationTagsUtils';
import { TAGS_QUERY_PAGE_SIZE } from 'utils/organizationTagsUtils';
import styles from './TagActions.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';

interface InterfaceTagNodeProps {
  tag: InterfaceTagData;
  checkedTags: Set<string>;
  toggleTagSelection: (tag: InterfaceTagData, isSelected: boolean) => void;
  t: (key: string) => string;
}

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
    fetchMore: fetchMoreSubTags,
  }: InterfaceOrganizationSubTagsQuery = useQuery(USER_TAG_SUB_TAGS, {
    variables: {
      id: tag._id,
      first: TAGS_QUERY_PAGE_SIZE,
    },
    skip: !expanded,
  });

  const loadMoreSubTags = (): void => {
    fetchMoreSubTags({
      variables: {
        first: TAGS_QUERY_PAGE_SIZE,
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

  const subTagsList = subTagsData?.getUserTag.childTags.edges.map(
    (edge) => edge.node,
  );

  const handleTagClick = (): void => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setExpanded(false); // collapse on second click
    }
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
              className="me-3"
              style={{ cursor: 'pointer' }}
              data-testid={`expandSubTags${tag._id}`}
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
      {expanded && subTagsList && (
        <div style={{ marginLeft: '20px' }}>
          <div
            id={`subTagsScrollableDiv${tag._id}`}
            data-testid={`subTagsScrollableDiv${tag._id}`}
            style={{
              maxHeight: 300,
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
              loader={<InfiniteScrollLoader />}
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
