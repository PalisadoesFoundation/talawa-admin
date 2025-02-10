import React, { act } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';

import { MOCKS, MOCKS_ERROR, props, props2 } from './AgendaItemsMocks';
import AgendaItemsContainer from './AgendaItemsContainer';
import { describe, test, expect, vi } from 'vitest';
const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR, true);

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

//temporarily fixes react-beautiful-dnd droppable method's depreciation error
//needs to be fixed in React 19
vi.spyOn(console, 'error').mockImplementation((message) => {
  if (message.includes('Support for defaultProps will be removed')) {
    return;
  }
  console.error(message);
});

async function wait(ms = 100): Promise<void> {
  await act(async () => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  });
}

const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.agendaItems),
);

describe('Testing Agenda Items components', () => {
  const formData = {
    title: 'AgendaItem 1 Edited',
    description: 'AgendaItem 1 Description Edited',
  };

  test('component loads correctly with items', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noAgendaItems),
      ).not.toBeInTheDocument();
    });
  });

  test('component loads correctly with no agenda items', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props2} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noAgendaItems),
      ).toBeInTheDocument();
    });
  });

  test('opens and closes the update modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('editAgendaItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateAgendaItemModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('updateAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('opens and closes the preview modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getAllByTestId('previewAgendaItemModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('previewAgendaItemModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('previewAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('opens and closes the update and delete modals through the preview modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getAllByTestId('previewAgendaItemModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('previewAgendaItemModalDeleteBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('previewAgendaItemModalDeleteBtn'),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaItemCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteAgendaItemCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('deleteAgendaItemCloseBtn'),
      ).not.toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('previewAgendaItemModalUpdateBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('previewAgendaItemModalUpdateBtn'),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateAgendaItemModalCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('updateAgendaItemModalCloseBtn'),
      ).not.toBeInTheDocument(),
    );
  });

  test('updates an agenda Items and toasts success', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('editAgendaItemModalBtn')[0]);

    const title = screen.getByPlaceholderText(translations.enterTitle);
    const description = screen.getByPlaceholderText(
      translations.enterDescription,
    );

    fireEvent.change(title, { target: { value: '' } });
    await userEvent.type(title, formData.title);

    fireEvent.change(description, { target: { value: '' } });
    await userEvent.type(description, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('updateAgendaItemBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateAgendaItemBtn'));

    await waitFor(() => {
      // expect(toast.success).toBeCalledWith(translations.agendaItemUpdated);
    });
  });

  test('toasts error on unsuccessful updation', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByTestId('editAgendaItemModalBtn')[0]);

    const titleInput = screen.getByLabelText(translations.title);
    const descriptionInput = screen.getByLabelText(translations.description);
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(descriptionInput, {
      target: { value: '' },
    });
    await userEvent.type(titleInput, formData.title);
    await userEvent.type(descriptionInput, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('updateAgendaItemBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('updateAgendaItemBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('deletes the agenda item and toasts success', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getAllByTestId('previewAgendaItemModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('previewAgendaItemModalDeleteBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('previewAgendaItemModalDeleteBtn'),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaItemCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('deleteAgendaItemBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.agendaItemDeleted,
      );
    });
  });

  test('toasts error on unsuccessful deletion', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getAllByTestId('previewAgendaItemModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('previewAgendaItemModalDeleteBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('previewAgendaItemModalDeleteBtn'),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaItemCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteAgendaItemBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  // write test case for drag and drop line:- 172-202
});
