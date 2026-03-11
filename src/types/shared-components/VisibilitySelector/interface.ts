import type { EventVisibility } from 'shared-components/EventForm/utils';

/**
 * Props for the VisibilitySelector component.
 */
export interface InterfaceVisibilitySelectorProps {
  visibility: EventVisibility;
  setVisibility: (visibility: EventVisibility) => void;
  /** If true, all radio buttons are disabled (view-only mode) */
  disabled?: boolean;
}
