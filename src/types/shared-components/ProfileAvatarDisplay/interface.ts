import React from 'react';
/**
 * Props for the ProfileAvatarDisplay component.
 *
 * @param imageUrl - (Optional) URL of the avatar image to display.
 * @param size - (Optional) Size preset: 'small', 'medium', 'large', or 'custom'.
 * @param shape - (Optional) Shape: 'circle', 'square', or 'rounded'.
 * @param customSize - (Optional) Custom size in pixels (used when size='custom').
 * @param border - (Optional) Flag to add a border around the avatar.
 * @param className - (Optional) Additional CSS class names.
 * @param style - (Optional) Inline React CSS properties.
 * @param fallbackName - Required name used for fallback avatar generation.
 * @param dataTestId - (Optional) Test ID for testing purposes.
 * @param objectFit - (Optional) CSS object-fit value for the image.
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
