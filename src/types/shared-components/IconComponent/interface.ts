import type React from 'react';

/**
 * Props for IconComponent.
 */
export interface InterfaceIconComponentProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  fill?: string;
  height?: string | number;
  width?: string | number;
  // Narrow shapeRendering to string to be compatible with both React.SVGProps (string | number)
  // and MUI SvgIconProps (string). This resolves TS errors in IconComponent.
  shapeRendering?: string;
}
