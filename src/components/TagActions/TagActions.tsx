import { useMutation, useQuery } from '@apollo/client';
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import type {
  InterfaceQueryOrganizationUserTags,
  InterfaceTagData,
} from 'utils/interfaces';
import styles from 'style/app.module.css';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import {
  ASSIGN_TO_TAGS,
  REMOVE_FROM_TAGS,
} from 'GraphQl/Mutations/TagMutations';
import { toast } from 'react-toastify';
import type { TagActionType } from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WarningAmberRounded } from '@mui/icons-material';
import TagNode from './Node/TagNode';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';
import type { TFunction } from 'i18next';

/** Interface for ancestor tag data structure */
interface InterfaceUserTagsAncestorData {
  id: string;
  name: string;
}

/** Props interface for TagActions component */
export interface InterfaceTagActionsProps {
  tagActionsModalIsOpen: boolean;
  hideTagActionsModal: () => void;
  tagActionType: TagActionType;
  t: TFunction<'translation', 'manageTag'>;
  tCommon: TFunction<'common', undefined>;
  userId: string;
  currentTagId: string;
}

/** Interface for organization tags query response */
interface InterfaceOrganizationTagsQuery {
  data?: {
    organizations: Array<{
      tags: {
        edges: Array<{
          node: InterfaceTagData & {
            __typename: string;
          };
          cursor: string;
          __typename: string;
        }>;
        pageInfo: {
          startCursor: string | null;
          endCursor: string | null;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          __typename: string;
        };
        __typename: string;
      };
      __typename: string;
    }>;
  };
  loading: boolean;
  error?: any;
  fetchMore: (options: any) => Promise<any>;
}

/**
 * TagActions component handles the assignment and removal of tags
 * @param props - Component props of type InterfaceTagActionsProps
 * @returns React component that renders a modal for tag actions
 */
const TagActions: React.FC<InterfaceTagActionsProps> = ({
  tagActionsModalIsOpen,
  hideTagActionsModal,
  tagActionType,
  t,
  tCommon,
  userId,
  currentTagId,
}) => {
  const { orgId } = useParams();

  useEffect(() => {
    console.log('Route params:', { orgId, userId });
  }, [orgId, userId]);

  const [tagSearchName, setTagSearchName] = useState('');

  const {
    data: orgUserTagsData,
    loading: orgUserTagsLoading,
    error: orgUserTagsError,
    fetchMore: orgUserTagsFetchMore,
  }: InterfaceOrganizationTagsQuery = useQuery(ORGANIZATION_USER_TAGS_LIST, {
    variables: {
      input: { id: orgId },
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
      after: null,
    },
    skip: !tagActionsModalIsOpen || !orgId,
    onCompleted: (data) => {
      console.log('Query completed with data:', data);
    },
    onError: (error) => {
      console.error('Query error:', error);
    },
  });

  const tagsData = orgUserTagsData?.organizations?.[0]?.tags;

  useEffect(() => {
    if (orgUserTagsData) {
      console.log('Full query response:', orgUserTagsData);
      console.log('Tags data:', tagsData);
    }
  }, [orgUserTagsData, tagsData]);

  const userTagsList = React.useMemo(() => {
    if (!tagsData?.edges) {
      return [];
    }

    return tagsData.edges
      .filter((edge) => edge?.node)
      .map((edge) => ({
        id: edge.node.id,
        name: edge.node.name,
        ancestorTags: edge.node.folder
          ? [{ id: edge.node.folder.id, name: edge.node.folder.name }]
          : [],
        parentTag: edge.node.folder || null,
      }))
      .filter((tag) =>
        tagSearchName
          ? tag.name.toLowerCase().includes(tagSearchName.toLowerCase())
          : true,
      );
  }, [tagsData, tagSearchName]);
  useEffect(() => {
    console.log('Processed tags list:', userTagsList);
  }, [userTagsList]);

  const hasMoreTags =
    orgUserTagsData?.organizations[0]?.tags?.pageInfo?.hasNextPage ?? false;

  const loadMoreUserTags = (): void => {
    orgUserTagsFetchMore({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: orgUserTagsData?.organizations[0]?.tags?.pageInfo.endCursor,
      },
      updateQuery: (
        prevResult: { organizations: { tags: { edges: any } }[] },
        { fetchMoreResult }: any,
      ) => {
        if (!fetchMoreResult) return prevResult;

        return {
          organizations: [
            {
              ...prevResult.organizations[0],
              tags: {
                ...prevResult.organizations[0].tags,
                edges: [
                  ...prevResult.organizations[0].tags.edges,
                  ...fetchMoreResult.organizations[0].tags.edges,
                ],
                pageInfo: fetchMoreResult.organizations[0].tags.pageInfo,
              },
            },
            ...prevResult.organizations.slice(1),
          ],
        };
      },
    });
  };

  const [selectedTags, setSelectedTags] = useState<InterfaceTagData[]>([]);
  const [checkedTags, setCheckedTags] = useState<Set<string>>(new Set());
  const [addAncestorTagsData, setAddAncestorTagsData] = useState<
    Set<InterfaceUserTagsAncestorData>
  >(new Set());
  const [removeAncestorTagsData, setRemoveAncestorTagsData] = useState<
    Set<InterfaceUserTagsAncestorData>
  >(new Set());
  const [ancestorTagsDataMap, setAncestorTagsDataMap] = useState(new Map());

  useEffect(() => {
    const newCheckedTags = new Set(checkedTags);
    const newAncestorTagsDataMap = new Map(ancestorTagsDataMap);

    addAncestorTagsData.forEach(
      (ancestorTag: InterfaceUserTagsAncestorData) => {
        const prevAncestorTagValue = ancestorTagsDataMap.get(ancestorTag.id);
        newAncestorTagsDataMap.set(
          ancestorTag.id,
          prevAncestorTagValue ? prevAncestorTagValue + 1 : 1,
        );
        newCheckedTags.add(ancestorTag.id);
      },
    );

    setCheckedTags(newCheckedTags);
    setAncestorTagsDataMap(newAncestorTagsDataMap);
  }, [addAncestorTagsData]);

  useEffect(() => {
    const newCheckedTags = new Set(checkedTags);
    const newAncestorTagsDataMap = new Map(ancestorTagsDataMap);

    removeAncestorTagsData.forEach(
      (ancestorTag: InterfaceUserTagsAncestorData) => {
        const prevAncestorTagValue = ancestorTagsDataMap.get(ancestorTag.id);
        if (prevAncestorTagValue === 1) {
          newCheckedTags.delete(ancestorTag.id);
          newAncestorTagsDataMap.delete(ancestorTag.id);
        } else {
          newAncestorTagsDataMap.set(ancestorTag.id, prevAncestorTagValue - 1);
        }
      },
    );

    setCheckedTags(newCheckedTags);
    setAncestorTagsDataMap(newAncestorTagsDataMap);
  }, [removeAncestorTagsData]);

  const selectTag = (tag: InterfaceTagData): void => {
    const newCheckedTags = new Set(checkedTags);

    setSelectedTags((selectedTags) => [...selectedTags, tag]);
    newCheckedTags.add(tag.id);

    setAddAncestorTagsData(
      new Set(
        tag.ancestorTags?.map((tag) => ({ id: tag.id, name: tag.name })) ?? [],
      ),
    );

    setCheckedTags(newCheckedTags);
  };

  const deSelectTag = (tag: InterfaceTagData): void => {
    if (!selectedTags.some((selectedTag) => selectedTag.id === tag.id)) {
      return;
    }

    const newCheckedTags = new Set(checkedTags);

    setSelectedTags(
      selectedTags.filter((selectedTag) => selectedTag.id !== tag.id),
    );
    newCheckedTags.delete(tag.id);

    setRemoveAncestorTagsData(
      new Set(
        tag.ancestorTags?.map((tag) => ({ id: tag.id, name: tag.name })) ?? [],
      ),
    );

    setCheckedTags(newCheckedTags);
  };

  const toggleTagSelection = (
    tag: InterfaceTagData,
    isSelected: boolean,
  ): void => {
    if (isSelected) {
      selectTag(tag);
    } else {
      deSelectTag(tag);
    }
  };

  const [assignUserTag] = useMutation(ASSIGN_TO_TAGS);
  const [removeUserTag] = useMutation(REMOVE_FROM_TAGS);

  const handleTagAction = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (
      !currentTagId ||
      typeof currentTagId !== 'string' ||
      currentTagId.trim() === ''
    ) {
      console.error('Invalid or missing tag ID: ghjhghj', { currentTagId });
      toast.error(t('tagIdNotFound'));
      // return;
    }

    if (!selectedTags.length) {
      toast.error(t('noTagSelected'));
      // return;
    }

    // New validation to ensure each selected tag has a valid id
    if (selectedTags.some((tag) => !tag.id || tag.id.trim() === '')) {
      toast.error(t('invalidTagId'));
      return;
    }

    try {
      const mutation =
        tagActionType === 'assignToTags' ? assignUserTag : removeUserTag;
      const selectedTagIds = selectedTags.map((tag) => tag.id);

      await mutation({
        variables: {
          currentTagId: currentTagId,
          selectedTagIds: selectedTagIds,
        },
      });

      toast.success(
        tagActionType === 'assignToTags'
          ? t('successfullyAssignedToTags')
          : t('successfullyRemovedFromTags'),
      );
      hideTagActionsModal();
    } catch (error: any) {
      console.error('Mutation error:', error);
      toast.error(error.message || t('anErrorOccurred'));
    }
  };

  if (orgUserTagsLoading) {
    return (
      <Modal show={tagActionsModalIsOpen} onHide={hideTagActionsModal}>
        <Modal.Body>
          <div className={styles.loadingDiv}>
            <InfiniteScrollLoader />
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  if (orgUserTagsError) {
    return (
      <Modal show={tagActionsModalIsOpen} onHide={hideTagActionsModal}>
        <Modal.Body>
          <div className={styles.errorMessage}>
            <WarningAmberRounded
              className={styles.errorIcon}
              fontSize="large"
            />
            <h6 className="fw-bold text-danger text-center">
              {t('errorOccurredWhileLoadingOrganizationUserTags')}
            </h6>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        show={tagActionsModalIsOpen}
        onHide={hideTagActionsModal}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          className={styles.modalHeader}
          data-testid="modalOrganizationHeader"
          closeButton
        >
          <Modal.Title className="text-white">
            {tagActionType === 'assignToTags'
              ? t('assignToTags')
              : t('removeFromTags')}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTagAction}>
          <Modal.Body className="pb-0">
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-2 p-2 border">
                <small>Debug: {userTagsList.length} tags loaded</small>
              </div>
            )}
            <div
              className={`d-flex flex-wrap align-items-center border border-2 border-dark-subtle bg-light-subtle rounded-3 p-2 ${styles.scrollContainer}`}
            >
              {selectedTags.length === 0 ? (
                <div className="text-body-tertiary mx-auto">
                  {t('noTagSelected')}
                </div>
              ) : (
                selectedTags.map((tag: InterfaceTagData) => (
                  <div
                    key={tag.id}
                    className={`badge bg-dark-subtle text-secondary-emphasis lh-lg my-2 ms-2 d-flex align-items-center ${styles.tagBadge}`}
                  >
                    {tag.name}
                    <button
                      className={`${styles.removeFilterIcon} fa fa-times ms-2 text-body-tertiary border-0 bg-transparent`}
                      onClick={() => deSelectTag(tag)}
                      data-testid={`clearSelectedTag${tag.id}`}
                      aria-label={t('remove')}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 position-relative">
              <i className="fa fa-search position-absolute text-body-tertiary end-0 top-50 translate-middle" />
              <Form.Control
                type="text"
                id="userName"
                className={styles.inputField}
                placeholder={tCommon('searchByName')}
                onChange={(e) => setTagSearchName(e.target.value.trim())}
                data-testid="searchByName"
                autoComplete="off"
              />
            </div>

            <div className="mt-3 mb-2 fs-5 fw-semibold text-dark-emphasis">
              {t('allTags')}
            </div>
            {orgUserTagsLoading ? (
              <div className={styles.loadingDiv}>
                <InfiniteScrollLoader />
              </div>
            ) : (
              <>
                <div
                  id="scrollableDiv"
                  data-testid="scrollableDiv"
                  style={{ height: 300, overflow: 'auto' }}
                >
                  <InfiniteScroll
                    dataLength={userTagsList?.length ?? 0}
                    next={loadMoreUserTags}
                    hasMore={hasMoreTags}
                    loader={<InfiniteScrollLoader />}
                    scrollableTarget="scrollableDiv"
                  >
                    {userTagsList?.map((tag) => (
                      <div key={tag.id} className="position-relative w-100">
                      <div
                        className="d-inline-block w-100"
                        data-testid="orgUserTag"
                      >
                        <TagNode
                        tag={{
                          ...tag,
                          _id: tag.id // Add the required _id field
                        }}
                        checkedTags={checkedTags}
                        toggleTagSelection={toggleTagSelection}
                        t={t}
                        />
                      </div>
                      {tag.ancestorTags && tag.ancestorTags.length > 0 && (
                        <div className="position-absolute end-0 top-0 d-flex flex-row mt-2 me-3 pt-0 text-secondary">
                        <span className="me-1">(</span>
                        {tag.ancestorTags.map((ancestorTag) => (
                          <span
                          key={ancestorTag.id}
                          className="d-flex align-items-center ms-1 my-0"
                          data-testid="ancestorTagsBreadCrumbs"
                          >
                          {ancestorTag.name}
                          {tag.ancestorTags!.indexOf(ancestorTag) !==
                            tag.ancestorTags!.length - 1 && (
                            <i className="ms-2 fa fa-caret-right" />
                          )}
                          </span>
                        ))}
                        <span className="ms-1">)</span>
                        </div>
                      )}
                      </div>
                    ))}
                  </InfiniteScroll>
                </div>
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              className={`btn btn-danger ${styles.removeButton}`}
              onClick={(): void => hideTagActionsModal()}
              data-testid="closeTagActionsModalBtn"
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              value="add"
              data-testid="tagActionSubmitBtn"
              className={`btn ${styles.addButton}`}
              // onClick={}
            >
              {tagActionType === 'assignToTags' ? t('assign') : t('remove')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default TagActions;
