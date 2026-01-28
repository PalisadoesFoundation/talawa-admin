[Admin Docs](/)

***

# Variable: PluginInjector

> `const` **PluginInjector**: `React.FC`\<`IPluginInjectorProps`\>

Defined in: [src/plugin/components/PluginInjector.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/plugin/components/PluginInjector.tsx#L29)

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
