[**talawa-admin**](../../README.md)

***

# Variable: PluginInjector

> `const` **PluginInjector**: `React.FC`\<`IPluginInjectorProps`\>

Defined in: [src/plugin/components/PluginInjector.tsx:26](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/plugin/components/PluginInjector.tsx#L26)

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
