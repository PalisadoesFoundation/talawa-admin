[Admin Docs](/)

***

# Function: default()

> **default**(`props`, `deprecatedLegacyContext`?): `ReactNode`

<<<<<<< HEAD
Defined in: [src/components/OrgListCard/TruncatedText.tsx:31](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/OrgListCard/TruncatedText.tsx#L31)
=======
Defined in: [src/components/OrgListCard/TruncatedText.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgListCard/TruncatedText.tsx#L31)
>>>>>>> 0c0fc8e1d54e2ef61a81dd93e93d1afca438df84

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
