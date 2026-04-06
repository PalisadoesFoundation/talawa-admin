/**
 * subscriptions.ts
 *
 * Manages GraphQL subscription initialization and cleanup for the application.
 *
 * Responsibilities:
 * - Lazily create a single graphql-ws `Client` when `initializeSubscriptions` is
 *   called (typically when a user session becomes authenticated).
 * - Create a `GraphQLWsLink` and compose it into the Apollo Client link chain
 *   (using `split` to route `subscription` operations to the websocket and
 *   HTTP operations to the provided `httpLink`).
 * - Provide an idempotent `disposeWsClient` function to safely terminate the
 *   websocket client and allow re-initialization later (used on logout or
 *   refresh-failure cleanup).
 *
 * Important usage notes and guarantees:
 * - `configureSubscriptions(deps)` must be called once with a valid
 *   `SubscriptionDeps` object before `initializeSubscriptions()` is invoked.
 * - `initializeSubscriptions()` is guarded by an `initialized` flag and will
 *   no-op when already initialized or when `deps` are missing.
 * - `disposeWsClient()` is safe to call multiple times. It nullifies the
 *   internal `wsClient` and sets `initialized = false` immediately, then
 *   awaits the client's `dispose()` promise. This ordering avoids double-dispose
 *   races but may allow a dispose and re-init to overlap — callers should be
 *   aware of that possible transient overlap.
 * - Authentication: the `connectionParams` factory reads `window.localStorage`
 *   (via `getItem`) for a `token` value whenever it is invoked. Note that
 *   `graphql-ws` calls the `connectionParams` factory on every (re)connection,
 *   so refreshed tokens in storage and up-to-date language settings will be
 *   picked up automatically when the client reconnects. If the application
 *   uses HTTP-only cookies for auth, subscription auth must be implemented
 *   server-side by cookie/session, or the `connectionParams` logic must be
 *   adjusted accordingly.
 * - Forcing a new client: you generally do not need to call `disposeWsClient()`
 *   after a token refresh because the existing client will reconnect and the
 *   `connectionParams` factory will run again. `disposeWsClient()` is only
 *   required when you need to force creation of a brand-new `Client` instance
 *   (for example to change the websocket URL or other client options) rather
 *   than relying on graphql-ws' automatic reconnect behavior.
 */
import {
  ApolloClient,
  ApolloLink,
  type NormalizedCacheObject,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import i18n from 'utils/i18n';
import type { Client as GraphQLWsClient } from 'graphql-ws';
import { getItem, PREFIX } from 'utils/useLocalstorage';
import { BEARER_PREFIX } from 'Constant/common';
interface ISubscriptionDeps {
  client: ApolloClient<NormalizedCacheObject>;
  errorLink: ApolloLink;
  httpLink: ApolloLink;
  wsUrl: string;
}

let deps: ISubscriptionDeps | null = null;
export const configureSubscriptions = (nextDeps: ISubscriptionDeps): void => {
  if (initialized || wsClient) {
    throw new Error('Dispose subscriptions before reconfiguring them');
  }
  deps = nextDeps;
};
let initialized = false;
let wsClient: GraphQLWsClient | null = null;
/**
 * Idempotent cleanup function to dispose of the WebSocket client.
 * Safely handles errors and ensures the wsClient is nullified after disposal.
 * Safe to call multiple times.
 */
export const disposeWsClient = async (): Promise<void> => {
  if (!wsClient) {
    initialized = false;
    return;
  }

  const clientToDispose = wsClient;
  wsClient = null;
  initialized = false;
  deps?.client.setLink(ApolloLink.from([deps.errorLink, deps.httpLink]));
  try {
    await clientToDispose.dispose();
  } catch (error) {
    console.error('Error disposing WebSocket client:', error);
  }
};

export const initializeSubscriptions = (): void => {
  if (initialized || !deps) return;
  // create and keep a reference to the graphql-ws client so we can dispose it later
  wsClient = createClient({
    url: deps.wsUrl,
    connectionParams: () => {
      let token: string | null = null;
      try {
        token = getItem<string>(PREFIX, 'token');
      } catch {
        token = null;
      }

      return {
        ...(token ? { authorization: BEARER_PREFIX + token } : {}),
        'Accept-Language': i18n.language,
      };
    },
  });

  const wsLink = new GraphQLWsLink(wsClient);

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    deps.httpLink,
  );

  deps.client.setLink(ApolloLink.from([deps.errorLink, splitLink]));
  initialized = true;
};
