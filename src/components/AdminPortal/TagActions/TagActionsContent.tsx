import React from 'react';
import Button from 'shared-components/Button/Button';
import InfiniteScrollLoader from 'shared-components/InfiniteScrollLoader/InfiniteScrollLoader';
import styles from './TagActionsContent.module.css';
import type { InterfaceTagActionsContentProps } from 'types/AdminPortal/TagActions/interface';

const TagActionsContent: React.FC<InterfaceTagActionsContentProps> = ({
  hasAssignees,
  currentFolderId,
  breadcrumbFolderIds,
  folderStateMap,
  onOpenFolder,
  onGoToRoot,
  manageTagTranslator,
  organizationTagsTranslator,
  rootFoldersLoading,
  rootFolderIds,
  rootFoldersError,
  visibleFolderIds,
  currentFolder,
  visibleTags,
  checkedTags,
  onToggleTagSelection,
}) => {
  return (
    <>
      {hasAssignees && (
        <div
          className={styles.pathBreadcrumb}
          data-testid="folderPathBreadcrumb"
        >
          {currentFolderId ? (
            <Button
              type="button"
              variant="link"
              className={styles.pathBreadcrumbLink}
              onClick={onGoToRoot}
              data-testid="rootFolderBtn"
            >
              {organizationTagsTranslator('tags')}
            </Button>
          ) : (
            <span className={styles.pathBreadcrumbCurrent}>
              {organizationTagsTranslator('tags')}
            </span>
          )}

          {breadcrumbFolderIds.map((folderId, index) => {
            const folder = folderStateMap.get(folderId);
            if (!folder) return null;

            const isCurrent = index === breadcrumbFolderIds.length - 1;
            return (
              <React.Fragment key={folderId}>
                <span
                  className={styles.pathBreadcrumbSeparator}
                  aria-hidden="true"
                />
                {isCurrent ? (
                  <span className={styles.pathBreadcrumbCurrent}>
                    {folder.name}
                  </span>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    className={styles.pathBreadcrumbLink}
                    onClick={() => onOpenFolder(folderId)}
                  >
                    {folder.name}
                  </Button>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      <ul
        id="scrollableDiv"
        data-testid="scrollableDiv"
        className={styles.tagActionsScrollableDiv}
        aria-label={organizationTagsTranslator('tags')}
      >
        {!hasAssignees ? (
          <div
            className="text-body-tertiary mx-auto"
            data-testid="noPeopleFoundMessage"
          >
            {manageTagTranslator('noPeopleFound')}
          </div>
        ) : rootFoldersLoading && rootFolderIds.length === 0 ? (
          <div className={styles.loadingDiv}>
            <InfiniteScrollLoader />
          </div>
        ) : rootFoldersError ? (
          <div
            className="text-danger mx-auto"
            data-testid="tagsQueryErrorMessage"
          >
            {rootFoldersError.message}
          </div>
        ) : rootFolderIds.length === 0 ? (
          <div
            className="text-body-tertiary mx-auto"
            data-testid="noTagsFoundMessage"
          >
            {manageTagTranslator('noTagsFound')}
          </div>
        ) : (
          <>
            {visibleFolderIds.map((folderId) => {
              const folder = folderStateMap.get(folderId);
              if (!folder) return null;

              return (
                <li key={`folder-${folder.id}`} className={styles.listItem}>
                  <Button
                    type="button"
                    variant="link"
                    className={styles.folderNavButton}
                    onClick={() => onOpenFolder(folder.id)}
                    data-testid={`expandFolder${folder.id}`}
                  >
                    <i
                      className={`fa fa-folder me-2 ${styles.folderIcon}`}
                      aria-hidden="true"
                    />
                    <span>{folder.name}</span>
                  </Button>
                </li>
              );
            })}

            {currentFolder?.loading && (
              <li className={styles.listItem}>
                <div className={styles.folderLoadingRow}>
                  <InfiniteScrollLoader />
                </div>
              </li>
            )}

            {visibleTags.map((tag) => (
              <li key={tag.id} className={styles.listItem}>
                <label
                  className={`${styles.listItemLabel} ${styles.tagRow}`}
                  data-testid="orgUserTag"
                >
                  <span className={styles.tagRowMain}>
                    <i
                      className={`fa fa-tag ${styles.tagIcon}`}
                      aria-hidden="true"
                    />
                    <span className={styles.tagName}>{tag.name}</span>
                  </span>
                  <input
                    type="checkbox"
                    className={styles.listCheckbox}
                    checked={checkedTags.has(tag.id)}
                    onChange={(e) =>
                      onToggleTagSelection(tag, e.target.checked)
                    }
                    data-testid={`checkTag${tag.id}`}
                    aria-label={tag.name}
                  />
                </label>
              </li>
            ))}

            {!currentFolder?.loading &&
              visibleFolderIds.length === 0 &&
              visibleTags.length === 0 && (
                <li className={styles.listItem}>
                  <div className={styles.folderEmptyRow}>
                    {manageTagTranslator('noTagsFound')}
                  </div>
                </li>
              )}
          </>
        )}
      </ul>
    </>
  );
};

export default TagActionsContent;
