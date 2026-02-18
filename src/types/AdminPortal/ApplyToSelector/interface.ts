/**
 * Type representing the scope of action item application.
 * - 'series': Apply to entire recurring series
 * - 'instance': Apply to single event instance only
 */
export type ApplyToType = 'series' | 'instance';

/**
 * Props for ApplyToSelector component.
 */
export interface InterfaceApplyToSelectorProps {
  /** Current selection value ('series' or 'instance') */
  applyTo: ApplyToType;
  /** Callback fired when user changes the selection */
  onChange: (value: ApplyToType) => void;
}
