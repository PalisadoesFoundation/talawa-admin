import React, { useEffect, useState } from 'react';
import OrgPeopleOrganizationsCard from 'components/OrgPeopleOrganizationsCard/OrgPeopleOrganizationsCard';
import type {
  InterfaceMemberOrganization,
  InterfaceOrgConnectionInfoType,
  InterfaceOrgConnectionType,
  InterfaceUserType,
} from 'utils/interfaces';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './MemberOrganization.module.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';

/**
 * MemberOrganization component displays the details of a member organization.
 *
 * This component:
 * - Uses the `useTranslation` hook for translations.
 * - Accepts props of type `InterfaceMemberOrganization`.
 * - Manages state for loading, search, and pagination.
 * - Retrieves `superAdmin` and `adminFor` from local storage.
 * - Extracts `orgId` from URL parameters.
 * - Fetches the user organization list and organization connection list using GraphQL queries.
 * - Implements infinite scroll to load more data.
 *
 * @param props - The properties passed to the component, including organization details.
 * @returns A JSX element representing the member organization details.
 */

const MemberOrganization: React.FC<InterfaceMemberOrganization> = (props) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'memberOrganization',
  });

  const { t: tCommon } = useTranslation('common');

  const { userId } = props;

  const perPageResult = 8;
  const [isLoading, setIsLoading] = useState(true);

  const [hasMore, sethasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchByName, setSearchByName] = useState('');

  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');

  const { orgId: currentUrl } = useParams();

  const {
    data: userData,
    error: errorUser,
  }: {
    data: InterfaceUserType | undefined;
    loading: boolean;
    error?: Error | undefined;
  } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { userId },
    context: {
      headers: { authorization: `Bearer ${getItem('token')}` },
    },
  });

  const {
    data: orgsData,
    loading,
    error: errorList,
    refetch: refetchOrgs,
    fetchMore,
  }: {
    data: InterfaceOrgConnectionType | undefined;
    loading: boolean;
    error?: Error | undefined;
    refetch: () => void;
    fetchMore: any;
  } = useQuery(ORGANIZATION_CONNECTION_LIST, {
    variables: {
      first: perPageResult,
      skip: 0,
      filter: searchByName,
      orderBy: 'createdAt_ASC',
    },
    notifyOnNetworkStatusChange: true,
  });
  useEffect(() => {
    setIsLoading(loading && isLoadingMore);
  }, [loading]);

  /* istanbul ignore next */
  const isAdminForCurrentOrg = (
    currentOrg: InterfaceOrgConnectionInfoType,
  ): boolean => {
    if (adminFor.length === 1) {
      return adminFor[0]._id === currentOrg._id;
    } else {
      return (
        adminFor.some(
          (org: { _id: string; name: string; image: string | null }) =>
            org._id === currentOrg._id,
        ) ?? false
      );
    }
  };

  /* istanbul ignore next */
  if (errorList) {
    window.location.assign('/');
  }

  /* istanbul ignore next */
  const loadMoreOrganizations = (): void => {
    setIsLoadingMore(true);
    fetchMore({
      variables: {
        skip: orgsData?.organizationsConnection.length || 0,
      },
      updateQuery: (
        prev:
          | { organizationsConnection: InterfaceOrgConnectionType[] }
          | undefined,
        {
          fetchMoreResult,
        }: {
          fetchMoreResult:
            | { organizationsConnection: InterfaceOrgConnectionType[] }
            | undefined;
        },
      ):
        | { organizationsConnection: InterfaceOrgConnectionType[] }
        | undefined => {
        setIsLoadingMore(false);
        if (!fetchMoreResult) return prev;
        if (fetchMoreResult.organizationsConnection.length < perPageResult) {
          sethasMore(false);
        }
        return {
          organizationsConnection: [
            ...(prev?.organizationsConnection || []),
            ...(fetchMoreResult.organizationsConnection || []),
          ],
        };
      },
    });
  };

  return (
    <div className={styles.container}>
      {!isLoading &&
      (!orgsData?.organizationsConnection ||
        orgsData.organizationsConnection.length === 0) &&
      searchByName.length === 0 &&
      (!userData || adminFor.length === 0 || superAdmin) ? (
        <div className={styles.notFound}>
          <h3 className="m-0">{t('noOrgErrorTitle')}</h3>
          <h6 className="text-secondary">{t('noOrgErrorDescription')}</h6>
        </div>
      ) : !isLoading &&
        orgsData?.organizationsConnection.length == 0 &&
        /* istanbul ignore next */
        searchByName.length > 0 ? (
        /* istanbul ignore next */
        <div className={styles.notFound} data-testid="noResultFound">
          <h4 className="m-0">
            {tCommon('noResultsFoundFor')} &quot;{searchByName}&quot;
          </h4>
        </div>
      ) : (
        <div>
          <InfiniteScroll
            style={{ gap: '2rem' }}
            dataLength={orgsData?.organizationsConnection?.length ?? 0}
            next={loadMoreOrganizations}
            loader={
              <>
                {[...Array(perPageResult)].map((_, index) => (
                  <div key={index} className={styles.itemCard}>
                    <div className={styles.loadingWrapper}>
                      <div className={styles.innerContainer}>
                        <div
                          className={`${styles.orgImgContainer} shimmer`}
                        ></div>
                        <div className={styles.content}>
                          <h5 className="shimmer" title="Org name"></h5>
                          <h6 className="shimmer" title="Location"></h6>
                          <h6 className="shimmer" title="Admins"></h6>
                          <h6 className="shimmer" title="Members"></h6>
                        </div>
                      </div>
                      <div className={`shimmer ${styles.button}`} />
                    </div>
                  </div>
                ))}
              </>
            }
            hasMore={hasMore}
            className={styles.listBox}
            data-testid="organizations-list"
            endMessage={
              <div className={'w-100 text-center my-4'}>
                <h5 className="m-0 ">{tCommon('endOfResults')}</h5>
              </div>
            }
          >
            {userData && superAdmin
              ? orgsData?.organizationsConnection.map((item) => {
                  return (
                    <div key={item._id} className={styles.itemCard}>
                      {/* <OrgPeopleOrganizationsCard {...OrgPeopleCardProps} /> */}
                      <OrgPeopleOrganizationsCard data={item} />
                    </div>
                  );
                })
              : userData &&
                adminFor.length > 0 &&
                orgsData?.organizationsConnection.map((item) => {
                  if (isAdminForCurrentOrg(item) && item._id == currentUrl) {
                    return (
                      <div
                        key={item._id}
                        className={styles.itemCard}
                        data-testid="OrgPeopleOrganizationsCardContainer"
                      >
                        <OrgPeopleOrganizationsCard data={item} />
                      </div>
                    );
                  }
                })}
          </InfiniteScroll>
          {isLoading && (
            <>
              {[...Array(perPageResult)].map((_, index) => (
                <div key={index} className={styles.itemCard}>
                  <div className={styles.loadingWrapper}>
                    <div className={styles.innerContainer}>
                      <div
                        className={`${styles.orgImgContainer} shimmer`}
                      ></div>
                      <div className={styles.content}>
                        <h5 className="shimmer" title="Org name"></h5>
                        <h6 className="shimmer" title="Location"></h6>
                        <h6 className="shimmer" title="Admins"></h6>
                        <h6 className="shimmer" title="Members"></h6>
                      </div>
                    </div>
                    <div className={`shimmer ${styles.button}`} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberOrganization;
