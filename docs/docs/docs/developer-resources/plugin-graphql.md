---
id: plugin-graphql-integration
title: Plugin GraphQL Integration
slug: /developer-resources/plugin-graphql-integration
sidebar_position: 50
---

# 

This document describes the new GraphQL-based plugin management system that replaces the local `index.json` file approach.

## Overview

The plugin system now uses GraphQL queries and mutations to manage plugin state, providing better synchronization across different instances and persistent storage.

## GraphQL Operations

### Queries

#### Get All Plugins
```graphql
query GetAllPlugins {
  plugins(input: {}) {
    id
    pluginId
    isActivated
    isInstalled
    backup
    createdAt
    updatedAt
  }
}
```

### Mutations

#### Create Plugin
```graphql
mutation CreatePlugin($input: CreatePluginInput!) {
  createPlugin(input: $input) {
    id
    pluginId
    isActivated
    isInstalled
    backup
    createdAt
    updatedAt
  }
}
```

#### Update Plugin
```graphql
mutation UpdatePlugin($input: UpdatePluginInput!) {
  updatePlugin(input: $input) {
    id
    pluginId
    isActivated
    isInstalled
    backup
    createdAt
    updatedAt
  }
}
```

#### Delete Plugin
```graphql
mutation DeletePlugin($input: DeletePluginInput!) {
  deletePlugin(input: $input) {
    id
    pluginId
  }
}
```

## Implementation Files

- **`src/GraphQl/Mutations/PluginMutations.ts`** - GraphQL mutations for plugin operations
- **`src/GraphQl/Queries/PlugInQueries.ts`** - GraphQL queries (GET_ALL_PLUGINS added)
- **`src/plugin/graphql-service.ts`** - Service layer for GraphQL operations
- **`src/plugin/manager.ts`** - Updated plugin manager with GraphQL integration
- **`src/screens/PluginStore/PluginStore.tsx`** - Updated UI to use GraphQL

## Features

### Pure GraphQL Implementation
The system now uses GraphQL exclusively for plugin management. The local `index.json` file has been completely removed.

### Synchronization
Plugin activation/deactivation and installation/uninstallation are now synchronized between the local plugin manager and the GraphQL backend.

### Real-time Updates
The plugin store UI automatically updates when GraphQL operations complete, providing immediate feedback to users.

## Usage in Components

### Using Hooks
```typescript
import { useGetAllPlugins, useCreatePlugin, useUpdatePlugin, useDeletePlugin } from 'plugin/graphql-service';

function MyComponent() {
  const { data, loading, error } = useGetAllPlugins();
  const [createPlugin] = useCreatePlugin();
  const [updatePlugin] = useUpdatePlugin();
  const [deletePlugin] = useDeletePlugin();

  // Use the hooks as needed
}
```

### Using Service Class
```typescript
import { PluginGraphQLService } from 'plugin/graphql-service';

const service = new PluginGraphQLService(apolloClient);
const plugins = await service.getAllPlugins();
```

## Migration Notes

- The local `index.json` file has been completely removed
- Plugin operations now use GraphQL exclusively
- The plugin manager requires Apollo client to be available for plugin discovery
- No local file fallback - system depends entirely on GraphQL backend

## Future Enhancements

- Add subscription support for real-time plugin updates
- Implement plugin versioning and update notifications
- Add bulk operations for multiple plugins
- Enhance error reporting and user feedback 