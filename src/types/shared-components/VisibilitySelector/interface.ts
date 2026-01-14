import type { EventVisibility } from 'shared-components/EventForm/utils';

/**
 * Props for the VisibilitySelector component.
 */
export interface InterfaceVisibilitySelectorProps {
  visibility: EventVisibility;
  setVisibility: (visibility: EventVisibility) => void;
  tCommon: (key: string) => string;
}
