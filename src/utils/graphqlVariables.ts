/**
 * Utility functions for GraphQL query variables.
 * @module utils/graphqlVariables
 */
import { isInviteOnlyEnabled } from './featureFlags';

/**
 * Adds the includeInviteOnly variable to query variables based on feature flag.
 * For mutations with an input object, also conditionally includes input.isInviteOnly
 * to ensure backward compatibility with older backends.
 *
 * Use this helper when calling queries or mutations that support the isInviteOnly field
 * to ensure the field is only queried/sent when the backend supports it.
 *
 * @example
 * ```ts
 * // For queries
 * const { data } = useQuery(GET_ORGANIZATION_EVENTS_PG, {
 *   variables: addInviteOnlyVariable({
 *     id: orgId,
 *     first: 10,
 *   }),
 * });
 *
 * // For mutations
 * await create({
 *   variables: addInviteOnlyVariable({
 *     input: {
 *       name: 'Event',
 *       isInviteOnly: true, // Will be omitted if feature flag is disabled
 *     },
 *   }),
 * });
 * ```
 *
 * @param variables - Existing query/mutation variables
 * @returns Variables object with includeInviteOnly added and input.isInviteOnly conditionally included
 */
export const addInviteOnlyVariable = <T extends Record<string, unknown>>(
  variables: T,
): T & { includeInviteOnly: boolean } => {
  const featureEnabled = isInviteOnlyEnabled();

  // For mutations with input object, conditionally include input.isInviteOnly
  if (
    'input' in variables &&
    typeof variables.input === 'object' &&
    variables.input !== null
  ) {
    const input = { ...variables.input } as Record<string, unknown>;

    // If feature is disabled, remove isInviteOnly from input to avoid backend errors
    if (!featureEnabled && 'isInviteOnly' in input) {
      const inputWithoutInviteOnly = { ...input };
      delete inputWithoutInviteOnly.isInviteOnly;
      return {
        ...variables,
        input: inputWithoutInviteOnly,
        includeInviteOnly: featureEnabled,
      } as T & { includeInviteOnly: boolean };
    }
  }

  return {
    ...variables,
    includeInviteOnly: featureEnabled,
  };
};
