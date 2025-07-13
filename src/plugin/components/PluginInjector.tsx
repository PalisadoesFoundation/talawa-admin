import React from 'react';
import { usePluginInjectors } from '../hooks';
import { getPluginComponent } from '../registry';
import type { IInjectorExtension } from '../types';

interface PluginInjectorProps {
  injectorType: 'G1' | 'G2' | 'G3';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * PluginInjector - Renders injector extensions for a specific type
 * This component loads and renders components specified in injector extensions
 */
const PluginInjector: React.FC<PluginInjectorProps> = ({
  injectorType,
  className,
  style,
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
          <Component />
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
