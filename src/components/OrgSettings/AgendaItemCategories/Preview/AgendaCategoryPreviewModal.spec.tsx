import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgendaCategoryPreviewModal from './AgendaCategoryPreviewModal';
import { vi } from 'vitest';

// Mock translation function
const mockT = (key: string): string => key;

describe('AgendaCategoryPreviewModal Component', () => {
  const mockOnClose = vi.fn();
  const mockShowUpdateModal = vi.fn();
  const mockToggleDeleteModal = vi.fn();
  const mockCategory = {
    name: 'Meeting',
    description: 'Team discussion',
    createdBy: 'John Doe',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <AgendaCategoryPreviewModal
        agendaCategoryPreviewModalIsOpen={true}
        hidePreviewModal={mockOnClose}
        showUpdateModal={mockShowUpdateModal}
        toggleDeleteModal={mockToggleDeleteModal}
        formState={mockCategory}
        t={mockT}
      />,
    );

    expect(screen.getByText(/meeting/i)).toBeInTheDocument();
    expect(screen.getByText(/team discussion/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <AgendaCategoryPreviewModal
        agendaCategoryPreviewModalIsOpen={false}
        hidePreviewModal={mockOnClose}
        showUpdateModal={mockShowUpdateModal}
        toggleDeleteModal={mockToggleDeleteModal}
        formState={mockCategory}
        t={mockT}
      />,
    );

    expect(screen.queryByText(/meeting/i)).not.toBeInTheDocument();
  });

  test('calls hidePreviewModal when clicking close button', () => {
    render(
      <AgendaCategoryPreviewModal
        agendaCategoryPreviewModalIsOpen={true}
        hidePreviewModal={mockOnClose}
        showUpdateModal={mockShowUpdateModal}
        toggleDeleteModal={mockToggleDeleteModal}
        formState={mockCategory}
        t={mockT}
      />,
    );

    const closeButton = screen.getByTestId(
      'previewAgendaCategoryModalCloseBtn',
    );
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('renders correctly when formState has empty values', () => {
    render(
      <AgendaCategoryPreviewModal
        agendaCategoryPreviewModalIsOpen={true}
        hidePreviewModal={mockOnClose}
        showUpdateModal={mockShowUpdateModal}
        toggleDeleteModal={mockToggleDeleteModal}
        formState={{ name: '', description: '', createdBy: '' }}
        t={mockT}
      />,
    );

    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/createdby/i)).toBeInTheDocument();
  });

  test('calls showUpdateModal and hidePreviewModal when clicking edit button', () => {
    render(
      <AgendaCategoryPreviewModal
        agendaCategoryPreviewModalIsOpen={true}
        hidePreviewModal={mockOnClose}
        showUpdateModal={mockShowUpdateModal}
        toggleDeleteModal={mockToggleDeleteModal}
        formState={mockCategory}
        t={mockT}
      />,
    );

    const editButton = screen.getByTestId('editAgendaCategoryPreviewModalBtn');
    fireEvent.click(editButton);

    expect(mockShowUpdateModal).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls toggleDeleteModal when clicking delete button', () => {
    render(
      <AgendaCategoryPreviewModal
        agendaCategoryPreviewModalIsOpen={true}
        hidePreviewModal={mockOnClose}
        showUpdateModal={mockShowUpdateModal}
        toggleDeleteModal={mockToggleDeleteModal}
        formState={mockCategory}
        t={mockT}
      />,
    );

    const deleteButton = screen.getByTestId('deleteAgendaCategoryModalBtn');
    fireEvent.click(deleteButton);

    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  // New Test Case: Verifying form field values
  test('displays correct values for name, description, and createdBy fields', () => {
    render(
      <AgendaCategoryPreviewModal
        agendaCategoryPreviewModalIsOpen={true}
        hidePreviewModal={mockOnClose}
        showUpdateModal={mockShowUpdateModal}
        toggleDeleteModal={mockToggleDeleteModal}
        formState={mockCategory}
        t={mockT}
      />,
    );

    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/createdby/i)).toBeInTheDocument();

    expect(screen.getByText('Meeting')).toBeInTheDocument();
    expect(screen.getByText('Team discussion')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
