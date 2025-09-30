/**
 * Custom hook for managing organization dashboard data fetching and state.
 * Handles all GraphQL queries and data aggregation for dashboard statistics.
 */
import { useQuery } from '@apollo/client';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_POSTS_PG,
  GET_ORGANIZATION_BLOCKED_USERS_PG,
  GET_ORGANIZATION_VENUES_PG,
  MEMBERSHIP_REQUEST,
} from 'GraphQl/Queries/Queries';
import type {
  IEvent,
  InterfaceOrganizationMembersConnectionEdgePg,
  InterfaceOrganizationPg,
  InterfaceOrganizationPostsConnectionEdgePg,
} from 'utils/interfaces';

/**
 * Props interface for the dashboard data hook
 */
export interface UseDashboardDataProps {
  orgId: string | undefined;
  tErrors: (key: string) => string;
}

/**
 * Return type for the dashboard data hook
 */
export interface DashboardData {
  memberCount: number;
  adminCount: number;
  eventCount: number;
  blockedCount: number;
  venueCount: number;
  postsCount: number;
  upcomingEvents: IEvent[];
  membershipRequestData: any;
  loadingMembershipRequests: boolean;
  isLoading: boolean;
  hasError: boolean;
}

/**
 * Custom hook that manages all dashboard data fetching and state management.
 * Provides centralized data management for organization dashboard statistics.
 *
 * @param orgId - The organization ID to fetch data for
 * @param tErrors - Translation function for error messages
 * @returns Dashboard data and loading states
 */
export function useDashboardData({
  orgId,
  tErrors,
}: UseDashboardDataProps): DashboardData {
  const [memberCount, setMemberCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [venueCount, setVenueCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);

  const hasFetchedAllMembers = useRef(false);
  const hasFetchedAllEvents = useRef(false);
  const hasFetchedAllBlockedUsers = useRef(false);
  const hasFetchedAllVenues = useRef(false);

  // Membership requests query
  const { data: membershipRequestData, loading: loadingMembershipRequests } =
    useQuery(MEMBERSHIP_REQUEST, {
      variables: {
        input: { id: orgId },
        first: 8,
        skip: 0,
        firstName_contains: '',
      },
    });

  // Members query
  const {
    data: orgMemberData,
    loading: orgMemberLoading,
    error: orgMemberError,
    fetchMore: fetchMoreMembers,
  } = useQuery<InterfaceOrganizationPg>(GET_ORGANIZATION_MEMBERS_PG, {
    variables: { id: orgId, first: 32, after: null },
    notifyOnNetworkStatusChange: true,
  });

  // Events query
  const {
    data: eventData,
    loading: eventLoading,
    error: eventError,
    fetchMore: fetchMoreEvents,
  } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
    variables: { id: orgId, first: 50, after: null },
    notifyOnNetworkStatusChange: true,
  });

  // Posts query
  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useQuery<{
    organization: {
      posts: InterfaceOrganizationPostsConnectionEdgePg;
    };
  }>(GET_ORGANIZATION_POSTS_PG, {
    variables: { id: orgId, first: 5 },
  });

  // Posts count query
  const { data: postCountData } = useQuery(GET_ORGANIZATION_POSTS_COUNT_PG, {
    variables: { id: orgId },
  });

  // Blocked users query
  const {
    data: blockedUsersData,
    loading: blockedUsersLoading,
    error: blockedUsersError,
    fetchMore: fetchMoreBlockedUsers,
  } = useQuery(GET_ORGANIZATION_BLOCKED_USERS_PG, {
    variables: { id: orgId, first: 32, after: null },
    notifyOnNetworkStatusChange: true,
  });

  // Venues query
  const {
    data: venuesData,
    loading: venuesLoading,
    error: venuesError,
    fetchMore: fetchMoreVenues,
  } = useQuery(GET_ORGANIZATION_VENUES_PG, {
    variables: { id: orgId, first: 32, after: null },
    notifyOnNetworkStatusChange: true,
  });

  // Members data processing
  useEffect(() => {
    if (orgMemberData && !hasFetchedAllMembers.current) {
      const members = orgMemberData.organization?.members?.edges || [];
      const hasNextPage =
        orgMemberData.organization?.members?.pageInfo?.hasNextPage;
      const endCursor =
        orgMemberData.organization?.members?.pageInfo?.endCursor;

      if (hasNextPage && endCursor) {
        fetchMoreMembers({
          variables: { id: orgId, first: 32, after: endCursor },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...prev,
              organization: {
                ...prev.organization,
                members: {
                  ...prev.organization.members,
                  edges: [
                    ...prev.organization.members.edges,
                    ...fetchMoreResult.organization.members.edges,
                  ],
                  pageInfo: fetchMoreResult.organization.members.pageInfo,
                },
              },
            };
          },
        });
      } else {
        hasFetchedAllMembers.current = true;
        let newAdminCount = 0;
        const totalMembers = members.length;

        members.forEach(
          (member: InterfaceOrganizationMembersConnectionEdgePg) => {
            if (member.node.role === 'administrator') {
              newAdminCount += 1;
            }
          },
        );

        setMemberCount(totalMembers);
        setAdminCount(newAdminCount);
      }
    }
  }, [orgMemberData, fetchMoreMembers, orgId]);

  // Events data processing
  useEffect(() => {
    if (eventData && !hasFetchedAllEvents.current) {
      const events = eventData.organization?.events?.edges || [];
      const hasNextPage = eventData.organization?.events?.pageInfo?.hasNextPage;
      const endCursor = eventData.organization?.events?.pageInfo?.endCursor;

      if (hasNextPage && endCursor) {
        fetchMoreEvents({
          variables: { id: orgId, first: 32, after: endCursor },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...prev,
              organization: {
                ...prev.organization,
                events: {
                  ...prev.organization.events,
                  edges: [
                    ...prev.organization.events.edges,
                    ...fetchMoreResult.organization.events.edges,
                  ],
                  pageInfo: fetchMoreResult.organization.events.pageInfo,
                },
              },
            };
          },
        });
      } else {
        hasFetchedAllEvents.current = true;
        setEventCount(events.length);

        const upcomingEventsList = events
          .map((edge: any) => edge.node)
          .filter(
            (event: IEvent) => new Date(event?.node?.startAt) > new Date(),
          )
          .slice(0, 5);
        setUpcomingEvents(upcomingEventsList);
      }
    }
  }, [eventData, fetchMoreEvents, orgId]);

  // Blocked users data processing
  useEffect(() => {
    if (blockedUsersData && !hasFetchedAllBlockedUsers.current) {
      const blockedUsers =
        blockedUsersData.organization?.blockedUsers?.edges || [];
      const hasNextPage =
        blockedUsersData.organization?.blockedUsers?.pageInfo?.hasNextPage;
      const endCursor =
        blockedUsersData.organization?.blockedUsers?.pageInfo?.endCursor;

      if (hasNextPage && endCursor) {
        fetchMoreBlockedUsers({
          variables: { id: orgId, first: 32, after: endCursor },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...prev,
              organization: {
                ...prev.organization,
                blockedUsers: {
                  ...prev.organization.blockedUsers,
                  edges: [
                    ...prev.organization.blockedUsers.edges,
                    ...fetchMoreResult.organization.blockedUsers.edges,
                  ],
                  pageInfo: fetchMoreResult.organization.blockedUsers.pageInfo,
                },
              },
            };
          },
        });
      } else {
        hasFetchedAllBlockedUsers.current = true;
        setBlockedCount(blockedUsers.length);
      }
    }
  }, [blockedUsersData, fetchMoreBlockedUsers, orgId]);

  // Venues data processing
  useEffect(() => {
    if (venuesData && !hasFetchedAllVenues.current) {
      const venues = venuesData.organization?.venues?.edges || [];
      const hasNextPage =
        venuesData.organization?.venues?.pageInfo?.hasNextPage;
      const endCursor = venuesData.organization?.venues?.pageInfo?.endCursor;

      if (hasNextPage && endCursor) {
        fetchMoreVenues({
          variables: { id: orgId, first: 32, after: endCursor },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...prev,
              organization: {
                ...prev.organization,
                venues: {
                  ...prev.organization.venues,
                  edges: [
                    ...prev.organization.venues.edges,
                    ...fetchMoreResult.organization.venues.edges,
                  ],
                  pageInfo: fetchMoreResult.organization.venues.pageInfo,
                },
              },
            };
          },
        });
      } else {
        hasFetchedAllVenues.current = true;
        setVenueCount(venues.length);
      }
    }
  }, [venuesData, fetchMoreVenues, orgId]);

  // Error handling
  useEffect(() => {
    if (orgMemberError) {
      toast.error(tErrors('errorLoading'));
    }
  }, [orgMemberError, tErrors]);

  useEffect(() => {
    if (eventError) {
      toast.error(tErrors('errorLoading'));
    }
  }, [eventError, tErrors]);

  useEffect(() => {
    if (postError) {
      toast.error(tErrors('errorLoading'));
    }
  }, [postError, tErrors]);

  useEffect(() => {
    if (blockedUsersError) {
      toast.error(tErrors('errorLoading'));
    }
  }, [blockedUsersError, tErrors]);

  useEffect(() => {
    if (venuesError) {
      toast.error(tErrors('errorLoading'));
    }
  }, [venuesError, tErrors]);

  const isLoading =
    orgMemberLoading ||
    eventLoading ||
    postLoading ||
    blockedUsersLoading ||
    venuesLoading;
  const hasError = !!(
    orgMemberError ||
    eventError ||
    postError ||
    blockedUsersError ||
    venuesError
  );

  return {
    memberCount,
    adminCount,
    eventCount,
    blockedCount,
    venueCount,
    postsCount: postCountData?.organization?.postsCount || 0,
    upcomingEvents,
    membershipRequestData,
    loadingMembershipRequests,
    isLoading,
    hasError,
  };
}
