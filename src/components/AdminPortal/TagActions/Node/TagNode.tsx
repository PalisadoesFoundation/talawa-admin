/**
 * Component: TagNode
 *
 * Renders a tag node that can be expanded to display its subtags.
 * Uses CursorPaginationManager for paginated loading of subtags.
 * The component is recursive, enabling nested subtags to be displayed.
 */
// translation-check-keyPrefix: manageTag
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import React, { useState } from 'react';
import type { InterfaceTagData } from 'utils/interfaces';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import styles from './TagNode.module.css';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
import { useTranslation } from 'react-i18next';

interface InterfaceTagNodeProps {
  tag: InterfaceTagData;
  checkedTags: Set<string>;
  toggleTagSelection: (tag: InterfaceTagData, isSelected: boolean) => void;
}

/**
 * Renders the Tags which can be expanded to list subtags.
 */
const TagNode: React.FC<InterfaceTagNodeProps> = ({
  tag,
  checkedTags,
  toggleTagSelection,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'manageTag' });
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
    <div className={styles.childTags}>
      <div>
        {tag.childTags?.totalCount ? (
          <>
            <span
              onClick={handleTagClick}
              className={styles.expandSubTags}
              data-testid={`expandSubTags${tag._id}`}
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
            <i className="fa fa-folder mx-2" />{' '}
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
            <i className="fa fa-tag mx-2" />{' '}
          </>
        )}

        {tag.name}
      </div>

      {expanded && (
        <div className={styles.subTagsScrollableContainer}>
          <div
            // i18n-ignore-next-line
            data-testid={`subTagsScrollableDiv${tag._id}`}
            className={styles.subTagsScrollableDiv}
          >
            <CursorPaginationManager
              query={USER_TAG_SUB_TAGS}
              queryVariables={{ id: tag._id }}
              dataPath="getChildTags.childTags"
              itemsPerPage={TAGS_QUERY_DATA_CHUNK_SIZE}
              keyExtractor={(subTag: InterfaceTagData) => subTag._id}
              renderItem={(subTag: InterfaceTagData) => (
                <div data-testid="orgUserSubTags">
                  <TagNode
                    tag={subTag}
                    checkedTags={checkedTags}
                    toggleTagSelection={toggleTagSelection}
                  />
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TagNode;
