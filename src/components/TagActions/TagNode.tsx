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

  const loadMoreSubTags = (): void => {
    if (subTagsData?.getUserTag.childTags.pageInfo.hasNextPage) {
      fetchMoreSubTags({
        variables: {
          first: TAGS_QUERY_LIMIT,
          after: subTagsData.getUserTag.childTags.pageInfo.endCursor,
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
    }
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
          {subTagsList.map((tag: InterfaceTagData) => (
            <TagNode
              key={tag._id}
              tag={tag}
              checkedTags={checkedTags}
              toggleTagSelection={toggleTagSelection}
              t={t}
            />
          ))}
          {subTagsData?.getUserTag.childTags.pageInfo.hasNextPage && (
            <div
              style={{ cursor: 'pointer' }}
              className="ms-4 mt-0 mb-3"
              onClick={loadMoreSubTags}
            >
              <span
                className="fw-lighter fst-italic"
                data-testid={`fetchMoreSubTagsOf${tag._id}`}
              >
                ...{t('fetchMore')}
              </span>
              <i className={'mx-2 fa fa-angle-double-down'} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagNode;
