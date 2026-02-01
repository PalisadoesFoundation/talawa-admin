[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfaceTooltipProps`](../../../../types/shared-components/Tooltip/interface/interfaces/InterfaceTooltipProps.md)\>

Defined in: [src/shared-components/Tooltip/Tooltip.tsx:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Tooltip/Tooltip.tsx#L103)

Tooltip Component

A lightweight, accessible tooltip component that displays additional information
when users hover over or focus on an element. Uses React Portal for rendering
and CSS-based positioning with fixed positioning.

Features:
- Keyboard accessible (shows on focus, hides on Escape)
- ARIA attributes for screen reader support
- Configurable show/hide delays
- Viewport boundary detection
- Repositions on window resize and scroll

Props:
- children: The trigger element that the tooltip wraps
- content: The content to display inside the tooltip
- placement: Position relative to trigger ('top', 'bottom', 'left', 'right')
- delayShow: Milliseconds to wait before showing (default: 200)
- delayHide: Milliseconds to wait before hiding (default: 0)
- disabled: When true, tooltip will not appear
- className: Additional CSS class for the tooltip element

## Returns

The rendered Tooltip component with trigger and portal content

## Example

```tsx
<Tooltip content="This is helpful information" placement="right">
  <button>Hover me</button>
</Tooltip>
```
