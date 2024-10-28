import { useMutation, useQuery } from '@apollo/client';
import Loader from 'components/Loader/Loader';
import { USER_TAG_ANCESTORS } from 'GraphQl/Queries/userTagQueries';
import type { FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import type {
  InterfaceQueryOrganizationUserTags,
  InterfaceTagData,
} from 'utils/interfaces';
import styles from './TagActions.module.css';
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
import { TAGS_QUERY_PAGE_SIZE } from 'utils/organizationTagsUtils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WarningAmberRounded } from '@mui/icons-material';
import TagNode from './TagNode';
import InfiniteScrollLoader from 'components/InfiniteScrollLoader/InfiniteScrollLoader';

interface InterfaceUserTagsAncestorData {
  _id: string;
  name: string;
}

/**
 * Props for the `AssignToTags` component.
 */
export interface InterfaceTagActionsProps {
  tagActionsModalIsOpen: boolean;
  hideTagActionsModal: () => void;
  tagActionType: TagActionType;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}

const TagActions: React.FC<InterfaceTagActionsProps> = ({
  tagActionsModalIsOpen,
  hideTagActionsModal,
  tagActionType,
  t,
  tCommon,
}) => {
  const { orgId, tagId: currentTagId } = useParams();

  const {
    data: orgUserTagsData,
    loading: orgUserTagsLoading,
    error: orgUserTagsError,
    fetchMore: orgUserTagsFetchMore,
  }: InterfaceOrganizationTagsQuery = useQuery(ORGANIZATION_USER_TAGS_LIST, {
    variables: {
      id: orgId,
      first: TAGS_QUERY_PAGE_SIZE,
    },
    skip: !tagActionsModalIsOpen,
  });

  const loadMoreUserTags = (): void => {
    orgUserTagsFetchMore({
      variables: {
        first: TAGS_QUERY_PAGE_SIZE,
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

  const userTagsList = orgUserTagsData?.organizations[0]?.userTags.edges.map(
    (edge) => edge.node,
  );

  const [checkedTagId, setCheckedTagId] = useState<string | null>(null);
  const [uncheckedTagId, setUncheckedTagId] = useState<string | null>(null);

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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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

  const addAncestorTags = (tagId: string): void => {
    setCheckedTagId(tagId);
    setUncheckedTagId(null);
  };

  const removeAncestorTags = (tagId: string): void => {
    setUncheckedTagId(tagId);
    setCheckedTagId(null);
  };

  const selectTag = (tag: InterfaceTagData): void => {
    const newCheckedTags = new Set(checkedTags);

    setSelectedTags((selectedTags) => [...selectedTags, tag]);
    newCheckedTags.add(tag._id);
    addAncestorTags(tag._id);

    setCheckedTags(newCheckedTags);
  };

  const deSelectTag = (tag: InterfaceTagData): void => {
    if (!selectedTags.some((selectedTag) => selectedTag._id === tag._id)) {
      /* istanbul ignore next */
      return;
    }

    const newCheckedTags = new Set(checkedTags);

    setSelectedTags(
      selectedTags.filter((selectedTag) => selectedTag._id !== tag._id),
    );
    newCheckedTags.delete(tag._id);
    removeAncestorTags(tag._id);

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

  useQuery(USER_TAG_ANCESTORS, {
    variables: { id: checkedTagId },
    onCompleted: /* istanbul ignore next */ (data) => {
      setAddAncestorTagsData(data.getUserTagAncestors.slice(0, -1)); // Update the ancestor tags data, to check the ancestor tags
    },
  });

  useQuery(USER_TAG_ANCESTORS, {
    variables: { id: uncheckedTagId },
    onCompleted: /* istanbul ignore next */ (data) => {
      setRemoveAncestorTagsData(data.getUserTagAncestors.slice(0, -1)); // Update the ancestor tags data, to uncheck the ancestor tags
    },
  });

  const [assignToTags] = useMutation(ASSIGN_TO_TAGS);
  const [removeFromTags] = useMutation(REMOVE_FROM_TAGS);

  const handleTagAction = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

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
      /* istanbul ignore next */
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
          className="bg-primary"
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
            {orgUserTagsLoading ? (
              <Loader size="sm" />
            ) : (
              <>
                <div
                  className={`d-flex flex-wrap align-items-center border bg-light-subtle rounded-3 p-2 ${styles.scrollContainer}`}
                >
                  {selectedTags.length === 0 ? (
                    <div className="text-center text-body-tertiary">
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

                <div className={`mt-4 mb-2 fs-5 ${styles.allTagsHeading}`}>
                  {t('allTags')}
                </div>

                <div
                  id="scrollableDiv"
                  data-testid="scrollableDiv"
                  style={{
                    maxHeight: 300,
                    overflow: 'auto',
                  }}
                  className={`${styles.scrContainer}`}
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
                      <div
                        className="my-2"
                        key={tag._id}
                        data-testid="orgUserTag"
                      >
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
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(): void => hideTagActionsModal()}
              data-testid="closeTagActionsModalBtn"
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" value="add" data-testid="tagActionSubmitBtn">
              {tagActionType === 'assignToTags' ? t('assign') : t('remove')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default TagActions;
