[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/components/AddOn/core/AddOnStore/AddOnStore.tsx:37](https://github.com/hustlernik/talawa-admin/blob/fe326ed17e0fa5ad916ff9f383f63b5d38aedc7b/src/components/AddOn/core/AddOnStore/AddOnStore.tsx#L37)

Component for managing and displaying plugins in the store.

This component:
- Displays a search input and filter options.
- Uses tabs to switch between available and installed plugins.
- Fetches plugins from a GraphQL endpoint and filters them based on search criteria.
- Utilizes Redux store to manage plugin data.

## Returns

`JSX.Element`

A JSX element containing the UI for the add-on store.
