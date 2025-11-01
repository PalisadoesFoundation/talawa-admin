import React from 'react';

interface IActionButtonProps {
  href: string;
  type?: 'primary' | 'secondary';
  target?: string;
  children: React.ReactNode;
  buttonClassName?: string;
  ariaLabel: string;
  rel?: string;
}

function ActionButton({
  href,
  type = 'primary',
  target,
  children,
  buttonClassName,
  ariaLabel,
  rel,
}: IActionButtonProps) {
  return (
    <a
      className={`ActionButton ${type}${buttonClassName ? ` ${buttonClassName}` : ''}`}
      rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
      href={href}
      target={target}
      role="button"
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

export default ActionButton;
