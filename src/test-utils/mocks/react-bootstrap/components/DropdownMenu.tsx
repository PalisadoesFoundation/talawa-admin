import React from 'react';

/**
 * Mock Dropdown.Menu - simple container used to wrap dropdown items within
 * tests. Keeps behavior minimal and predictable.
 */
export type DivProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;

const DropdownMenu: React.FC<DivProps> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

export default DropdownMenu;
