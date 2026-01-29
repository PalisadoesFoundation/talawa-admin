import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import i18nForTest from 'utils/i18nForTest';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';

import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';

import AgendaCategoryContainer from './AgendaCategoryContainer';
import {
  props,
  props2,
  MOCKS,
  MOCKS_ERROR_MUTATIONS,
} from './AgendaCategoryContainerMocks';
import { vi, describe, test, expect } from 'vitest';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_MUTATIONS, true);

const mockNotificationToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  dismiss: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: mockNotificationToast,
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
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  const formData = {
    name: 'AgendaCategory 1 Edited',
    description: 'AgendaCategory 1 Description Edited',
  };

  test('component loads correctly with categories', async () => {
    render(
      <MockedProvider link={link}>
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
      <MockedProvider link={link}>
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
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
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
    await user.click(screen.getAllByTestId('editAgendCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await user.click(screen.getByTestId('modalCloseBtn'));

    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument(),
    );
  });

  test('opens and closes the preview modal correctly', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
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
    await user.click(screen.getAllByTestId('previewAgendaCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await user.click(screen.getByTestId('modalCloseBtn'));

    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument(),
    );
  });

  test('opens and closes the update and delete modals through the preview modal', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
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
    await user.click(screen.getAllByTestId('previewAgendaCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteAgendaCategoryModalBtn'),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('deleteAgendaCategoryModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaCategoryCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await user.click(screen.getByTestId('deleteAgendaCategoryCloseBtn'));

    await waitFor(() =>
      expect(
        screen.queryByTestId('deleteAgendaCategoryCloseBtn'),
      ).not.toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('editAgendaCategoryPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('editAgendaCategoryPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await user.click(screen.getByTestId('modalCloseBtn'));

    await waitFor(() =>
      expect(screen.queryByTestId('modalCloseBtn')).not.toBeInTheDocument(),
    );
  });

  test('updates an agenda category and toasts success', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
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
    await user.click(screen.getAllByTestId('editAgendCategoryModalBtn')[0]);

    const name = screen.getByPlaceholderText(translations.name);
    const description = screen.getByPlaceholderText(translations.description);

    await user.clear(name);
    await user.type(name, formData.name);

    await user.clear(description);
    await user.type(description, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('editAgendaCategoryBtn')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('editAgendaCategoryBtn'));

    await waitFor(() => {
      expect(mockNotificationToast.success).toHaveBeenCalledWith(
        translations.agendaCategoryUpdated,
      );
    });
  });

  test('toasts error on unsuccessful updation', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link2}>
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
    await user.click(screen.getAllByTestId('editAgendCategoryModalBtn')[0]);

    const nameInput = screen.getByLabelText(translations.name);
    const descriptionInput = screen.getByLabelText(translations.description);
    await user.clear(nameInput);
    await user.clear(descriptionInput);

    await user.type(nameInput, formData.name);
    await user.type(descriptionInput, formData.description);

    await waitFor(() => {
      expect(screen.getByTestId('editAgendaCategoryBtn')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('editAgendaCategoryBtn'));

    await waitFor(() => {
      expect(mockNotificationToast.error).toHaveBeenCalled();
    });
  });

  test('deletes the agenda category and toasts success', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link}>
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
    await user.click(screen.getAllByTestId('previewAgendaCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteAgendaCategoryModalBtn'),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('deleteAgendaCategoryModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaCategoryCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await user.click(screen.getByTestId('deleteAgendaCategoryBtn'));

    await waitFor(() => {
      expect(mockNotificationToast.success).toHaveBeenCalledWith(
        translations.agendaCategoryDeleted,
      );
    });
  });

  test('toasts error on unsuccessful deletion', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider link={link2}>
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
    await user.click(screen.getAllByTestId('previewAgendaCategoryModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('modalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteAgendaCategoryModalBtn'),
      ).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('deleteAgendaCategoryModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('deleteAgendaCategoryCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    await user.click(screen.getByTestId('deleteAgendaCategoryBtn'));

    await waitFor(() => {
      expect(mockNotificationToast.error).toHaveBeenCalled();
    });
  });
});
