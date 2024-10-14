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
import 'jest-localstorage-mock';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-location-mock';
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

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_MUTATIONS, true);

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
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
    await userEvent.click(
      screen.getAllByTestId('editAgendCategoryModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('updateAgendaCategoryModalCloseBtn'),
    );

    await waitFor(() =>
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
    await userEvent.click(
      screen.getAllByTestId('previewAgendaCategoryModalBtn')[0],
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('previewAgendaCategoryModalCloseBtn'),
    );

    await waitFor(() =>
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
    await userEvent.click(
      screen.getAllByTestId('previewAgendaCategoryModalBtn')[0],
    );

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
    await userEvent.click(screen.getByTestId('deleteAgendaCategoryModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaCategoryCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteAgendaCategoryCloseBtn'));

    await waitFor(() => screen.queryByTestId('deleteAgendaCategoryCloseBtn'));

    await waitFor(() => {
      expect(
        screen.getByTestId('editAgendaCategoryPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('editAgendaCategoryPreviewModalBtn'),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaCategoryModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(
      screen.getByTestId('updateAgendaCategoryModalCloseBtn'),
    );

    await waitFor(() =>
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
    await userEvent.click(
      screen.getAllByTestId('editAgendCategoryModalBtn')[0],
    );

    const name = screen.getByPlaceholderText(translations.name);
    const description = screen.getByPlaceholderText(translations.description);

    fireEvent.change(name, { target: { value: '' } });
    await userEvent.type(name, formData.name);

    fireEvent.change(description, { target: { value: '' } });
    await userEvent.type(description, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('editAgendaCategoryBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('editAgendaCategoryBtn'));

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
    await userEvent.click(
      screen.getAllByTestId('editAgendCategoryModalBtn')[0],
    );

    const nameInput = screen.getByLabelText(translations.name);
    const descriptionInput = screen.getByLabelText(translations.description);
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(descriptionInput, {
      target: { value: '' },
    });
    await userEvent.type(nameInput, formData.name);
    await userEvent.type(descriptionInput, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('editAgendaCategoryBtn')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('editAgendaCategoryBtn'));

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
    await userEvent.click(
      screen.getAllByTestId('previewAgendaCategoryModalBtn')[0],
    );

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
    await userEvent.click(screen.getByTestId('deleteAgendaCategoryModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaCategoryCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('deleteAgendaCategoryBtn'));

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
    await userEvent.click(
      screen.getAllByTestId('previewAgendaCategoryModalBtn')[0],
    );

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
    await userEvent.click(screen.getByTestId('deleteAgendaCategoryModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaCategoryCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('deleteAgendaCategoryBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
