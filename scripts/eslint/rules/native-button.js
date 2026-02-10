/**
 * Native button restrictions - enforce usage of the shared Button component.
 */
export const nativeButtonRestrictions = [
  {
    selector: "JSXOpeningElement[name.name='button']",
    message:
      'Direct native <button> usage is not allowed. Use the shared Button component from src/shared-components/Button/ instead.',
  },
];
