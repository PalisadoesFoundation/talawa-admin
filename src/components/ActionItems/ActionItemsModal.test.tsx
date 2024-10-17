import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { ActionItemsModal } from './ActionItemsModal';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';

import {
  MOCKS_ERROR_ACTION_ITEM_CATEGORY_LIST_QUERY,
  MOCKS_ERROR_ACTION_ITEM_LIST_QUERY,
  MOCKS_ERROR_MEMBERS_LIST_QUERY,
  MOCKS_ERROR_MUTATIONS,
} from '../../screens/OrganizationActionItems/OrganizationActionItemsErrorMocks';
import { MOCKS } from '../../screens/OrganizationActionItems/OrganizationActionItemMocks';
import { StaticMockLink } from 'utils/StaticMockLink';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@mui/x-date-pickers/DateTimePicker', () => {
  return {
    DateTimePicker: jest.requireActual(
      '@mui/x-date-pickers/DesktopDateTimePicker',
    ).DesktopDateTimePicker,
  };
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(
  MOCKS_ERROR_ACTION_ITEM_CATEGORY_LIST_QUERY,
  true,
);
const link3 = new StaticMockLink(MOCKS_ERROR_MEMBERS_LIST_QUERY, true);
const link4 = new StaticMockLink(MOCKS_ERROR_ACTION_ITEM_LIST_QUERY, true);
const link5 = new StaticMockLink(MOCKS_ERROR_MUTATIONS, true);

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

describe('Testing Check In Attendees Modal', () => {
  const formData = {
    actionItemCategory: 'ActionItemCategory 1',
    assignee: 'Harve Lance',
    preCompletionNotes: 'pre completion notes',
    dueDate: '02/14/2024',
  };

  const props = {
    show: true,
    eventId: 'event1',
    orgId: '123',
    handleClose: jest.fn(),
  };

  test('The modal should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).toBeInTheDocument(),
    );

    await waitFor(() => {
      return expect(
        screen.findByTestId('createEventActionItemBtn'),
      ).resolves.toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful action item category list query', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ActionItemsModal {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(queryByText('createEventActionItemBtn')).not.toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful member list query', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ActionItemsModal {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(queryByText('createEventActionItemBtn')).not.toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful action items list query', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link4}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ActionItemsModal {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(queryByText('createEventActionItemBtn')).not.toBeInTheDocument();
    });
  });

  test('creates new action item associated with the event', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsModal {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getByTestId('createEventActionItemBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createEventActionItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('formSelectActionItemCategory'),
      ).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formSelectActionItemCategory'),
      formData.actionItemCategory,
    );

    userEvent.selectOptions(
      screen.getByTestId('formSelectAssignee'),
      formData.assignee,
    );

    userEvent.type(
      screen.getByPlaceholderText(translations.preCompletionNotes),
      formData.preCompletionNotes,
    );

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    userEvent.click(screen.getByTestId('createActionItemFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulCreation);
    });
  });

  test('toasts error on unsuccessful creation', async () => {
    render(
      <MockedProvider addTypename={false} link={link5}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsModal {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getByTestId('createEventActionItemBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createEventActionItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('formSelectActionItemCategory'),
      ).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formSelectActionItemCategory'),
      formData.actionItemCategory,
    );

    userEvent.selectOptions(
      screen.getByTestId('formSelectAssignee'),
      formData.assignee,
    );

    userEvent.type(
      screen.getByPlaceholderText(translations.preCompletionNotes),
      formData.preCompletionNotes,
    );

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    userEvent.click(screen.getByTestId('createActionItemFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
