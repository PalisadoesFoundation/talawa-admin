/**
 * SubTags Component
 *
 * Manages and displays the sub-tags of a parent tag within an organization.
 * Provides functionality to view, search, sort, and add sub-tags,
 * as well as navigate between tags and their sub-tags.
 * Uses CursorPaginationManager for paginated loading.
 */
import { useMutation } from '@apollo/client';
import IconComponent from 'shared-components/IconComponent/IconComponent';
import { useNavigate, useParams, Link } from 'react-router';
import type { FormEvent } from 'react';
import React, { useState } from 'react';
import { FormTextField } from 'shared-components/FormFieldGroup/FormTextField';
import Button from 'shared-components/Button';
import {
  CreateModal,
  useModalState,
} from 'shared-components/CRUDModalTemplate';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import styles from './SubTags.module.css';
import type { SortedByType } from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import SearchFilterBar from 'shared-components/SearchFilterBar/SearchFilterBar';
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';

interface InterfaceSubTagNode {
  _id: string;
  name: string;
  childTags: { totalCount: number };
  usersAssignedTo: { totalCount: number };
}

interface InterfaceSubTagsQueryResult {
  getChildTags: {
    name: string;
    ancestorTags: Array<{ _id: string; name: string }>;
    childTags: unknown;
  };
}

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
  const [tagSortOrder, setTagSortOrder] = useState<SortedByType>('DESCENDING');
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Breadcrumb data extracted from query result
  const [parentTagName, setParentTagName] = useState<string>('');
  const [ancestorTags, setAncestorTags] = useState<
    Array<{ _id: string; name: string }>
  >([]);

  const showAddSubTagModal = (): void => {
    addSubTagModal.open();
  };

  const hideAddSubTagModal = (): void => {
    addSubTagModal.close();
    setTagName('');
    setTagNameTouched(false);
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
        setRefetchTrigger((prev) => prev + 1);
        setTagName('');
        addSubTagModal.close();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        NotificationToast.error(error.message);
      }
    }
  };

  // get the ancestorTags array and push the current tag in it
  // used for the tag breadcrumbs
  const orgUserTagAncestors = [
    ...ancestorTags,
    { _id: parentTagId, name: parentTagName },
  ];

  const redirectToManageTag = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/manageTag/${tagId}`);
  };

  const redirectToSubTags = (tagId: string): void => {
    navigate(`/admin/orgtags/${orgId}/subTags/${tagId}`);
  };

  const sortDropdownConfig = {
    id: 'subtags-sort-dropdown',
    label: tCommon('sort'),
    type: 'sort' as const,
    options: [
      { label: t('Latest'), value: 'DESCENDING' },
      { label: t('Oldest'), value: 'ASCENDING' },
    ],
    selectedOption: tagSortOrder,
    onOptionChange: (value: string | number) =>
      setTagSortOrder(value as SortedByType),
    dataTestIdPrefix: 'sortTags',
  };

  const additionalActionButtons = (
    <>
      <Button
        onClick={() => redirectToManageTag(parentTagId as string)}
        data-testid="manageCurrentTagBtn"
        className={`${styles.createButton} mb-3`}
      >
        {`${t('manageTag')} ${parentTagName}`}
      </Button>

      <Button
        variant="success"
        onClick={showAddSubTagModal}
        data-testid="addSubTagBtn"
        className={`${styles.createButton} mb-3`}
      >
        <i className={'fa fa-plus me-2'} />
        {t('addChildTag')}
      </Button>
    </>
  );

  const handleQueryResult = (data: InterfaceSubTagsQueryResult): void => {
    if (data?.getChildTags) {
      setParentTagName(data.getChildTags.name);
      setAncestorTags(data.getChildTags.ancestorTags ?? []);
    }
  };

  return (
    <>
      <Row>
        <div>
          <SearchFilterBar
            searchPlaceholder={tCommon('searchByName')}
            searchValue={tagSearchName}
            onSearchChange={(value) => setTagSearchName(value.trim())}
            searchInputTestId="searchByName"
            searchButtonTestId="searchBtn"
            hasDropdowns={true}
            dropdowns={[sortDropdownConfig]}
            additionalButtons={additionalActionButtons}
          />

          <div className="mb-2 ">
            <div className="bg-white light border rounded-top mb-0 py-2 d-flex align-items-center">
              <div className="ms-3 my-1">
                <IconComponent name="Tag" />
              </div>

              <Button
                type="button"
                onClick={() => navigate(`/admin/orgtags/${orgId}`)}
                className={`fs-6 ms-3 my-1 ${styles.tagsBreadCrumbs}`}
                data-testid="allTagsBtn"
                data-text={t('tags')}
              >
                {t('tags')}
                <i className={'mx-2 fa fa-caret-right'} aria-hidden="true" />
              </Button>

              {orgUserTagAncestors?.map((tag, index) => (
                <Button
                  type="button"
                  key={index}
                  className={`ms-2  ${tag._id === parentTagId ? `fs-4 fw-semibold text-secondary` : `${styles.tagsBreadCrumbs} fs-6`}`}
                  onClick={() => redirectToSubTags(tag._id as string)}
                  data-testid="redirectToSubTags"
                  data-text={tag.name}
                >
                  {tag.name}

                  {orgUserTagAncestors.length - 1 !== index && (
                    <i
                      className={'mx-2 fa fa-caret-right'}
                      aria-hidden="true"
                    />
                  )}
                </Button>
              ))}
            </div>
            <div
              data-testid="subTagsScrollableDiv"
              className={styles.subTagsScrollableDiv}
            >
              <div
                role="row"
                className={`${styles.tableHeader} d-flex align-items-center py-2 px-3`}
              >
                <div role="columnheader" className={styles.serialColumn}>
                  #
                </div>
                <div role="columnheader" className={styles.flexColumn}>
                  {t('tagName')}
                </div>
                <div role="columnheader" className={styles.flexColumnCenter}>
                  {t('totalSubTags')}
                </div>
                <div role="columnheader" className={styles.flexColumnCenter}>
                  {t('totalAssignedUsers')}
                </div>
                <div role="columnheader" className={styles.flexColumnCenter}>
                  {tCommon('actions')}
                </div>
              </div>

              <CursorPaginationManager<
                InterfaceSubTagsQueryResult,
                InterfaceSubTagNode
              >
                query={USER_TAG_SUB_TAGS}
                queryVariables={{
                  id: parentTagId,
                  where: { name: { starts_with: tagSearchName } },
                  sortedBy: { id: tagSortOrder },
                }}
                dataPath="getChildTags.childTags"
                itemsPerPage={TAGS_QUERY_DATA_CHUNK_SIZE}
                keyExtractor={(tag) => tag._id}
                refetchTrigger={refetchTrigger}
                onQueryResult={handleQueryResult}
                emptyStateComponent={
                  <div
                    className="text-center py-4 text-muted"
                    data-testid="noTagsFound"
                  >
                    {t('noTagsFound')}
                  </div>
                }
                renderItem={(tag, index) => (
                  <div
                    role="row"
                    data-testid="subTagRow"
                    className="d-flex align-items-center py-2 px-3 border-bottom"
                  >
                    <div role="cell" className={styles.serialColumn}>
                      {index + 1}
                    </div>
                    <div role="cell" className={styles.flexColumn}>
                      <div
                        className={styles.subTagsLink}
                        data-testid="tagName"
                        role="button"
                        tabIndex={0}
                        onClick={() => redirectToSubTags(tag._id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            redirectToSubTags(tag._id);
                          }
                        }}
                      >
                        {tag.name}
                        <i className={'ms-2 fa fa-caret-right'} />
                      </div>
                    </div>
                    <div role="cell" className={styles.flexColumnCenter}>
                      <Link
                        className="text-secondary"
                        to={`/admin/orgtags/${orgId}/subTags/${tag._id}`}
                        aria-label={t('viewSubTags', {
                          count: tag.childTags.totalCount,
                        })}
                      >
                        {tag.childTags.totalCount}
                      </Link>
                    </div>
                    <div role="cell" className={styles.flexColumnCenter}>
                      <Link
                        className="text-secondary"
                        to={`/admin/orgtags/${orgId}/manageTag/${tag._id}`}
                      >
                        {tag.usersAssignedTo.totalCount}
                      </Link>
                    </div>
                    <div role="cell" className={styles.flexColumnCenter}>
                      <Button
                        size="sm"
                        onClick={() => redirectToManageTag(tag._id)}
                        data-testid="manageTagBtn"
                        className={styles.editButton}
                      >
                        {t('manageTag')}
                      </Button>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </Row>

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
