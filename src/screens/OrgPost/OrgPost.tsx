import { useQuery } from '@apollo/client';
import {
  ORGANIZATION_POST_LIST_WITH_VOTES,
  GET_POSTS_BY_ORG,
} from 'GraphQl/Queries/Queries';
import { ORGANIZATION_PINNED_POST_LIST } from 'GraphQl/Queries/OrganizationQueries';

import Loader from 'components/Loader/Loader';
import { useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import useLocalStorage from 'utils/useLocalstorage';
import { toast } from 'react-toastify';
import styles from 'style/app-fixed.module.css';
import PostsRenderer from './Posts';
import type {
  InterfacePostEdge,
  InterfaceOrganizationPostListData,
  InterfacePost,
} from '../../types/Post/interface';

import CreatePostModal from './CreatePostModal';

/**
 * OrgPost Component
 * This component is responsible for rendering and managing organization posts.
 */

function OrgPost(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgPost' });
  const { getItem } = useLocalStorage();

  document.title = t('title');

  const [postmodalisOpen, setPostModalIsOpen] = useState(false);
  const [sortingOption, setSortingOption] = useState('None');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [displayPosts, setDisplayPosts] = useState<InterfacePost[]>([]);
  const { orgId: currentUrl } = useParams();
  const [after, setAfter] = useState<string | null | undefined>(null);
  const [before, setBefore] = useState<string | null | undefined>(null);
  const [first, setFirst] = useState<number | null>(6);
  const [last, setLast] = useState<number | null>(null);
  const [sortedPosts, setSortedPosts] = useState<InterfacePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<InterfacePostEdge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const {
    data,
    loading,
    error,
    refetch: refetchPosts,
  } = useQuery(GET_POSTS_BY_ORG, {
    variables: { input: { organizationId: currentUrl } },
    fetchPolicy: 'network-only',
  });

  const showInviteModal = (): void => {
    setPostModalIsOpen(true);
  };

  const hideInviteModal = (): void => {
    setPostModalIsOpen(false);
  };

  const userId: string | null = getItem('userId');
  const {
    data: orgPostListData,
    loading: orgPostListLoading,
    error: orgPostListError,
    refetch,
  } = useQuery<InterfaceOrganizationPostListData>(
    ORGANIZATION_POST_LIST_WITH_VOTES,
    {
      variables: {
        input: { id: currentUrl as string },
        userId: userId,
        after: after ?? null,
        before: before ?? null,
        first: first,
        last: last,
      },
    },
  );
  const {
    data: orgPinnedPostListData,
    loading: orgPinnedPostListLoading,
    error: orgPinnedPostListError,
  } = useQuery<InterfaceOrganizationPostListData>(
    ORGANIZATION_PINNED_POST_LIST,
    {
      variables: {
        input: { id: currentUrl as string },
        first: first,
        last: last,
      },
    },
  );

  useEffect(() => {
    if (sortingOption !== 'None' && sortedPosts.length > 0) {
      const startIndex = (currentPage - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
      setDisplayPosts(paginatedPosts);
    }
  }, [currentPage, sortingOption, sortedPosts]);

  useEffect(() => {
    if (orgPostListError) toast.error('Organization post list error:');
  }, [orgPostListError]);

  useEffect(() => {
    if (orgPinnedPostListError) toast.error(t('pinnedPostsLoadError'));
  }, [orgPinnedPostListError]);

  useEffect(() => {
    if (data?.postsByOrganization) {
      const posts = [...data.postsByOrganization];

      // Sort posts based on the selected option
      const sorted = posts.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortingOption === 'oldest' ? dateA - dateB : dateB - dateA;
      });

      setSortedPosts(sorted);
    }
  }, [data, sortingOption]);

  if (orgPostListLoading || orgPinnedPostListLoading) {
    return <Loader />;
  }

  const content = (
    <div
      data-testid="posts-renderer"
      data-loading={String(loading)}
      data-is-filtering={String(isFiltering)}
      data-sorting-option={sortingOption}
    >
      {error && <div data-testid="not-found">Error loading post</div>}
      <PostsRenderer
        loading={loading}
        error={error}
        data={isFiltering ? data : orgPostListData}
        pinnedPostData={orgPinnedPostListData?.organization?.pinnedPosts?.edges}
        isFiltering={isFiltering}
        searchTerm={searchTerm}
        sortingOption={sortingOption}
        displayPosts={displayPosts}
        refetch={refetch}
      />
    </div>
  );
  const handleSorting = (option: string | number): void => {
    setCurrentPage(1);
    setSortingOption(option as string);

    if (option === 'None') {
      setDisplayPosts([]);

      refetchPosts({ input: { organizationId: currentUrl } });
      return;
    }

    if (!data?.postsByOrganization) {
      return;
    }

    const posts = [...data.postsByOrganization];
    const sorted = posts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return option === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    setSortedPosts(sorted);

    const initialPosts = sorted.slice(0, postsPerPage);
    setDisplayPosts(initialPosts);
  };

  const handleSearch = async (term: string): Promise<void> => {
    setSearchTerm(term);

    try {
      const { data: searchData } = await refetchPosts({
        input: { organizationId: currentUrl },
      });
      console.log(filteredPosts);
      if (!term.trim()) {
        setIsFiltering(false);
        setFilteredPosts([]);
        return;
      }

      if (searchData?.postsByOrganization) {
        setIsFiltering(true);

        const filtered = searchData.postsByOrganization.filter(
          (post: InterfacePost) =>
            post.caption?.toLowerCase().includes(term.toLowerCase()),
        );
        setFilteredPosts(filtered);
      }
    } catch {
      toast.error('Error searching posts');
      setIsFiltering(false);
    }
  };

  const totalPages =
    sortingOption === 'None'
      ? Math.ceil(
          (orgPostListData?.organization?.posts?.totalCount || 0) /
            postsPerPage,
        )
      : Math.ceil(sortedPosts.length / postsPerPage);

  const hasPreviousPage =
    sortingOption === 'None'
      ? orgPostListData?.organization?.posts?.pageInfo?.hasPreviousPage
      : currentPage > 1;

  const hasNextPage =
    sortingOption === 'None'
      ? orgPostListData?.organization?.posts?.pageInfo?.hasNextPage
      : currentPage < totalPages;

  // Update the totalPages calculation

  const handleNextPage = (): void => {
    if (sortingOption === 'None') {
      const endCursor =
        orgPostListData?.organization?.posts?.pageInfo?.endCursor;
      if (endCursor) {
        setAfter(endCursor);
        setBefore(null);
        setFirst(postsPerPage);
        setLast(null);
        setCurrentPage((prev) => prev + 1);
      }
    } else {
      const maxPage = Math.ceil(sortedPosts.length / postsPerPage);
      if (currentPage < maxPage) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  const handlePreviousPage = (): void => {
    if (sortingOption === 'None') {
      const startCursor =
        orgPostListData?.organization?.posts?.pageInfo?.startCursor;
      if (startCursor) {
        setBefore(startCursor);
        setAfter(null);
        setFirst(null);
        setLast(postsPerPage);
        setCurrentPage((prev) => prev - 1);
      }
    } else {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  return (
    <>
      <Row className={styles.head}>
        <div className={styles.mainpagerightOrgPost}>
          <PageHeader
            search={{
              placeholder: t('searchTitle'),
              onSearch: handleSearch,
              inputTestId: 'searchByName',
            }}
            sorting={[
              {
                title: 'Sort Post',
                options: [
                  { label: 'Latest', value: 'latest' },
                  { label: 'Oldest', value: 'oldest' },
                  { label: 'None', value: 'None' },
                ],
                selected: sortingOption,
                onChange: handleSorting,
                testIdPrefix: 'sortpost-toggle',
              },
            ]}
            showEventTypeFilter={false}
            actions={
              <Button
                variant="success"
                onClick={showInviteModal}
                data-testid="createPostModalBtn"
                data-cy="createPostModalBtn"
                className={`${styles.createButton} mb-2`}
              >
                <AddIcon sx={{ fontSize: '20px', marginRight: '6px' }} />
                {t('createPost')}
              </Button>
            }
          />

          <div className={`row ${styles.list_box}`}>{content}</div>
        </div>
        <div className="row m-lg-1 d-flex justify-content-center w-100">
          <div className="col-auto">
            <Button
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage}
              data-testid="previous-page-button"
            >
              Previous
            </Button>
          </div>
          <div className="col-auto"></div>
          <div className="col-auto">
            <Button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              data-testid="next-page-button"
            >
              Next
            </Button>
          </div>
        </div>
      </Row>

      <CreatePostModal
        show={postmodalisOpen}
        onHide={hideInviteModal}
        refetch={refetch}
        orgId={currentUrl}
      />
    </>
  );
}

export default OrgPost;
