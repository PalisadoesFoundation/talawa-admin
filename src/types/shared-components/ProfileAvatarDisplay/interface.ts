import React from 'react';
/**
 * Props for the ProfileAvatarDisplay component.
 */
export interface InterfaceProfileAvatarDisplayProps {
  /** (Optional) URL of the avatar image to display. */
  imageUrl?: string | null;
  /** (Optional) Size preset: 'small', 'medium', 'large', or 'custom'. */
  size?: 'small' | 'medium' | 'large' | 'custom';
  /** (Optional) Shape: 'circle', 'square', or 'rounded'. */
  shape?: 'circle' | 'square' | 'rounded';
  /** (Optional) Custom size in pixels (used when size='custom'). */
  customSize?: number;
  /** (Optional) Flag to add a border around the avatar. */
  border?: boolean;
  /** (Optional) Additional CSS class names. */
  className?: string;
  /** (Optional) Inline React CSS properties. */
  style?: React.CSSProperties;
  /** Required name used for fallback avatar generation. */
  fallbackName: string;
  /** (Optional) Test ID for testing purposes. */
  dataTestId?: string;
  /** (Optional) CSS object-fit value for the image. */
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
