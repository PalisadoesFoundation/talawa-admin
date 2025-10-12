/**
 * Apollo cache scaffold for chat features (optional)
 *
 * This module exposes a factory to create an InMemoryCache with safe defaults
 * and commented examples for future chat-specific type policies. It is NOT wired
 * into the app by default to avoid changing current behavior.
 *
 * How to use later (optional):
 * - In `src/index.tsx`, replace the existing `new InMemoryCache({...})` with
 *   `createApolloCache()` or merge the type policies.
 */
import { InMemoryCache, type InMemoryCacheConfig } from '@apollo/client';

export function createApolloCache(config?: InMemoryCacheConfig): InMemoryCache {
  return new InMemoryCache({
    // Merge any external config first to keep this harmless by default.
    ...(config ?? {}),
    typePolicies: {
      // Keep existing app policies alongside chat policies.
      ...(config?.typePolicies ?? {}),

      Query: {
        fields: {
          // Example: ensure single chat is cached by its variable ID
          // chat: {
          //   keyArgs: ['input', ['id']],
          // },
          // Example: unread chats list - safest default is to always replace
          // the list on new responses to avoid pagination complexity.
          // Later, you can dedupe by chat.id if needed.
          // unreadChats: {
          //   keyArgs: false,
          //   merge(_existing, incoming) {
          //     return incoming;
          //   },
          // },
        },
      },

      // Example: normalize Chat and ChatMessage by id for stable references
      // Chat: {
      //   keyFields: ['id'],
      //   fields: {
      //     // Messages connection: safest default is replace; advanced merge
      //     // shown below (commented) for anchor-based pagination.
      //     messages: {
      //       // If the server varies the shape by args, include them here
      //       // keyArgs: ['first', 'after', 'lastMessages', 'beforeMessages'],
      //       merge(_existing, incoming) {
      //         return incoming;
      //       },
      //
      //       // Advanced example (dedupe by node.id). Uncomment and adapt
      //       // when switching to cache-first pagination:
      //       // merge(existing, incoming) {
      //       //   const seen = new Set<string>();
      //       //   const edges = [] as Array<any>;
      //       //   const push = (es?: Array<any>) => {
      //       //     es?.forEach((e) => {
      //       //       const id = e?.node?.id;
      //       //       if (!id || seen.has(id)) return;
      //       //       seen.add(id);
      //       //       edges.push(e);
      //       //     });
      //       //   };
      //       //   push(existing?.edges);
      //       //   push(incoming?.edges);
      //       //   return {
      //       //     ...incoming,
      //       //     edges,
      //       //   };
      //       // },
      //     },
      //   },
      // },

      // ChatMessage: {
      //   keyFields: ['id'],
      // },
    },
  });
}

export default createApolloCache;
