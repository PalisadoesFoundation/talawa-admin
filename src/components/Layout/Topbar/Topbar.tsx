/**
 * Topbar — frosted-glass header bar.
 *
 * Displays page title, optional breadcrumbs, and action buttons.
 * Includes hamburger button for mobile sidebar toggle.
 */
import React from 'react';
import { useNavigate } from 'react-router';

interface TopbarProps {
  title: string;
  onHamburgerClick: () => void;
}

export default function Topbar({
  title,
  onHamburgerClick,
}: TopbarProps): React.ReactElement {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <button
        className="topbar-hamburger"
        aria-label="Open menu"
        onClick={onHamburgerClick}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <span className="topbar-title">{title}</span>
      <span className="topbar-spacer" />
      <div className="topbar-actions">
        <button
          className="topbar-btn"
          title="Notifications"
          onClick={() => navigate('/admin/notification')}
        >
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}
