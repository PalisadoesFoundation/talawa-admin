/*
 * Copyright 2025 Palisadoes Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Test Suite for AgendaItemsDeleteModal
 *
 * This file contains unit tests to verify:
 * 1. Rendering of the delete confirmation dialog.
 * 2. Execution of the 'deleteAgendaItemHandler' when confirmed.
 * 3. Toggling the modal visibility using 'toggleDeleteModal'.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  describe,
  it,
  expect,
  vi,
  type Mock,
  beforeEach,
  afterEach,
} from 'vitest';
import AgendaItemsDeleteModal from './AgendaItemsDeleteModal';
import { InterfaceAgendaItemsDeleteModalProps } from 'types/AdminPortal/EventManagement/AgendaItemsDeleteModal/interface';

// MOCK: Since the component uses the hook internally, we must mock the library
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AgendaItemsDeleteModal', () => {
  let mockToggleDeleteModal: Mock;
  let mockDeleteAgendaItemHandler: Mock;
  let defaultProps: InterfaceAgendaItemsDeleteModalProps;

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Setup fresh mocks before EVERY test
  beforeEach(() => {
    mockToggleDeleteModal = vi.fn();
    mockDeleteAgendaItemHandler = vi.fn();

    // Note: 't' and 'tCommon' are removed from props as they are now internal hooks
    defaultProps = {
      agendaItemDeleteModalIsOpen: true,
      toggleDeleteModal: mockToggleDeleteModal,
      deleteAgendaItemHandler: mockDeleteAgendaItemHandler,
    };
  });

  it('should render correctly when open', () => {
    render(<AgendaItemsDeleteModal {...defaultProps} />);

    // The mock returns the key name, so we check for the keys
    expect(screen.getByText('deleteAgendaItem')).toBeInTheDocument();
    expect(screen.getByText('deleteAgendaItemMsg')).toBeInTheDocument();
    expect(screen.getByText('yes')).toBeInTheDocument();
    expect(screen.getByText('no')).toBeInTheDocument();
  });

  // Verify the modal is not visible when the prop is false
  it('should not render the modal when agendaItemDeleteModalIsOpen is false', () => {
    render(
      <AgendaItemsDeleteModal
        {...defaultProps}
        agendaItemDeleteModalIsOpen={false}
      />,
    );
    // When closed, the title (and everything else) should be absent
    expect(screen.queryByText('deleteAgendaItem')).not.toBeInTheDocument();
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
