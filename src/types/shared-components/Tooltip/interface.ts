import type React from 'react';

/**
 * Allowed tooltip placement positions relative to the trigger element.
 * - 'top': Tooltip appears above the trigger
 * - 'bottom': Tooltip appears below the trigger
 * - 'left': Tooltip appears to the left of the trigger
 * - 'right': Tooltip appears to the right of the trigger
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props interface for the Tooltip component.
 *
 * @param children - The trigger element that the tooltip wraps
 * @param content - The content to display inside the tooltip (can be text or JSX)
 * @param placement - Position of the tooltip relative to the trigger (default: 'top')
 * @param delayShow - Delay in milliseconds before showing the tooltip (default: 200)
 * @param delayHide - Delay in milliseconds before hiding the tooltip (default: 0)
 * @param disabled - When true, the tooltip will not show on hover/focus
 * @param className - Additional CSS class to apply to the tooltip element
 */
export interface InterfaceTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delayShow?: number;
  delayHide?: number;
  disabled?: boolean;
  className?: string;
}
