import type { InterfacePost } from 'types/Post/interface';

/**
 * Props for PostViewModal component.
 */
export interface InterfacePostViewModalProps {
  /** Controls the visibility of the modal. */
  show: boolean;
  /** Callback invoked when the modal should close. */
  onHide: () => void;
  /** The post data to display, or null if not loaded. */
  post: InterfacePost | null;
  /** Function to refresh post data after mutations. */
  refetch: () => Promise<unknown>;
}
