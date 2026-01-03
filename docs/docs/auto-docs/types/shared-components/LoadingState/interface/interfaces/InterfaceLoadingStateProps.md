[Admin Docs](/)

***

# Interface: InterfaceLoadingStateProps

Defined in: [src/types/shared-components/LoadingState/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L39)

Interface for LoadingState component props.

This interface defines the props for the LoadingState component,
which provides a consistent loading experience across the application.

 InterfaceLoadingStateProps

## Example

```tsx
const props: InterfaceLoadingStateProps = {
  isLoading: true,
  variant: 'skeleton',
  size: 'lg',
  children: <div>Content</div>,
  'data-testid': 'my-loading-state'
};
```

## Properties

### children

> **children**: `ReactNode`

Defined in: [src/types/shared-components/LoadingState/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L43)

Content to display when not loading

***

### customLoader?

> `optional` **customLoader**: `ReactNode`

Defined in: [src/types/shared-components/LoadingState/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L49)

Custom loader component for the custom variant

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/LoadingState/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L44)

Test ID for testing purposes

***

### isLoading

> **isLoading**: `boolean`

Defined in: [src/types/shared-components/LoadingState/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L40)

Whether the loading state is active

***

### noOfRows?

> `optional` **noOfRows**: `number`

Defined in: [src/types/shared-components/LoadingState/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L46)

Number of rows to render for the table variant

***

### size?

> `optional` **size**: `"sm"` \| `"lg"` \| `"xl"`

Defined in: [src/types/shared-components/LoadingState/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L42)

Size of the loading indicator
  - 'sm': Small
  - 'lg': Large
  - 'xl': Extra large (default)

***

### skeletonCols?

> `optional` **skeletonCols**: `number`

Defined in: [src/types/shared-components/LoadingState/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L48)

Number of columns to render for the skeleton variant

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/LoadingState/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L47)

Number of rows to render for the skeleton variant

***

### tableHeaderTitles?

> `optional` **tableHeaderTitles**: `string`[]

Defined in: [src/types/shared-components/LoadingState/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L45)

Array of header titles for the table variant

***

### variant?

> `optional` **variant**: `"custom"` \| `"spinner"` \| `"inline"` \| `"table"` \| `"skeleton"`

Defined in: [src/types/shared-components/LoadingState/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L41)

The variant of the loading indicator
  - 'spinner': Full-screen loading with overlay (default)
  - 'inline': Compact inline loading indicator
  - 'table': Table placeholder for tabular data loading
  - 'skeleton': Skeleton placeholder for initial content loading
  - 'custom': Custom loader component provided via customLoader prop
