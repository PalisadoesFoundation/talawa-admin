import React from 'react';

/**
 * Props for RequirementRow component.
 */
interface InterfaceRequirementRowProps {
  /** Whether the requirement is satisfied */
  ok: boolean;
  /** Requirement description text */
  text: string;
}

/**
 * Row component to display a single password requirement with status indicator.
 *
 * @param props - Component props
 * @returns A div with colored text and checkmark/X indicator
 */
export const RequirementRow: React.FC<InterfaceRequirementRowProps> = ({
  ok,
  text,
}) => (
  <div className={ok ? 'text-success' : 'text-danger'}>
    <span aria-hidden>{ok ? '✔︎' : '✖︎'}</span> {text}
  </div>
);
