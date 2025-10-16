import React from 'react';

export type BtnProps = React.PropsWithChildren<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { 'data-testid'?: string }
>;

const DropdownToggle: React.FC<BtnProps> = ({ children, onClick, ...rest }) => (
  <button
    type="button"
    data-testid={
      (rest as { 'data-testid'?: string })['data-testid'] || 'dropdown'
    }
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);

export default DropdownToggle;
