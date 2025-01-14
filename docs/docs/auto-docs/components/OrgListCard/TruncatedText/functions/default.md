[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../README.md) / [components/OrgListCard/TruncatedText](../README.md) / default

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

Defined in: [src/components/OrgListCard/TruncatedText.tsx:31](https://github.com/bint-Eve/talawa-admin/blob/bb9ac170c0ec806cc5423650a66bbe110c3af5d9/src/components/OrgListCard/TruncatedText.tsx#L31)

A React functional component that displays text and truncates it with an ellipsis (`...`)
if the text exceeds the available width or the `maxWidthOverride` value.

The component adjusts the truncation dynamically based on the available space
or the `maxWidthOverride` value. It also listens for window resize events to reapply truncation.

## Parameters

### props

`InterfaceTruncatedTextProps`

The props for the component.

### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

## Returns

`ReactNode`

A heading element (`<h6>`) containing the truncated or full text.

## Example

```tsx
<TruncatedText text="This is a very long text" maxWidthOverride={150} />
```
