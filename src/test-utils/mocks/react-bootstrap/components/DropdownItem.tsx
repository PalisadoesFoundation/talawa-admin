import React from 'react';

export type BtnProps = React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 'data-testid'?: string }
>;

const DropdownItem: React.FC<BtnProps> = ({ children, onClick, ...rest }) => (
  <button
    data-testid={(rest as { 'data-testid'?: string })['data-testid']}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);

export default DropdownItem;
