[**talawa-admin**](../../README.md)

***

# Variable: PluginInjector

> `const` **PluginInjector**: `React.FC`\<`IPluginInjectorProps`\>

Defined in: [src/plugin/components/PluginInjector.tsx:26](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/plugin/components/PluginInjector.tsx#L26)

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
