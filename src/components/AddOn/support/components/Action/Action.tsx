import React, { useRef } from 'react';
import type { InterfaceActionProps } from 'types/AddOn/interface';

/**
 * A React component that renders a labeled container for embedded actions.
 *
 * @param  props - The properties for the component.
 * @returns  A JSX element containing the label and child elements.
 *
 * @example
 * <Action label="My Label">
 *   <button>Click Me</button>
 * </Action>
 */
function action(props: InterfaceActionProps): JSX.Element {
  const actionRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={actionRef}>
      <h6 className="action-label">{props.label}</h6>
      {props.children}
    </div>
  );
}

export default action;
