[Admin Docs](/)

***

# Function: renderFolderTree()

> **renderFolderTree**(`folderId`, `depth`, `params`): `Element`[]

Defined in: [src/components/AdminPortal/Tags/BulkTagActions/components/TagTreeRenderer.tsx:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/Tags/BulkTagActions/components/TagTreeRenderer.tsx#L104)

Renders a folder row and, when expanded, its child folder and tag rows.

## Parameters

### folderId

`string`

Folder id to render.

### depth

`number`

Nesting depth used for indentation.

### params

[`InterfaceTagTreeRendererParams`](../../../../../../../types/AdminPortal/TagActions/interface/interfaces/InterfaceTagTreeRendererParams.md)

Rendering state and event handlers.

## Returns

`Element`[]

JSX rows for the requested folder subtree.
