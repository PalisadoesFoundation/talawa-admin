export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface InterfaceTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delayShow?: number;
  delayHide?: number;
  disabled?: boolean;
  className?: string;
}
