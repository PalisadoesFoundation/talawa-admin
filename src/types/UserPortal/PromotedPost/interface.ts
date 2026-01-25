/**
 * Props for PromotedPost component.
 * `@property` id - Unique identifier for the promoted post
 * `@property` image - URL or path to the promotional image (optional)
 * `@property` title - Display title for the promoted post
 */
export interface InterfacePromotedPostProps {
  id: string;
  image: string | null | undefined;
  title: string;
}
