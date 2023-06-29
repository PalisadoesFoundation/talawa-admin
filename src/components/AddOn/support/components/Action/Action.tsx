import React, { useRef } from 'react';

// TODO: UI logic for embedded actions (hide label)
interface InterfaceActionProps {
  children: any;
  label: string;
}

// TODO: props => Validate child element type, register functions from children for global use?,
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
