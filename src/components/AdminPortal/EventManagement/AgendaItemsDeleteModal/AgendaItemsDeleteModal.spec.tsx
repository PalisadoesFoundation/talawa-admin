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
 * 1. Rendering of the delete confirmation dialog (via CRUDModalTemplate).
 * 2. Execution of the 'deleteAgendaItemHandler' when confirmed.
 * 3. Toggling the modal visibility using 'toggleDeleteModal'.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

// MOCK: Mock translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AgendaItemsDeleteModal', () => {
  let mockToggleDeleteModal: Mock;
  let mockDeleteAgendaItemHandler: Mock;
  let defaultProps: InterfaceAgendaItemsDeleteModalProps;
  // Declare user variable here
  let user: ReturnType<typeof userEvent.setup>;

  // Setup fresh mocks and user session before EVERY test
  beforeEach(() => {
    // Initialize userEvent per test for isolation
    user = userEvent.setup();

    mockToggleDeleteModal = vi.fn();
    mockDeleteAgendaItemHandler = vi.fn();

    defaultProps = {
      agendaItemDeleteModalIsOpen: true,
      toggleDeleteModal: mockToggleDeleteModal,
      deleteAgendaItemHandler: mockDeleteAgendaItemHandler,
    };
  });

  // Teardown after tests
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly when open', () => {
    render(<AgendaItemsDeleteModal {...defaultProps} />);

    // Check for title and message keys
    expect(
      screen.getByText('agendaItems.deleteAgendaItem'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('agendaItems.deleteAgendaItemMsg'),
    ).toBeInTheDocument();
    // Check for button text keys passed to the template
    expect(screen.getByText('common.yes')).toBeInTheDocument();
    expect(screen.getByText('common.no')).toBeInTheDocument();
  });

  it('should not render the modal when agendaItemDeleteModalIsOpen is false', () => {
    render(
      <AgendaItemsDeleteModal
        {...defaultProps}
        agendaItemDeleteModalIsOpen={false}
      />,
    );
    // When closed, the title should be absent
    expect(
      screen.queryByText('agendaItems.deleteAgendaItem'),
    ).not.toBeInTheDocument();
  });

  it('should call toggleDeleteModal when close button is clicked', async () => {
    render(<AgendaItemsDeleteModal {...defaultProps} />);

    const closeBtn = screen.getByTestId('modal-secondary-btn');
    await user.click(closeBtn);

    expect(mockToggleDeleteModal).toHaveBeenCalledTimes(1);
  });

  it('should call deleteAgendaItemHandler when confirm button is clicked', async () => {
    render(<AgendaItemsDeleteModal {...defaultProps} />);

    const confirmBtn = screen.getByTestId('modal-primary-btn');
    await user.click(confirmBtn);

    expect(mockDeleteAgendaItemHandler).toHaveBeenCalledTimes(1);
  });
});
