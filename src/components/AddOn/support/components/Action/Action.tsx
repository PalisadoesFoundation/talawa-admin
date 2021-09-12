import React, { useEffect, useRef } from 'react';
import styles from './Action.module.css';

// TODO: UI logic for embedded actions (hide label)
interface ActionProps {
  children: any;
  label: string;
}

// TODO: props => Validate child element type, register functions from children for global use?,
function Action(props: ActionProps): JSX.Element {
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Props', props.children); // Validate Type
    console.log('Ref', actionRef); // Fetch Events
  });
  return (
    <div ref={actionRef}>
      <h6 className="action-label">{props.label}</h6>
      {props.children}
    </div>
  );
}

export default Action;
