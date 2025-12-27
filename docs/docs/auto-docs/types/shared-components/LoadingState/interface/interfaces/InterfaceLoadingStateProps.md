[Admin Docs](/)

***

# Interface: InterfaceLoadingStateProps

Defined in: [src/types/shared-components/LoadingState/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L31)

Interface for LoadingState component props.

This interface defines the props for the LoadingState component,
which provides a consistent loading experience across the application.

 InterfaceLoadingStateProps

## Example

```tsx
const props: InterfaceLoadingStateProps = {
  isLoading: true,
  variant: 'spinner',
  size: 'lg',
  children: <div>Content</div>,
  'data-testid': 'my-loading-state'
};
```

## Properties

### children

> **children**: `ReactNode`

Defined in: [src/types/shared-components/LoadingState/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L35)

Content to display when not loading

***

### data-testid?

> `optional` **data-testid**: `string`

Defined in: [src/types/shared-components/LoadingState/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L36)

Test ID for testing purposes

***

### isLoading

> **isLoading**: `boolean`

Defined in: [src/types/shared-components/LoadingState/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L32)

Whether the loading state is active

***

### size?

> `optional` **size**: `"sm"` \| `"lg"` \| `"xl"`

Defined in: [src/types/shared-components/LoadingState/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L34)

Size of the loading indicator
  - 'sm': Small
  - 'lg': Large
  - 'xl': Extra large (default)

***

### variant?

> `optional` **variant**: `"spinner"` \| `"inline"`

Defined in: [src/types/shared-components/LoadingState/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/LoadingState/interface.ts#L33)

The variant of the loading indicator
  - 'spinner': Full-screen loading with overlay (default)
  - 'inline': Compact inline loading indicator
