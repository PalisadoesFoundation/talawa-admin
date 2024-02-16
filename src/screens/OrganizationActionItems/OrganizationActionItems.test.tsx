import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  waitForElementToBeRemoved,
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

import OrganizationActionItems from './OrganizationActionItems';
import {
  MOCKS,
  MOCKS_ERROR_ACTION_ITEM_CATEGORY_LIST_QUERY,
  MOCKS_ERROR_ACTION_ITEM_LIST_QUERY,
  MOCKS_ERROR_MEMBERS_LIST_QUERY,
  MOCKS_ERROR_MUTATIONS,
} from './OrganizationActionItemMocks';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@mui/x-date-pickers/DateTimePicker', () => {
  return {
    DateTimePicker: jest.requireActual(
      '@mui/x-date-pickers/DesktopDateTimePicker'
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
  true
);
const link3 = new StaticMockLink(MOCKS_ERROR_MEMBERS_LIST_QUERY, true);
const link4 = new StaticMockLink(MOCKS_ERROR_ACTION_ITEM_LIST_QUERY, true);
const link5 = new StaticMockLink(MOCKS_ERROR_MUTATIONS, true);

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems
  )
);

describe('Testing Action Item Categories Component', () => {
  const formData = {
    actionItemCategory: 'ActionItemCategory 1',
    assignee: 'Harve Lance',
    preCompletionNotes: 'pre completion notes',
    dueDate: '02/14/2024',
  };

  test('Component loads correctly', async () => {
    window.location.assign('/organizationActionItems/id=123');
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(getByText(translations.createActionItem)).toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful action item category list query', async () => {
    window.location.assign('/organizationActionItems/id=123');
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createActionItem)
      ).not.toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful members list query', async () => {
    window.location.assign('/organizationActionItems/id=123');
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createActionItem)
      ).not.toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful action item list query', async () => {
    window.location.assign('/organizationActionItems/id=123');
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link4}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createActionItem)
      ).not.toBeInTheDocument();
    });
  });

  test('sorts action items in earliest or latest first order based on orderBy', async () => {
    window.location.assign('/organizationActionItems/id=123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('sortActionItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortActionItems'));

    await waitFor(() => {
      expect(screen.getByTestId('earliest')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('earliest'));

    await waitFor(() => {
      expect(screen.getByTestId('sortActionItems')).toHaveTextContent(
        translations.earliest
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('sortActionItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortActionItems'));

    await waitFor(() => {
      expect(screen.getByTestId('latest')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('latest'));

    await waitFor(() => {
      expect(screen.getByTestId('sortActionItems')).toHaveTextContent(
        translations.latest
      );
    });
  });

  test('applies and then clears all the filters', async () => {
    window.location.assign('/organizationActionItems/id=123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationActionItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('sortActionItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortActionItems'));

    await waitFor(() => {
      expect(screen.getByTestId('earliest')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('earliest'));

    // all the action items ordered by earliest first
    await waitFor(() => {
      expect(screen.getByTestId('sortActionItems')).toHaveTextContent(
        translations.earliest
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('selectActionItemStatus')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('selectActionItemStatus'));

    await waitFor(() => {
      expect(screen.getByTestId('activeActionItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('activeActionItems'));

    // all the action items that are active
    await waitFor(() => {
      expect(screen.getByTestId('selectActionItemStatus')).toHaveTextContent(
        translations.active
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('selectActionItemStatus')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('selectActionItemStatus'));

    await waitFor(() => {
      expect(screen.getByTestId('completedActionItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('completedActionItems'));

    // all the action items that are completed
    await waitFor(() => {
      expect(screen.getByTestId('selectActionItemStatus')).toHaveTextContent(
        translations.completed
      );
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('selectActionItemCategory')
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('selectActionItemCategory'));

    await waitFor(() => {
      expect(
        screen.getAllByTestId('actionItemCategory')[0]
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('actionItemCategory')[0]);

    // action items belonging to this category
    await waitFor(() => {
      expect(screen.getByTestId('selectActionItemCategory')).toHaveTextContent(
        'ActionItemCategory 1'
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('clearFilters')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('clearFilters'));

    // filters cleared, all the action items belonging to the organization
    await waitFor(() => {
      expect(screen.getByTestId('sortActionItems')).toHaveTextContent(
        translations.latest
      );
      expect(screen.getByTestId('selectActionItemStatus')).toHaveTextContent(
        translations.status
      );
      expect(screen.getByTestId('selectActionItemCategory')).toHaveTextContent(
        translations.actionItemCategory
      );
    });
  });

  test('opens and closes the create action item modal', async () => {
    window.location.assign('/organizationActionItems/id=123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizationActionItems />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createActionItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createActionItemModalCloseBtn')
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createActionItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('createActionItemModalCloseBtn')
    );
  });

  test('creates new action item', async () => {
    window.location.assign('/organizationActionItems/id=123');

    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizationActionItems />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createActionItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createActionItemModalCloseBtn')
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('formSelectActionItemCategory')
      ).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formSelectActionItemCategory'),
      formData.actionItemCategory
    );

    userEvent.selectOptions(
      screen.getByTestId('formSelectAssignee'),
      formData.assignee
    );

    userEvent.type(
      screen.getByPlaceholderText(translations.preCompletionNotes),
      formData.preCompletionNotes
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
    window.location.assign('/organizationActionItems/id=123');

    render(
      <MockedProvider addTypename={false} link={link5}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizationActionItems />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createActionItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createActionItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createActionItemModalCloseBtn')
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('formSelectActionItemCategory')
      ).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formSelectActionItemCategory'),
      formData.actionItemCategory
    );

    userEvent.selectOptions(
      screen.getByTestId('formSelectAssignee'),
      formData.assignee
    );

    userEvent.type(
      screen.getByPlaceholderText(translations.preCompletionNotes),
      formData.preCompletionNotes
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
