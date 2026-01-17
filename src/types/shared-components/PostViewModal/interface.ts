import { InterfacePost } from 'types/Post/interface';

/**
 * Props for PostViewModal component.
 */
export interface InterfacePostViewModalProps {
  show: boolean;
  onHide: () => void;
  post: InterfacePost | null;
  refetch: () => Promise<unknown>;
}
