import type { InterfacePost } from 'types/Post/interface';

/**
 * Props for PostViewModal component.
 *
 * @param show - Controls the visibility of the modal.
 * @param onHide - Callback invoked when the modal should close.
 * @param post - The post data to display, or null if not loaded.
 * @param refetch - Function to refresh post data after mutations.
 */
export interface InterfacePostViewModalProps {
  show: boolean;
  onHide: () => void;
  post: InterfacePost | null;
  refetch: () => Promise<unknown>;
}
