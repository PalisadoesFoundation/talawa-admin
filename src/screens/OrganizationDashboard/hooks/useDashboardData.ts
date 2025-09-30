/**
 * Custom hook for managing organization dashboard data fetching and state.
 * Handles all GraphQL queries and data aggregation for dashboard statistics.
 */
import { useQuery } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
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
 * function to handle blocked users pagination update query
 */
export const updateBlockedUsersQuery = (
  prev: Record<string, unknown>,
  {
    fetchMoreResult,
  }: {
    fetchMoreResult?: Record<string, unknown> | null;
  },
) => {
  const prevData = prev as {
    organization?: {
      blockedUsers?: {
        edges: unknown[];
        pageInfo: unknown;
      };
    };
  };
  const fetchMoreData = fetchMoreResult as
    | {
        organization?: {
          blockedUsers?: {
            edges: unknown[];
            pageInfo: unknown;
          };
        };
      }
    | undefined;

  if (!fetchMoreData || !fetchMoreData.organization?.blockedUsers) {
    return prev;
  }
  if (!prevData?.organization?.blockedUsers) {
    return fetchMoreResult;
  }

  const prevEdges = prevData.organization.blockedUsers.edges || [];
  const newEdges = fetchMoreData.organization.blockedUsers.edges || [];

  return {
    ...prev,
    organization: {
      ...prevData.organization,
      blockedUsers: {
        ...prevData.organization.blockedUsers,
        edges: [...prevEdges, ...newEdges],
        pageInfo: fetchMoreData.organization.blockedUsers.pageInfo,
      },
    },
  };
};

/**
 * function to handle venues pagination update query
 */
export const updateVenuesQuery = (
  prev: Record<string, unknown>,
  {
    fetchMoreResult,
  }: {
    fetchMoreResult?: Record<string, unknown> | null;
  },
) => {
  const prevData = prev as {
    organization?: {
      venues?: {
        edges: unknown[];
        pageInfo: unknown;
      };
    };
  };
  const fetchMoreData = fetchMoreResult as
    | {
        organization?: {
          venues?: {
            edges: unknown[];
            pageInfo: unknown;
          };
        };
      }
    | undefined;

  if (!fetchMoreData || !fetchMoreData.organization?.venues) {
    return prev;
  }
  if (!prevData?.organization?.venues) {
    return fetchMoreResult;
  }

  const prevEdges = prevData.organization.venues.edges || [];
  const newEdges = fetchMoreData.organization.venues.edges || [];

  return {
    ...prev,
    organization: {
      ...prevData.organization,
      venues: {
        ...prevData.organization.venues,
        edges: [...prevEdges, ...newEdges],
        pageInfo: fetchMoreData.organization.venues.pageInfo,
      },
    },
  };
};

/**
 * function to handle events pagination update query
 */
export const updateEventsQuery = (
  prev: Record<string, unknown>,
  {
    fetchMoreResult,
  }: {
    fetchMoreResult?: Record<string, unknown> | null;
  },
) => {
  const prevData = prev as {
    organization?: {
      events?: {
        edges: unknown[];
        pageInfo: unknown;
      };
    };
  };
  const fetchMoreData = fetchMoreResult as
    | {
        organization?: {
          events?: {
            edges: unknown[];
            pageInfo: unknown;
          };
        };
      }
    | undefined;

  if (!fetchMoreData || !fetchMoreData.organization?.events) {
    return prev;
  }
  if (!prevData?.organization?.events) {
    return fetchMoreResult;
  }

  const prevEdges = prevData.organization.events.edges || [];
  const newEdges = fetchMoreData.organization.events.edges || [];

  return {
    ...prev,
    organization: {
      ...prevData.organization,
      events: {
        ...prevData.organization.events,
        edges: [...prevEdges, ...newEdges],
        pageInfo: fetchMoreData.organization.events.pageInfo,
      },
    },
  };
};

/**
 * Props interface for the dashboard data hook
 */
export interface InterfaceUseDashboardDataProps {
  orgId: string | undefined;
  tErrors: (key: string) => string;
}

/**
 * Return type for the dashboard data hook
 */
export interface InterfaceDashboardData {
  memberCount: number;
  adminCount: number;
  eventCount: number;
  blockedCount: number;
  venueCount: number;
  postsCount: number;
  upcomingEvents: IEvent[];
  membershipRequestData: {
    organization: {
      membershipRequests: Array<{
        _id: string;
        user: {
          name: string;
          emailAddress: string;
        };
      }>;
    };
  } | null;
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
}: InterfaceUseDashboardDataProps): InterfaceDashboardData {
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
        name_contains: '',
      },
      skip: !orgId,
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
    skip: !orgId,
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
    skip: !orgId,
  });

  // Posts query
  const { loading: postLoading, error: postError } = useQuery<{
    organization: {
      posts: InterfaceOrganizationPostsConnectionEdgePg;
    };
  }>(GET_ORGANIZATION_POSTS_PG, {
    variables: { id: orgId, first: 5 },
    skip: !orgId,
  });

  // Posts count query
  const { data: postCountData } = useQuery(GET_ORGANIZATION_POSTS_COUNT_PG, {
    variables: { id: orgId },
    skip: !orgId,
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
    skip: !orgId,
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
    skip: !orgId,
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
            if (!fetchMoreResult || !fetchMoreResult.organization?.members)
              return prev;
            if (!prev?.organization?.members) return fetchMoreResult;

            const prevEdges = prev.organization.members.edges || [];
            const newEdges = fetchMoreResult.organization.members.edges || [];

            const updatedData = {
              ...prev,
              organization: {
                ...prev.organization,
                members: {
                  ...prev.organization.members,
                  edges: [...prevEdges, ...newEdges],
                  pageInfo: fetchMoreResult.organization.members.pageInfo,
                },
              },
            };

            return updatedData;
          },
        });
      } else {
        hasFetchedAllMembers.current = true;

        // Calculate counts immediately
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

  // Recalculate member counts when pagination completes
  useEffect(() => {
    if (orgMemberData && hasFetchedAllMembers.current) {
      const allMembers = orgMemberData.organization?.members?.edges || [];
      let newAdminCount = 0;

      allMembers.forEach(
        (member: InterfaceOrganizationMembersConnectionEdgePg) => {
          if (member.node.role === 'administrator') {
            newAdminCount += 1;
          }
        },
      );

      setMemberCount(allMembers.length);
      setAdminCount(newAdminCount);
    }
  }, [orgMemberData, hasFetchedAllMembers]);

  // Events data processing
  useEffect(() => {
    if (eventData && !hasFetchedAllEvents.current) {
      const events = eventData.organization?.events?.edges || [];
      const hasNextPage = eventData.organization?.events?.pageInfo?.hasNextPage;
      const endCursor = eventData.organization?.events?.pageInfo?.endCursor;

      if (hasNextPage && endCursor) {
        fetchMoreEvents({
          variables: { id: orgId, first: 32, after: endCursor },
          updateQuery: updateEventsQuery,
        });
      } else {
        hasFetchedAllEvents.current = true;
        setEventCount(events.length);

        const upcomingEventsList = events
          .filter(
            (edge: { node: { startAt: string } }) =>
              new Date(edge.node.startAt) > new Date(),
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
          updateQuery: updateBlockedUsersQuery,
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
          updateQuery: updateVenuesQuery,
        });
      } else {
        hasFetchedAllVenues.current = true;
        setVenueCount(venues.length);
      }
    }
  }, [venuesData, fetchMoreVenues, orgId]);

  // Error handling - consolidated into single effect
  useEffect(() => {
    const errors = [
      orgMemberError,
      eventError,
      postError,
      blockedUsersError,
      venuesError,
    ];
    if (errors.some((error) => error)) {
      toast.error(tErrors('errorLoading'));
    }
  }, [
    orgMemberError,
    eventError,
    postError,
    blockedUsersError,
    venuesError,
    tErrors,
  ]);

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
