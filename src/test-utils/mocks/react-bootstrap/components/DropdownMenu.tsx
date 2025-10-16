import React from 'react';

export type DivProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;

const DropdownMenu: React.FC<DivProps> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

export default DropdownMenu;
