import React from 'react';

/**
 * Props for the ProfileAvatarDisplay component.
 *
 * @property avatarUrl - Optional URL of the avatar image to display.
 * @property altText - Required alt text for accessibility.
 * @property size - Optional size preset: 'small', 'medium', 'large', or 'custom'.
 * @property shape - Optional shape: 'circle', 'square', or 'rounded'.
 * @property customSize - Optional custom size in pixels (used when size='custom').
 * @property border - Optional flag to add a border around the avatar.
 * @property className - Optional additional CSS class names.
 * @property style - Optional inline React CSS properties.
 * @property name - Required name used for fallback avatar generation.
 * @property dataTestId - Optional test ID for testing purposes.
 * @property objectFit - Optional CSS object-fit value for the image.
 */
export interface InterfaceProfileAvatarDisplayProps {
  avatarUrl?: string | null;
  altText: string;
  size?: 'small' | 'medium' | 'large' | 'custom';
  shape?: 'circle' | 'square' | 'rounded';
  customSize?: number;
  border?: boolean;
  className?: string;
  style?: React.CSSProperties;
  name: string;
  dataTestId?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}
