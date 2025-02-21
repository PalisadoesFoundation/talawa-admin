/**
 * Unit tests for the Actions component.
 */

import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18n from 'utils/i18nForTest';
import Actions from './Actions';
import type { ApolloLink } from '@apollo/client';
import { MOCKS, EMPTY_MOCKS, ERROR_MOCKS } from './Actions.mocks';
import useLocalStorage from 'utils/useLocalstorage';
import { describe, it, beforeEach, afterEach, vi } from 'vitest';

const { setItem } = useLocalStorage();

const link1 = new StaticMockLink(MOCKS);
const link2 = new StaticMockLink(ERROR_MOCKS);
const link3 = new StaticMockLink(EMPTY_MOCKS);

const t = {
  ...i18n.getDataByLanguage('en')?.translation.organizationActionItems,
  ...i18n.getDataByLanguage('en')?.common,
  ...i18n.getDataByLanguage('en')?.errors,
};

const debounceWait = async (ms = 300): Promise<void> => {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderActions = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/user/volunteer/orgId']}>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/:orgId" element={<Actions />} />
                <Route path="/" element={<div data-testid="paramsError"></div>} />
              </Routes>
            </I18nextProvider>
          </LocalizationProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>
  );
};

describe('Testing Actions Screen', () => {
  beforeEach(() => {
    setItem('userId', 'userId');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should redirect to fallback URL if URL params are undefined', async () => {
    setItem('userId', null);
    render(
      <MockedProvider addTypename={false} link={link1}>
        <MemoryRouter initialEntries={['/user/volunteer/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <Routes>
                <Route path="/user/volunteer/" element={<Actions />} />
                <Route path="/" element={<div data-testid="paramsError"></div>} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('paramsError')).toBeInTheDocument();
    });
  });

  it('should render Actions screen', async () => {
    renderActions(link1);
    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
    });

    const assigneeName = await screen.findAllByTestId('assigneeName');
    expect(assigneeName[0]).toHaveTextContent('Teresa Bradley');
  });

  it('should sort items correctly', async () => {
    renderActions(link1);

    const sortBtn = await screen.findByTestId('sort');
    fireEvent.click(sortBtn);

    const dueDateDESC = await screen.findByTestId('dueDate_DESC');
    fireEvent.click(dueDateDESC);

    await waitFor(() => {
      const assigneeName = screen.getAllByTestId('assigneeName');
      expect(assigneeName[0]).toHaveTextContent('Group 1');
    });

    fireEvent.click(sortBtn);
    const dueDateASC = await screen.findByTestId('dueDate_ASC');
    fireEvent.click(dueDateASC);

    await waitFor(() => {
      const assigneeName = screen.getAllByTestId('assigneeName');
      expect(assigneeName[0]).toHaveTextContent('Teresa Bradley');
    });
  });

  it('should search by assignee name', async () => {
    renderActions(link1);
    const searchInput = await screen.findByTestId('searchBy');
    await userEvent.type(searchInput, '1');

    await debounceWait();
    fireEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      const assigneeName = screen.getAllByTestId('assigneeName');
      expect(assigneeName[0]).toHaveTextContent('Group 1');
    });
  });

  it('should show "No Actions" screen', async () => {
    renderActions(link3);

    await waitFor(() => {
      expect(screen.getByTestId('searchBy')).toBeInTheDocument();
      expect(screen.getByText(t.noActionItems)).toBeInTheDocument();
    });
  });

  it('should display error message when fetching data fails', async () => {
    renderActions(link2);

    await waitFor(() => {
      expect(screen.getByTestId('errorMsg')).toBeInTheDocument();
    });
  });

  it('should open and close ItemUpdateStatusModal', async () => {
    renderActions(link1);
    const checkbox = await screen.findAllByTestId('statusCheckbox');
    await userEvent.click(checkbox[0]);

    await waitFor(() => {
      expect(screen.getByText(t.actionItemStatus)).toBeInTheDocument();
    });

    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });

  it('should open and close ItemViewModal', async () => {
    renderActions(link1);
    const viewItemBtn = await screen.findAllByTestId('viewItemBtn');
    await userEvent.click(viewItemBtn[0]);

    await waitFor(() => {
      expect(screen.getByText(t.actionItemDetails)).toBeInTheDocument();
    });

    await userEvent.click(await screen.findByTestId('modalCloseBtn'));
  });
});
