import React from 'react';

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
