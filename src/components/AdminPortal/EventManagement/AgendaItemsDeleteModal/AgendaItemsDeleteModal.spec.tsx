import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AgendaItemsDeleteModal from './AgendaItemsDeleteModal';
import { InterfaceAgendaItemsDeleteModalProps } from 'types/components/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface';

describe('AgendaItemsDeleteModal', () => {
  const mockToggleDeleteModal = vi.fn();
  const mockDeleteAgendaItemHandler = vi.fn();
  const mockT = vi.fn((key) => key);
  const mockTCommon = vi.fn((key) => key);

  const defaultProps: InterfaceAgendaItemsDeleteModalProps = {
    agendaItemDeleteModalIsOpen: true,
    toggleDeleteModal: mockToggleDeleteModal,
    deleteAgendaItemHandler: mockDeleteAgendaItemHandler,
    t: mockT,
    tCommon: mockTCommon,
  };

  it('should render correctly when open', () => {
    render(<AgendaItemsDeleteModal {...defaultProps} />);
    expect(screen.getByText('deleteAgendaItem')).toBeInTheDocument();
    expect(screen.getByText('deleteAgendaItemMsg')).toBeInTheDocument();
    expect(screen.getByText('yes')).toBeInTheDocument();
    expect(screen.getByText('no')).toBeInTheDocument();
  });

  it('should call toggleDeleteModal when close button is clicked', () => {
    render(<AgendaItemsDeleteModal {...defaultProps} />);
    const closeBtn = screen.getByTestId('deleteAgendaItemCloseBtn');
    fireEvent.click(closeBtn);
    expect(mockToggleDeleteModal).toHaveBeenCalled();
  });

  it('should call deleteAgendaItemHandler when confirm button is clicked', () => {
    render(<AgendaItemsDeleteModal {...defaultProps} />);
    const confirmBtn = screen.getByTestId('deleteAgendaItemBtn');
    fireEvent.click(confirmBtn);
    expect(mockDeleteAgendaItemHandler).toHaveBeenCalled();
  });
});
