import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CRUDModalTemplate from './CRUDModalTemplate';

describe('CRUDModalTemplate', () => {
  it('renders title and content when open', () => {
    render(
      <CRUDModalTemplate
        open
        title="Create Item"
        onClose={() => {}}
      >
        <div>Modal Content</div>
      </CRUDModalTemplate>
    );

    expect(screen.getByText(/create item/i)).toBeInTheDocument();
    expect(screen.getByText(/modal content/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const onClose = vi.fn();

    render(
      <CRUDModalTemplate
        open
        title="Create Item"
        onClose={onClose}
      />
    );

    await userEvent.click(screen.getByText(/cancel/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onPrimary when Enter key is pressed', async () => {
    const onPrimary = vi.fn();

    render(
      <CRUDModalTemplate
        open
        title="Create Item"
        onClose={() => {}}
        onPrimary={onPrimary}
      />
    );

    await userEvent.keyboard('{Enter}');
    expect(onPrimary).toHaveBeenCalled();
  });
});

