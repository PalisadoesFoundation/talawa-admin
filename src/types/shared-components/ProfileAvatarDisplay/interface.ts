/**
 * Props for the ProfileAvatarDisplay component.
 */
export interface InterfaceProfileAvatarDisplayProps {
  imageUrl?: string | null;
  size?: 'small' | 'medium' | 'large' | 'custom';
  shape?: 'circle' | 'square' | 'rounded';
  customSize?: number;
  border?: boolean;
  className?: string;
  style?: React.CSSProperties;
  fallbackName: string;
  dataTestId?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onClick?: () => void;
  /** If true, clicking the avatar opens an enlarged modal view */
  enableEnlarge?: boolean;
  // need to support other props which are in images
  crossOrigin?: 'anonymous' | 'use-credentials';
  decoding?: 'sync' | 'async' | 'auto';
  loading?: 'eager' | 'lazy';
  onError?: () => void;
  onLoad?: () => void;
}
