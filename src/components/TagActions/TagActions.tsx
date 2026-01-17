/**
 * Component for managing tag actions such as assigning or removing tags
 * for users within an organization. It provides a modal interface for
 * selecting tags, searching tags, and performing the desired action.
 *
 * @component
 * @param {InterfaceTagActionsProps} props - The props for the component.
 * @param {boolean} props.tagActionsModalIsOpen - Determines if the modal is open.
 * @param {() => void} props.hideTagActionsModal - Function to close the modal.
 * @param {TagActionType} props.tagActionType - The type of action to perform ('assignToTags' or 'removeFromTags').
 * @param {TFunction<'translation', 'manageTag'>} props.t - Translation function for managing tags.
 * @param {TFunction<'common', undefined>} props.tCommon - Common translation function.
 *
 * @returns {React.FC} A React functional component.
 *
 * @remarks
 * - Uses Apollo Client's `useQuery` and `useMutation` hooks for fetching and mutating data.
 * - Implements infinite scrolling for loading tags.
 * - Handles ancestor tags to ensure hierarchical consistency when selecting or deselecting tags.
 *
 * @example
 * ```tsx
 * <TagActions
 *   tagActionsModalIsOpen={true}
 *   hideTagActionsModal={() => setModalOpen(false)}
 *   tagActionType="assignToTags"
 *   t={t}
 *   tCommon={tCommon}
 * />
 * ```
 *
 */
import { useMutation, useQuery } from '@apollo/client';
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router';
import type {
  InterfaceQueryOrganizationUserTags,
  InterfaceTagData,
} from 'utils/interfaces';
import styles from '../../style/app-fixed.module.css';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import {
  ASSIGN_TO_TAGS,
  REMOVE_FROM_TAGS,
} from 'GraphQl/Mutations/TagMutations';
import { toast } from 'react-toastify';
import type {
  InterfaceOrganizationTagsQuery,
  TagActionType,
} from 'utils/organizationTagsUtils';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WarningAmberRounded } from '@mui/icons-material';
import TagNode from './Node/TagNode';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';
import type { TFunction } from 'i18next';

interface InterfaceUserTagsAncestorData {
  _id: string;
  name: string;
}

export interface InterfaceTagActionsProps {
  tagActionsModalIsOpen: boolean;
  hideTagActionsModal: () => void;
  tagActionType: TagActionType;
  t: TFunction<'translation', 'manageTag'>;
  tCommon: TFunction<'common', undefined>;
}

const TagActions: React.FC<InterfaceTagActionsProps> = ({
  tagActionsModalIsOpen,
  hideTagActionsModal,
  tagActionType,
  t,
  tCommon,
}) => {
  const { orgId, tagId: currentTagId } = useParams();

  const [tagSearchName, setTagSearchName] = useState('');

  const {
    data: orgUserTagsData,
    loading: orgUserTagsLoading,
    error: orgUserTagsError,
    fetchMore: orgUserTagsFetchMore,
  }: InterfaceOrganizationTagsQuery = useQuery(ORGANIZATION_USER_TAGS_LIST, {
    variables: {
      id: orgId,
      first: TAGS_QUERY_DATA_CHUNK_SIZE,
      where: { name: { starts_with: tagSearchName } },
    },
    skip: !tagActionsModalIsOpen,
  });

  const loadMoreUserTags = (): void => {
    orgUserTagsFetchMore({
      variables: {
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: orgUserTagsData?.organizations[0].userTags.pageInfo.endCursor,
      },
      updateQuery: (
        prevResult: { organizations: InterfaceQueryOrganizationUserTags[] },
        {
          fetchMoreResult,
        }: {
          fetchMoreResult?: {
            organizations: InterfaceQueryOrganizationUserTags[];
          };
        },
      ) => {
        if (!fetchMoreResult) return prevResult;

        return {
          organizations: [
            {
              ...prevResult.organizations[0],
              userTags: {
                ...prevResult.organizations[0].userTags,
                edges: [
                  ...prevResult.organizations[0].userTags.edges,
                  ...fetchMoreResult.organizations[0].userTags.edges,
                ],
                pageInfo: fetchMoreResult.organizations[0].userTags.pageInfo,
              },
            },
          ],
        };
      },
    });
  };

  const userTagsList =
    orgUserTagsData?.organizations[0]?.userTags.edges.map(
      (edge) => edge.node,
    ) ?? [];

  // tags that we have selected to assigned
  const [selectedTags, setSelectedTags] = useState<InterfaceTagData[]>([]);

  // tags that we have checked, it is there to differentiate between the selected tags and all the checked tags
  // i.e. selected tags would only be the ones we select, but checked tags will also include the selected tag's ancestors
  const [checkedTags, setCheckedTags] = useState<Set<string>>(new Set());

  // next 3 states are there to keep track of the ancestor tags of the the tags that we have selected
  // i.e. when we check a tag, all of it's ancestor tags will be checked too
  // indicating that the users will be assigned all of the ancestor tags as well
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
        const prevAncestorTagValue = ancestorTagsDataMap.get(ancestorTag._id);
        newAncestorTagsDataMap.set(
          ancestorTag._id,
          prevAncestorTagValue ? prevAncestorTagValue + 1 : 1,
        );
        newCheckedTags.add(ancestorTag._id);
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
        const prevAncestorTagValue = ancestorTagsDataMap.get(ancestorTag._id);
        if (prevAncestorTagValue === 1) {
          newCheckedTags.delete(ancestorTag._id);
          newAncestorTagsDataMap.delete(ancestorTag._id);
        } else {
          newAncestorTagsDataMap.set(ancestorTag._id, prevAncestorTagValue - 1);
        }
      },
    );

    setCheckedTags(newCheckedTags);
    setAncestorTagsDataMap(newAncestorTagsDataMap);
  }, [removeAncestorTagsData]);

  const selectTag = (tag: InterfaceTagData): void => {
    const newCheckedTags = new Set(checkedTags);

    setSelectedTags((selectedTags) => [...selectedTags, tag]);
    newCheckedTags.add(tag._id);

    setAddAncestorTagsData(new Set(tag.ancestorTags));

    setCheckedTags(newCheckedTags);
  };

  const deSelectTag = (tag: InterfaceTagData): void => {
    if (!selectedTags.some((selectedTag) => selectedTag._id === tag._id)) {
      return;
    }

    const newCheckedTags = new Set(checkedTags);

    setSelectedTags(
      selectedTags.filter((selectedTag) => selectedTag._id !== tag._id),
    );
    newCheckedTags.delete(tag._id);

    setRemoveAncestorTagsData(new Set(tag.ancestorTags));

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

  const [assignToTags] = useMutation(ASSIGN_TO_TAGS);
  const [removeFromTags] = useMutation(REMOVE_FROM_TAGS);

  const handleTagAction = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!selectedTags.length) {
      toast.error(t('noTagSelected'));
      return;
    }

    const mutationObject = {
      variables: {
        currentTagId,
        selectedTagIds: selectedTags.map((selectedTag) => selectedTag._id),
      },
    };

    try {
      const { data } =
        tagActionType === 'assignToTags'
          ? await assignToTags(mutationObject)
          : await removeFromTags(mutationObject);

      if (data) {
        if (tagActionType === 'assignToTags') {
          toast.success(t('successfullyAssignedToTags'));
        } else {
          toast.success(t('successfullyRemovedFromTags'));
        }
        hideTagActionsModal();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (orgUserTagsError) {
    return (
      <div className={`${styles.errorContainer} bg-white rounded-4 my-3`}>
        <div className={styles.errorMessage}>
          <WarningAmberRounded className={styles.errorIcon} fontSize="large" />
          <h6 className="fw-bold text-danger text-center">
            {t('errorOccurredWhileLoadingOrganizationUserTags')}
          </h6>
        </div>
      </div>
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
                    key={tag._id}
                    className={`badge bg-dark-subtle text-secondary-emphasis lh-lg my-2 ms-2 d-flex align-items-center ${styles.tagBadge}`}
                  >
                    {tag.name}
                    <button
                      className={`${styles.removeFilterIcon} fa fa-times ms-2 text-body-tertiary border-0 bg-transparent`}
                      onClick={() => deSelectTag(tag)}
                      data-testid={`clearSelectedTag${tag._id}`}
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
                    hasMore={
                      orgUserTagsData?.organizations[0].userTags.pageInfo
                        .hasNextPage ?? false
                    }
                    loader={<InfiniteScrollLoader />}
                    scrollableTarget="scrollableDiv"
                  >
                    {userTagsList?.map((tag) => (
                      <div key={tag._id} className="position-relative w-100">
                        <div
                          className="d-inline-block w-100"
                          data-testid="orgUserTag"
                        >
                          <TagNode
                            tag={tag}
                            checkedTags={checkedTags}
                            toggleTagSelection={toggleTagSelection}
                            t={t}
                          />
                        </div>

                        {/* Ancestor tags breadcrumbs positioned at the end of TagNode */}
                        {tag.parentTag && (
                          <div className="position-absolute end-0 top-0 d-flex flex-row mt-2 me-3 pt-0 text-secondary">
                            <>{'('}</>
                            {tag.ancestorTags?.map((ancestorTag) => (
                              <span
                                key={ancestorTag._id}
                                className="ms-2 my-0"
                                data-testid="ancestorTagsBreadCrumbs"
                              >
                                {ancestorTag.name}
                                <i className="ms-2 fa fa-caret-right" />
                              </span>
                            ))}
                            <>{')'}</>
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
