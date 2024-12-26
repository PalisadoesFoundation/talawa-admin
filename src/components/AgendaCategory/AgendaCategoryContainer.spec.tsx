import React from 'react';
import {
  render,
  screen,
  waitFor,
  act,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
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

import AgendaCategoryContainer from './AgendaCategoryContainer';
import { props, props2 } from './AgendaCategoryContainerProps';
import { MOCKS, MOCKS_ERROR_MUTATIONS } from './AgendaCategoryContainerMocks';
import { vi, describe, test, expect } from 'vitest';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_MUTATIONS, true);

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(async () => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  });
}

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationAgendaCategory,
  ),
);

describe('Testing Agenda Category Component', () => {
  const formData = {
    name: 'AgendaCategory 1 Edited',
    description: 'AgendaCategory 1 Description Edited',
  };

  test('component loads correctly with categories', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaCategoryContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );
    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noAgendaCategories),
      ).not.toBeInTheDocument();
    });
  });

  test('component loads correctly with no agenda Categories', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaCategoryContainer {...props2} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noAgendaCategories),
      ).toBeInTheDocument();
    });
  });

  test('opens and closes the update modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaCategoryContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendCategoryModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editAgendCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateAgendaCategoryModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('updateAgendaCategoryModalCloseBtn'),
    );
  });

  test('opens and closes the preview modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaCategoryContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaCategoryModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewAgendaCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('previewAgendaCategoryModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('previewAgendaCategoryModalCloseBtn'),
    );
  });

  test('opens and closes the update and delete modals through the preview modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaCategoryContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaCategoryModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewAgendaCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteAgendaCategoryModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteAgendaCategoryModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaCategoryCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteAgendaCategoryCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('deleteAgendaCategoryCloseBtn'),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('editAgendaCategoryPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editAgendaCategoryPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateAgendaCategoryModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('updateAgendaCategoryModalCloseBtn'),
    );
  });

  test('updates an agenda category and toasts success', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaCategoryContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendCategoryModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editAgendCategoryModalBtn')[0]);

    const name = screen.getByPlaceholderText(translations.name);
    const description = screen.getByPlaceholderText(translations.description);

    fireEvent.change(name, { target: { value: '' } });
    userEvent.type(name, formData.name);

    fireEvent.change(description, { target: { value: '' } });
    userEvent.type(description, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('editAgendaCategoryBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editAgendaCategoryBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.agendaCategoryUpdated,
      );
    });
  });

  test('toasts error on unsuccessful updation', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaCategoryContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendCategoryModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editAgendCategoryModalBtn')[0]);

    const nameInput = screen.getByLabelText(translations.name);
    const descriptionInput = screen.getByLabelText(translations.description);
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(descriptionInput, {
      target: { value: '' },
    });
    userEvent.type(nameInput, formData.name);
    userEvent.type(descriptionInput, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('editAgendaCategoryBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editAgendaCategoryBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('deletes the agenda category and toasts success', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaCategoryContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaCategoryModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewAgendaCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteAgendaCategoryModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteAgendaCategoryModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaCategoryCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('deleteAgendaCategoryBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.agendaCategoryDeleted,
      );
    });
  });

  test('toasts error on unsuccessful deletion', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaCategoryContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaCategoryModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewAgendaCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteAgendaCategoryModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteAgendaCategoryModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaCategoryCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteAgendaCategoryBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
