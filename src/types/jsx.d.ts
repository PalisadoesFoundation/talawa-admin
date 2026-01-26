import type {
  JSX as ReactSource,
  IntrinsicClassAttributes as ReactICAttr,
} from 'react';

declare global {
  namespace JSX {
    type Element = ReactSource.Element;
    type ElementClass = ReactSource.ElementClass;
    type ElementAttributesProperty = ReactSource.ElementAttributesProperty;
    type ElementChildrenAttribute = ReactSource.ElementChildrenAttribute;
    type IntrinsicAttributes = ReactSource.IntrinsicAttributes;
    // prettier-ignore
    type IntrinsicClassAttributes<T> =
      ReactICAttr<T>;
    type IntrinsicElements = ReactSource.IntrinsicElements;
    type LibraryManagedAttributes<TComponent, TProps> =
      ReactSource.LibraryManagedAttributes<TComponent, TProps>;
  }
}

export {};
