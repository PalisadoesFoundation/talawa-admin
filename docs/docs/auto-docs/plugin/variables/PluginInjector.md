[**talawa-admin**](../../README.md)

***

# Variable: PluginInjector

> `const` **PluginInjector**: `React.FC`\<`IPluginInjectorProps`\>

Defined in: [src/plugin/components/PluginInjector.tsx:26](https://github.com/iamanishx/talawa-admin/blob/298365ee22a86aaef2b666c60099ffc41d2bbce7/src/plugin/components/PluginInjector.tsx#L26)

PluginInjector - Renders injector extensions for a specific type
This component loads and renders components specified in injector extensions

## Example

```tsx
// Pass post content to an AI summarizing plugin
<PluginInjector
  injectorType="G1"
  data={{ content: postContent, postId: post.id }}
/>
```
