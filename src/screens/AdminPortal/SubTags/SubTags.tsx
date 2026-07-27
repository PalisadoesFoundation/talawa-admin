/**
 * SubTags Component
 *
 * This component is responsible for managing and displaying the sub-tags
 * of a parent tag within an organization. It provides functionality to
 * view, search, sort, and add sub-tags, as well as navigate between tags
 * and their sub-tags.
 *
 * @returns The rendered SubTags component.
 */
import { useMutation, useQuery } from '@apollo/client';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';

import LoadingState from 'shared-components/LoadingState/LoadingState';
import { useNavigate, useParams } from 'react-router';
import type { FormEvent } from 'react';
import React, { useState } from 'react';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import Button from 'shared-components/Button';
import {
  CreateModal,
  useModalState,
} from 'shared-components/CRUDModalTemplate';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import type { InterfaceQueryUserTagChildTags } from 'utils/interfaces';
import styles from './SubTags.module.css';
import type {
  InterfaceOrganizationSubTagsQuery,
  SortedByType,
} from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import InfiniteScroll from 'react-infinite-scroll-component';

function SubTags(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationTags',
  });
  const { t: tCommon } = useTranslation('common');

  const addSubTagModal = useModalState();

  const { orgId, tagId: parentTagId } = useParams();

  const navigate = useNavigate();

  const [tagName, setTagName] = useState<string>('');
  const [tagNameTouched, setTagNameTouched] = useState(false);

  const [tagSearchName, setTagSearchName] = useState('');
  const [tagSortOrder] = useState<SortedByType>('DESCENDING');

  const showAddSubTagModal = (): void => {
    addSubTagModal.open();
  };

  const hideAddSubTagModal = (): void => {
    addSubTagModal.close();
    setTagName('');
    setTagNameTouched(false);
  };

  const {
    data: subTagsData,
    error: subTagsError,
    loading: subTagsLoading,
    refetch: subTagsRefetch,
    fetchMore: fetchMoreSubTags,
  }: InterfaceOrganizationSubTagsQuery = useQuery(USER_TAG_SUB_TAGS, {
    variables: {
      id: parentTagId,
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
      where: { name: { starts_with: tagSearchName } },
      sortedBy: { id: tagSortOrder },
    },
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

  const [create, { loading: createUserTagLoading }] =
    useMutation(CREATE_USER_TAG);

  const addSubTag = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const { data } = await create({
        variables: {
          name: tagName,
          organizationId: orgId,
          folderId: parentTagId,
        },
      });

      if (data) {
        NotificationToast.success(t('tagCreationSuccess') as string);
        subTagsRefetch();
        setTagName('');
        addSubTagModal.close();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  if (subTagsError) {
    return (
      <div className={`${styles.errorContainer} rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} />
          <h6 className={styles.errorHeading}>{tCommon('errorOccured')}</h6>
        </div>
      </div>
    );
  }

  const subTagsList =
    subTagsData?.getChildTags.childTags.edges.map((edge) => edge.node) ?? [];

  const parentTagName = subTagsData?.getChildTags.name;

  // get the ancestorTags array and push the current tag in it
  // used for the tag breadcrumbs
  const orgUserTagAncestors = [
    ...(subTagsData?.getChildTags.ancestorTags ?? []),
    { _id: parentTagId, name: parentTagName },
  ];

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/subTags/${tagId}`);
  };

  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/admin/orgtags/${orgId}`);
          }}
          data-testid="allTagsBtn"
        >
          {t('tags')}
        </a>
        {orgUserTagAncestors?.map((tag, index) => (
          <span key={index}>
            {' \u203A '}
            {tag._id === parentTagId ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  redirectToManageTag(tag._id as string);
                }}
                data-testid="redirectToSubTags"
                data-text={tag.name}
              >
                {tag.name}
              </a>
            ) : (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  redirectToSubTags(tag._id as string);
                }}
                data-testid="redirectToSubTags"
                data-text={tag.name}
              >
                {tag.name}
              </a>
            )}
          </span>
        ))}
        {' \u203A '}
        {t('subTags')}
      </nav>

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            {parentTagName} &mdash; {t('subTags')}{' '}
            <span className={styles.titleCount}>
              {subTagsList?.length ?? 0}
            </span>
          </h1>
          <p className="page-subtitle">{t('tagName')}</p>
        </div>
        <div className="page-header-actions">
          <Button
            onClick={() => redirectToManageTag(parentTagId as string)}
            data-testid="manageCurrentTagBtn"
            className="btn btn-secondary"
          >
            {`${t('manageTag')} ${subTagsData?.getChildTags.name}`}
          </Button>
          <button
            className="btn btn-primary"
            onClick={showAddSubTagModal}
            data-testid="addSubTagBtn"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>{' '}
            {t('addChildTag')}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-bar">
          <svg
            aria-hidden="true"
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder={tCommon('searchByName')}
            aria-label={tCommon('searchByName')}
            value={tagSearchName}
            onChange={(e) => setTagSearchName(e.target.value.trim())}
            data-testid="searchByName"
          />
        </div>
      </div>

      {/* Sub-tags Table */}
      {subTagsLoading ? (
        <LoadingState
          isLoading={true}
          variant="spinner"
          size="lg"
          data-testid="subTagsLoadingState"
        >
          {null}
        </LoadingState>
      ) : (
        <div className="card">
          <div
            id="subTagsScrollableDiv"
            data-testid="subTagsScrollableDiv"
            className={styles.subTagsScrollableDiv}
          >
            <InfiniteScroll
              dataLength={subTagsList?.length ?? 0}
              next={loadMoreSubTags}
              hasMore={
                subTagsData?.getChildTags.childTags.pageInfo.hasNextPage ??
                false
              }
              loader={
                <LoadingState
                  isLoading={true}
                  variant="inline"
                  size="sm"
                  data-testid="infiniteScrollLoader"
                >
                  <></>
                </LoadingState>
              }
              scrollableTarget="subTagsScrollableDiv"
            >
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">{t('tagName')}</th>
                      <th scope="col">{t('totalAssignedUsers')}</th>
                      <th scope="col">{t('totalSubTags')}</th>
                      <th scope="col">{tCommon('created')}</th>
                      <th scope="col">{tCommon('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subTagsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className={styles.emptyCell}>
                          {t('noTagsFound')}
                        </td>
                      </tr>
                    ) : (
                      subTagsList.map(
                        (
                          subTag: InterfaceQueryUserTagChildTags['childTags']['edges'][number]['node'],
                        ) => (
                          <tr key={subTag._id}>
                            <td className="cell-primary">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  redirectToManageTag(subTag._id);
                                }}
                                className={styles.cellPrimaryLink}
                                data-testid="tagName"
                              >
                                {subTag.name}
                              </a>
                            </td>
                            <td>{subTag.usersAssignedTo?.totalCount ?? 0}</td>
                            <td>{subTag.childTags?.totalCount ?? 0}</td>
                            <td>
                              {subTag.createdAt
                                ? new Date(subTag.createdAt).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: '2-digit',
                                      year: 'numeric',
                                    },
                                  )
                                : ''}
                            </td>
                            <td>
                              <div className={styles.actionBtns}>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() =>
                                    redirectToManageTag(subTag._id)
                                  }
                                  data-testid="manageTagBtn"
                                >
                                  {tCommon('edit')}
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => redirectToSubTags(subTag._id)}
                                  data-testid="subTagsBtn"
                                >
                                  {tCommon('delete')}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </InfiniteScroll>
          </div>
        </div>
      )}

      {/* Create Tag Modal */}
      <CreateModal
        open={addSubTagModal.isOpen}
        onClose={hideAddSubTagModal}
        title={t('tagDetails')}
        onSubmit={addSubTag}
        loading={createUserTagLoading}
        submitDisabled={!tagName}
        data-testid="addSubTagModal"
      >
        <FormTextField
          name="tagName"
          label={t('tagName')}
          placeholder={t('tagNamePlaceholder')}
          value={tagName}
          onChange={(val) => {
            setTagName(val);
            if (!tagNameTouched) setTagNameTouched(true);
          }}
          onBlur={() => setTagNameTouched(true)}
          touched={tagNameTouched}
          error={tagNameTouched && !tagName ? tCommon('required') : undefined}
          required
          data-testid="modalTitle"
          autoComplete="off"
        />
      </CreateModal>
    </>
  );
}

export default SubTags;
