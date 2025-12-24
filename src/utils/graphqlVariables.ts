/**
 * Utility functions for GraphQL query variables.
 * @module utils/graphqlVariables
 */
import { isInviteOnlyEnabled } from './featureFlags';

/**
 * Adds the includeInviteOnly variable to query variables based on feature flag.
 * Use this helper when calling queries that support the isInviteOnly field to ensure
 * the field is only queried when the backend supports it.
 *
 * @example
 * ```ts
 * const { data } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
 *   variables: addInviteOnlyVariable({
 *     id: orgId,
 *     first: 10,
 *   }),
 * });
 * ```
 *
 * @param variables - Existing query variables
 * @returns Variables object with includeInviteOnly added based on REACT_APP_ENABLE_INVITE_ONLY
 */
export const addInviteOnlyVariable = <T extends Record<string, unknown>>(
  variables: T,
): T & { includeInviteOnly: boolean } => {
  return {
    ...variables,
    includeInviteOnly: isInviteOnlyEnabled(),
  };
};
