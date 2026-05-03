/**
 * Advertisements component for managing and displaying advertisements
 * within an organization. This component includes features such as
 * infinite scrolling, tabbed views for active and archived advertisements,
 * and a search bar for filtering advertisements.
 *
 * @returns - JSX.Element The rendered Advertisements component.
 *
 * @remarks
 * - Utilizes Apollo Client's `useQuery` for fetching advertisement data.
 * - Supports infinite scrolling for loading more advertisements.
 * - Displays advertisements in two tabs: active and archived.
 * - Includes a search bar and advertisement registration functionality.
 *
 * dependencies
 * - `react`, `react-router-dom`, `react-i18next`
 * - `@apollo/client` for GraphQL queries.
 * - `InfiniteScroll` for infinite scrolling functionality.
 *
 * @example
 * ```tsx
 * <Advertisements />
 * ```
 *
 * @remarks
 * The component fetches advertisements using the `ORGANIZATION_ADVERTISEMENT_LIST`
 * GraphQL query and organizes them into active and archived categories based on
 * their `endDate`.
 *
 * @see AdvertisementEntry - Renders individual advertisements.
 * @see AdvertisementRegister - Handles advertisement creation.
 */

import React, { useEffect, useState, useCallback } from 'react';
import styles from './Advertisements.module.css';
import { useQuery } from '@apollo/client';
import { ORGANIZATION_ADVERTISEMENT_LIST } from 'GraphQl/Queries/Queries';
import { useTranslation } from 'react-i18next';
import AdvertisementEntry from './core/AdvertisementEntry/AdvertisementEntry';
import AdvertisementRegister from './core/AdvertisementRegister/AdvertisementRegister';
import { useParams } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { Advertisement } from 'types/AdminPortal/Advertisement/type';
import LoadingState from 'shared-components/LoadingState/LoadingState';
import { AdvertisementSkeleton } from './skeleton/AdvertisementSkeleton';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import Toolbar from 'shared-components/Toolbar/Toolbar';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

export default function Advertisements(): JSX.Element {
  const { orgId: currentOrgId } = useParams<{ orgId: string }>();
  const { t } = useTranslation('translation', { keyPrefix: 'advertisement' });
  const { t: tErrors } = useTranslation('errors');

  document.title = t('title');

  const [afterActive, setAfterActive] = useState<string | null | undefined>(
    null,
  );
  const [afterCompleted, setAfterCompleted] = useState<
    string | null | undefined
  >(null);

  const {
    data: orgCompletedAdvertisementListData,
    loading: completedLoading,
    error: completedError,
  } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      id: currentOrgId,
      after: afterCompleted,
      first: 6,
      where: { isCompleted: true },
    },
    skip: !currentOrgId,
  });

  const {
    data: orgActiveAdvertisementListData,
    loading: activeLoading,
    error: activeError,
  } = useQuery(ORGANIZATION_ADVERTISEMENT_LIST, {
    variables: {
      id: currentOrgId,
      after: afterActive,
      first: 6,
      where: { isCompleted: false },
    },
    skip: !currentOrgId,
  });

  if (completedError || activeError) {
    NotificationToast.error(t('failedToFetchAdvertisements'));
  }

  const [completedAdvertisements, setCompletedAdvertisements] = useState<
    Advertisement[]
  >([]);
  const [activeAdvertisements, setActiveAdvertisements] = useState<
    Advertisement[]
  >([]);

  useEffect(() => {
    if (
      orgCompletedAdvertisementListData?.organization?.advertisements?.edges
    ) {
      const ads: Advertisement[] =
        orgCompletedAdvertisementListData.organization.advertisements.edges.map(
          (edge: { node: Advertisement }) => edge.node,
        );
      if (afterCompleted) {
        setCompletedAdvertisements((prevAds) => {
          const unique = mergedAdvertisements(prevAds, ads);
          return unique;
        });
      } else {
        setCompletedAdvertisements(ads);
      }
    }
  }, [orgCompletedAdvertisementListData, afterCompleted]);

  useEffect(() => {
    if (orgActiveAdvertisementListData?.organization?.advertisements?.edges) {
      const ads: Advertisement[] =
        orgActiveAdvertisementListData.organization.advertisements.edges.map(
          (edge: { node: Advertisement }) => edge.node,
        );
      if (afterActive) {
        setActiveAdvertisements((prevAds) => {
          const unique = mergedAdvertisements(prevAds, ads);
          return unique;
        });
      } else {
        setActiveAdvertisements(ads);
      }
    }
  }, [orgActiveAdvertisementListData, afterActive]);

  /**
   * Fetches more completed advertisements for infinite scrolling.
   */
  async function loadMoreCompletedAdvertisements(): Promise<void> {
    const newAfter =
      orgCompletedAdvertisementListData?.organization?.advertisements?.pageInfo
        ?.endCursor || null;

    if (newAfter) {
      setAfterCompleted(newAfter);
    }
  }

  /**
   * Fetches more active advertisements for infinite scrolling.
   */
  async function loadMoreActiveAdvertisements(): Promise<void> {
    const newAfter =
      orgActiveAdvertisementListData?.organization?.advertisements?.pageInfo
        ?.endCursor || null;

    if (newAfter) {
      setAfterActive(newAfter);
    }
  }

  /**
   * Merges two arrays of advertisements, ensuring uniqueness based on advertisement ID.
   * @param prevAds - Previous advertisements.
   * @param ads - New advertisements to merge.
   * @returns Merged array of unique advertisements.
   */
  function mergedAdvertisements(
    prevAds: Advertisement[],
    ads: Advertisement[],
  ): Advertisement[] {
    const merged = [...prevAds, ...ads];
    const unique = Array.from(
      new Map(merged.map((ad) => [ad.id, ad])).values(),
    );
    return unique;
  }

  const loading = activeLoading || completedLoading; // if any of them is in loading state

  const [activeTab, setActiveTab] = useState<'activeAds' | 'archivedAds'>(
    'archivedAds',
  );

  const handleTabClick = useCallback(
    (tab: 'activeAds' | 'archivedAds') => {
      setActiveTab(tab);
    },
    [],
  );

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <div
        data-testid="advertisements"
        className={styles.rowAdvertisements}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}
      >
        <div className={styles.containerAdvertisements}>
          {loading && (
            <LoadingState variant="spinner" isLoading={loading}>
              <div />
            </LoadingState>
          )}
          <div className={styles.colAdvertisements}>
            <Toolbar
              search={{
                placeholder: t('searchAdvertisements'),
                onSearch: (value) => {
                  const searchValue = value.toLowerCase();
                  const filteredActiveAds = activeAdvertisements.filter(
                    (ad) =>
                      ad.name.toLowerCase().includes(searchValue) ||
                      (ad.description ?? '')
                        .toLowerCase()
                        .includes(searchValue),
                  );
                  const filteredCompletedAds = completedAdvertisements.filter(
                    (ad) =>
                      ad.name.toLowerCase().includes(searchValue) ||
                      (ad.description ?? '')
                        .toLowerCase()
                        .includes(searchValue),
                  );

                  setActiveAdvertisements(filteredActiveAds);
                  setCompletedAdvertisements(filteredCompletedAds);
                },
                inputTestId: 'searchname',
                buttonTestId: 'searchButton',
              }}
              actions={
                <AdvertisementRegister
                  setAfterActive={setAfterActive}
                  setAfterCompleted={setAfterCompleted}
                />
              }
            />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => handleTabClick('activeAds')}
                style={{
                  padding: '8px 16px',
                  fontWeight: activeTab === 'activeAds' ? 'bold' : 'normal',
                  borderBottom:
                    activeTab === 'activeAds' ? '2px solid currentColor' : 'none',
                  background: 'none',
                  border: 'none',
                  borderBottomWidth: activeTab === 'activeAds' ? '2px' : '0',
                  borderBottomStyle: 'solid',
                  cursor: 'pointer',
                }}
              >
                {t('activeAds')}
              </button>
              <button
                type="button"
                onClick={() => handleTabClick('archivedAds')}
                style={{
                  padding: '8px 16px',
                  fontWeight: activeTab === 'archivedAds' ? 'bold' : 'normal',
                  background: 'none',
                  border: 'none',
                  borderBottomWidth: activeTab === 'archivedAds' ? '2px' : '0',
                  borderBottomStyle: 'solid',
                  cursor: 'pointer',
                }}
              >
                {t('archivedAds')}
              </button>
            </div>

            {activeTab === 'activeAds' && (
              <div style={{ paddingTop: '16px', margin: '8px' }}>
                {activeAdvertisements.length === 0 ? (
                  <div className={styles.pMessageAdvertisement}>
                    {t('pMessage')}
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={activeAdvertisements.length}
                    next={loadMoreActiveAdvertisements}
                    loader={<AdvertisementSkeleton />}
                    hasMore={
                      orgActiveAdvertisementListData?.organization
                        ?.advertisements?.pageInfo?.hasNextPage ?? false
                    }
                    className={styles.listBoxAdvertisements}
                  >
                    <div className={styles.justifyspAdvertisements}>
                      {activeAdvertisements.map((ad) => {
                        return (
                          <AdvertisementEntry
                            key={ad.id}
                            advertisement={ad}
                            setAfterActive={setAfterActive}
                            setAfterCompleted={setAfterCompleted}
                          />
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                )}
              </div>
            )}

            {activeTab === 'archivedAds' && (
              <div style={{ paddingTop: '16px', margin: '8px' }}>
                {completedAdvertisements.length === 0 ? (
                  <div className={styles.pMessageAdvertisement}>
                    {t('pMessage')}
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={completedAdvertisements.length}
                    next={loadMoreCompletedAdvertisements}
                    loader={<AdvertisementSkeleton />}
                    hasMore={
                      orgCompletedAdvertisementListData?.organization
                        ?.advertisements?.pageInfo?.hasNextPage ?? false
                    }
                    className={styles.listBoxAdvertisements}
                  >
                    <div className={styles.justifyspAdvertisements}>
                      {completedAdvertisements.map((ad) => {
                        return (
                          <AdvertisementEntry
                            key={ad.id}
                            advertisement={ad}
                            setAfterActive={setAfterActive}
                            setAfterCompleted={setAfterCompleted}
                          />
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
}
