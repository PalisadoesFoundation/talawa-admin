import React from 'react';
import { usePluginInjectors } from '../hooks';
import { getPluginComponent } from '../registry';
import type { IInjectorExtension } from '../types';

interface IPluginInjectorProps {
  injectorType: 'G1' | 'G2' | 'G3' | 'G4';
  className?: string;
  style?: React.CSSProperties;
  data?: Record<string, unknown>; // Props to pass to injected components
}

/**
 * PluginInjector - Renders injector extensions for a specific type
 * This component loads and renders components specified in injector extensions
 *
 * @example
 * ```tsx
 * // Pass post content to an AI summarizing plugin
 * <PluginInjector
 *   injectorType="G1"
 *   data={{ content: postContent, postId: post.id }}
 * />
 * ```
 */
const PluginInjector: React.FC<IPluginInjectorProps> = ({
  injectorType,
  className,
  style,
  data,
}) => {
  const injectors = usePluginInjectors(injectorType);

  const renderInjector = (injector: IInjectorExtension, index: number) => {
    try {
      // Get the component from the plugin registry
      const Component = getPluginComponent(
        injector.pluginId || '',
        injector.injector,
      );

      if (!Component) {
        console.warn(
          `Component ${injector.injector} not found for injector`,
          injector,
        );
        return null;
      }

      return (
        <div key={`${injector.pluginId}-${index}`} style={style}>
          <Component {...data} />
        </div>
      );
    } catch (error) {
      console.error(`Error rendering injector ${injector.injector}:`, error);
      return null;
    }
  };

  if (!injectors || injectors.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {injectors.map((injector, index) => renderInjector(injector, index))}
    </div>
  );
};

export default PluginInjector;
