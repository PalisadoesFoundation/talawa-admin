import React from 'react';

/**
 * Base container for the mocked Dropdown. Acts as the root wrapper and simply
 * renders its children inside a div. Kept minimal because it's only used in
 * tests.
 */
export type DivProps = React.PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement>
>;

const DropdownBase: React.FC<DivProps> = ({ children, ...rest }) => (
  <div {...rest}>{children}</div>
);

export default DropdownBase;
