import React from 'react';
/**
 * Props for the ProfileAvatarDisplay component.
 *
 * @property imageUrl - Optional URL of the avatar image to display.
 * @property size - Optional size preset: 'small', 'medium', 'large', or 'custom'.
 * @property shape - Optional shape: 'circle', 'square', or 'rounded'.
 * @property customSize - Optional custom size in pixels (used when size='custom').
 * @property border - Optional flag to add a border around the avatar.
 * @property className - Optional additional CSS class names.
 * @property style - Optional inline React CSS properties.
 * @property fallbackName - Required name used for fallback avatar generation.
 * @property dataTestId - Optional test ID for testing purposes.
 * @property objectFit - Optional CSS object-fit value for the image.
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
