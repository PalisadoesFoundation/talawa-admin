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
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import React, { useState } from 'react';
import type { InterfaceTagData } from 'utils/interfaces';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import styles from '../../../style/app-fixed.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';
import type { TFunction } from 'i18next';
import CursorPaginationManager from 'components/CursorPaginationManager/CursorPaginationManager';
import { WarningAmberRounded } from '@mui/icons-material';

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
              id={`checkbox-${tag._id}`}
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

      {expanded && (
        <div style={{ marginLeft: '20px' }}>
          <CursorPaginationManager<unknown, InterfaceTagData>
            query={USER_TAG_SUB_TAGS}
            queryVariables={{ id: tag._id, first: TAGS_QUERY_DATA_CHUNK_SIZE }}
            dataPath="getChildTags.childTags"
            itemsPerPage={TAGS_QUERY_DATA_CHUNK_SIZE}
            useExternalUI={true}
          >
            {({
              items,
              loading,
              pageInfo,
              handleLoadMore,
              handleRefetch,
              error,
            }) => {
              if (error) {
                return (
                  <div
                    className={`${styles.errorContainer} bg-white rounded-4 my-3`}
                  >
                    <div className={styles.errorMessage}>
                      <WarningAmberRounded
                        className={styles.errorIcon}
                        fontSize="large"
                      />
                      <h6 className="fw-bold text-danger text-center">
                        {t('errorOccurredWhileLoadingSubTags')}
                      </h6>
                      <button
                        type="button"
                        onClick={handleRefetch}
                        className="btn btn-primary mt-2"
                      >
                        {t('retry')}
                      </button>
                    </div>
                  </div>
                );
              }

              if (loading && items.length === 0) {
                return (
                  <div className="ms-5">
                    <div className={styles.simpleLoader}>
                      <div className={styles.spinner} />
                    </div>
                  </div>
                );
              }

              if (items.length === 0) {
                return null;
              }

              return (
                <div
                  id={`subTagsScrollableDiv${tag._id}`}
                  data-testid={`subTagsScrollableDiv${tag._id}`}
                  style={{ maxHeight: 300, overflow: 'auto' }}
                >
                  <InfiniteScroll
                    dataLength={items.length}
                    next={handleLoadMore}
                    hasMore={pageInfo?.hasNextPage ?? false}
                    loader={<InfiniteScrollLoader />}
                    scrollableTarget={`subTagsScrollableDiv${tag._id}`}
                  >
                    {items.map((subTag: InterfaceTagData) => (
                      <div key={subTag._id} data-testid="orgUserSubTags">
                        <TagNode
                          tag={subTag}
                          checkedTags={checkedTags}
                          toggleTagSelection={toggleTagSelection}
                          t={t}
                        />
                      </div>
                    ))}
                  </InfiniteScroll>
                </div>
              );
            }}
          </CursorPaginationManager>
        </div>
      )}
    </div>
  );
};

export default TagNode;
