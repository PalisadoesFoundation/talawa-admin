[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<`InterfaceTruncatedTextProps`\>

Defined in: [src/components/OrgListCard/TruncatedText.tsx:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/OrgListCard/TruncatedText.tsx#L31)

A React functional component that displays text and truncates it with an ellipsis (`...`)
if the text exceeds the available width or the `maxWidthOverride` value.

The component adjusts the truncation dynamically based on the available space
or the `maxWidthOverride` value. It also listens for window resize events to reapply truncation.

## Param

The props for the component.

## Returns

A heading element (`<h6>`) containing the truncated or full text.

## Example

```tsx
<TruncatedText text="This is a very long text" maxWidthOverride={150} />
```
