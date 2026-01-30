import type { JSX as ReactSource } from 'react';
/**
 * Global JSX type augmentation for React 19 compatibility.
 * Maps the global JSX namespace to React's JSX type definitions,
 * ensuring TypeScript recognizes JSX syntax correctly across the codebase.
 */
declare global {
  namespace JSX {
    type Element = ReactSource.Element;
    type ElementClass = ReactSource.ElementClass;
    type ElementAttributesProperty = ReactSource.ElementAttributesProperty;
    type ElementChildrenAttribute = ReactSource.ElementChildrenAttribute;
    type IntrinsicAttributes = ReactSource.IntrinsicAttributes;
    // prettier-ignore
    type IntrinsicClassAttributes<T> =
      ReactSource.IntrinsicClassAttributes<T>;
    type IntrinsicElements = ReactSource.IntrinsicElements;
    type LibraryManagedAttributes<TComponent, TProps> =
      ReactSource.LibraryManagedAttributes<TComponent, TProps>;
  }
}

export {};
