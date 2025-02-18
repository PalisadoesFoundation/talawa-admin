import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { vi } from 'vitest';

import DeletePostModal from './DeletePostModal';
import i18nForTest from 'utils/i18nForTest';

describe('DeletePostModal', () => {
  it('renders the delete modal with correct text', () => {
    const mockOnHide = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <I18nextProvider i18n={i18nForTest}>
        <DeletePostModal
          show={true}
          onHide={mockOnHide}
          onDelete={mockOnDelete}
        />
      </I18nextProvider>,
    );

    expect(screen.getByTestId('delete-post-modal')).toBeInTheDocument();
    expect(screen.getByText(/delete post/i)).toBeInTheDocument();
    expect(
      screen.getByText(/do you want to remove this post\?/i),
    ).toBeInTheDocument();
  });

  it('hides the modal when "No" is clicked', () => {
    const mockOnHide = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <I18nextProvider i18n={i18nForTest}>
        <DeletePostModal
          show={true}
          onHide={mockOnHide}
          onDelete={mockOnDelete}
        />
      </I18nextProvider>,
    );

    fireEvent.click(screen.getByTestId('deleteModalNoBtn'));
    expect(mockOnHide).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('calls onDelete and onHide when "Yes" is clicked', () => {
    const mockOnHide = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <I18nextProvider i18n={i18nForTest}>
        <DeletePostModal
          show={true}
          onHide={mockOnHide}
          onDelete={mockOnDelete}
        />
      </I18nextProvider>,
    );

    fireEvent.click(screen.getByTestId('deletePostBtn'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnHide).toHaveBeenCalledTimes(1);
  });

  it('does not render the modal when show is false', () => {
    const { queryByTestId } = render(
      <I18nextProvider i18n={i18nForTest}>
        <DeletePostModal show={false} onHide={vi.fn()} onDelete={vi.fn()} />
      </I18nextProvider>,
    );
    expect(queryByTestId('delete-post-modal')).not.toBeInTheDocument();
  });
});
