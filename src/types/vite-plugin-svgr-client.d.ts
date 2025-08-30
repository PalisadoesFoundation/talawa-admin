// src/types/vite-plugin-svgr-client.d.ts

declare module 'vite-plugin-svgr/client' {
  import * as React from 'react';

  export interface SVGRProps extends React.SVGProps<SVGSVGElement> {
    title?: string;
  }

  // Named export for the SVG as a React component
  export const ReactComponent: React.FC<SVGRProps>;

  // Default export is the URL/string to the SVG
  const src: string;
  export default src;
}
