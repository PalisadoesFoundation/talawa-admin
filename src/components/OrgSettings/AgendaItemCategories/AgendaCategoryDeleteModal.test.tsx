import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgendaCategoryDeleteModal from './AgendaCategoryDeleteModal';

// Mock functions
const mockToggleDeleteModal = jest.fn();
const mockDeleteAgendaCategoryHandler = jest.fn();

const renderComponent = (isOpen: boolean): ReturnType<typeof render> => {
  return render(
    <AgendaCategoryDeleteModal
      agendaCategoryDeleteModalIsOpen={isOpen}
      toggleDeleteModal={mockToggleDeleteModal}
      deleteAgendaCategoryHandler={mockDeleteAgendaCategoryHandler}
      t={(key) => key} // Mock translation function
      tCommon={(key) => key} // Mock translation function
    />,
  );
};

describe('AgendaCategoryDeleteModal Component', () => {
  test('renders modal when open', () => {
    renderComponent(true);
    expect(screen.getByText('deleteAgendaCategory')).toBeInTheDocument();
    expect(screen.getByText('deleteAgendaCategoryMsg')).toBeInTheDocument();
  });

  test('modal is not rendered when closed', () => {
    renderComponent(false);
    expect(screen.queryByText('deleteAgendaCategory')).not.toBeInTheDocument();
  });

  test("calls toggleDeleteModal when 'No' button is clicked", () => {
    renderComponent(true);
    fireEvent.click(screen.getByTestId('deleteAgendaCategoryCloseBtn'));
    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  test("calls deleteAgendaCategoryHandler when 'Yes' button is clicked", () => {
    renderComponent(true);
    fireEvent.click(screen.getByTestId('deleteAgendaCategoryBtn'));
    expect(mockDeleteAgendaCategoryHandler).toHaveBeenCalledTimes(1);
  });
});
