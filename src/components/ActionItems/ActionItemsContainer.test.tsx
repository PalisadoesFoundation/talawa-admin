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

import ActionItemsContainer from './ActionItemsContainer';
import { props, props2 } from './ActionItemsContainerProps';
import { MOCKS, MOCKS_ERROR_MUTATIONS } from './ActionItemsContainerMocks';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_MUTATIONS, true);

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

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationActionItems,
  ),
);

describe('Testing Action Item Categories Component', () => {
  const formData = {
    assignee: 'Scott Norris',
    preCompletionNotes: 'pre completion notes edited',
    dueDate: '02/14/2024',
    completionDate: '02/21/2024',
  };

  test('component loads correctly with action items', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ActionItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noActionItems),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText(translations.assignee)).toBeInTheDocument();
    expect(
      screen.getByText(translations.actionItemCategory),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations.preCompletionNotes),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations.postCompletionNotes),
    ).toBeInTheDocument();

    await wait();
    expect(screen.getAllByText('Harve Lance')[0]).toBeInTheDocument();

    const asigneeAnchorElement = screen.getAllByText('Harve Lance')[0];
    expect(asigneeAnchorElement.tagName).toBe('A');
    expect(asigneeAnchorElement).toHaveAttribute('href', '/member/event1');

    expect(screen.getAllByText('ActionItemCategory 1')[0]).toBeInTheDocument();
    const updateButtons = screen.getAllByTestId('editActionItemModalBtn');
    const previewButtons = screen.getAllByTestId('previewActionItemModalBtn');
    const updateStatusButtons = screen.getAllByTestId(
      'actionItemStatusChangeCheckbox',
    );
    expect(updateButtons[0]).toBeInTheDocument();
    expect(previewButtons[0]).toBeInTheDocument();
    expect(updateStatusButtons[0]).toBeInTheDocument();
  });

  test('component loads correctly with no action items', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ActionItemsContainer {...props2} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noActionItems),
      ).toBeInTheDocument();
    });
  });

  test('opens and closes the update modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editActionItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editActionItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateActionItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('updateActionItemModalCloseBtn'),
    );
  });

  test('opens and closes the action item status change modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('actionItemStatusChangeCheckbox')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('actionItemStatusChangeCheckbox')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('actionItemStatusChangeModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('actionItemStatusChangeModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('actionItemStatusChangeModalCloseBtn'),
    );
  });

  test('completed action item status change modal loads correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('actionItemStatusChangeCheckbox')[1],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('actionItemStatusChangeCheckbox')[1]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('actionItemStatusChangeModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    expect(screen.getByText(translations.actionItemStatus)).toBeInTheDocument();

    expect(
      screen.getByTestId('actionItemsStatusChangeNotes'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(translations.actionItemCompleted),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: translations.makeActive }),
    ).toBeInTheDocument();
  });

  test('opens and closes the preview modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewActionItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewActionItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('previewActionItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('previewActionItemModalCloseBtn'),
    );
  });

  test('opens and closes the update and delete modals through the preview modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewActionItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewActionItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteActionItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteActionItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('actionItemDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('actionItemDeleteModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('actionItemDeleteModalCloseBtn'),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('editActionItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editActionItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateActionItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('updateActionItemModalCloseBtn'),
    );
  });

  test('updates an action item and toasts success', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editActionItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editActionItemModalBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('formUpdateAssignee')).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formUpdateAssignee'),
      formData.assignee,
    );

    const preCompletionNotes = screen.getByPlaceholderText(
      translations.preCompletionNotes,
    );
    fireEvent.change(preCompletionNotes, { target: { value: '' } });
    userEvent.type(preCompletionNotes, formData.preCompletionNotes);

    // const postCompletionNotes = screen.getByPlaceholderText(
    //   translations.postCompletionNotes,
    // );
    // fireEvent.change(postCompletionNotes, { target: { value: '' } });
    // userEvent.type(postCompletionNotes, formData.postCompletionNotes);

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    const completionDatePicker = screen.getByLabelText(
      translations.completionDate,
    );
    fireEvent.change(completionDatePicker, {
      target: { value: formData.completionDate },
    });

    // await waitFor(() => {
    //   expect(screen.getByTestId('alldayCheck')).toBeInTheDocument();
    // });
    // userEvent.click(screen.getByTestId('alldayCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('editActionItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editActionItemBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });
  });

  test('toasts error on unsuccessful updation', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editActionItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editActionItemModalBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('formUpdateAssignee')).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formUpdateAssignee'),
      formData.assignee,
    );

    const preCompletionNotes = screen.getByPlaceholderText(
      translations.preCompletionNotes,
    );
    fireEvent.change(preCompletionNotes, { target: { value: '' } });
    userEvent.type(preCompletionNotes, formData.preCompletionNotes);

    // const postCompletionNotes = screen.getByPlaceholderText(
    //   translations.postCompletionNotes,
    // );
    // fireEvent.change(postCompletionNotes, { target: { value: '' } });
    // userEvent.type(postCompletionNotes, formData.postCompletionNotes);

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    const completionDatePicker = screen.getByLabelText(
      translations.completionDate,
    );
    fireEvent.change(completionDatePicker, {
      target: { value: formData.completionDate },
    });

    // await waitFor(() => {
    //   expect(screen.getByTestId('alldayCheck')).toBeInTheDocument();
    // });
    // userEvent.click(screen.getByTestId('alldayCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('editActionItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editActionItemBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('updates an action item status through the action item status change modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('actionItemStatusChangeCheckbox')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('actionItemStatusChangeCheckbox')[0]);

    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemsStatusChangeNotes'),
      ).toBeInTheDocument();
    });

    const postCompletionNotes = screen.getByTestId(
      'actionItemsStatusChangeNotes',
    );
    fireEvent.change(postCompletionNotes, { target: { value: '' } });
    userEvent.type(
      postCompletionNotes,
      'this action item has been completed successfully',
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemStatusChangeSubmitBtn'),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByTestId('actionItemStatusChangeSubmitBtn'),
    ).toHaveTextContent(translations.markCompletion);
    userEvent.click(screen.getByTestId('actionItemStatusChangeSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });

    await waitFor(() => {
      expect(
        screen.getAllByTestId('actionItemStatusChangeCheckbox')[1],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('actionItemStatusChangeCheckbox')[1]);

    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemsStatusChangeNotes'),
      ).toBeInTheDocument();
    });

    const preCompletionNotes = screen.getByTestId(
      'actionItemsStatusChangeNotes',
    );
    fireEvent.change(preCompletionNotes, { target: { value: '' } });
    userEvent.type(
      preCompletionNotes,
      'this action item has been made active again',
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('actionItemStatusChangeSubmitBtn'),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByTestId('actionItemStatusChangeSubmitBtn'),
    ).toHaveTextContent(translations.makeActive);
    userEvent.click(screen.getByTestId('actionItemStatusChangeSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });
  });

  test('deletes the action item and toasts success', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewActionItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewActionItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteActionItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteActionItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('actionItemDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('deleteActionItemBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulDeletion);
    });
  });

  test('toasts error on unsuccessful deletion', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewActionItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewActionItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewActionItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteActionItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteActionItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('actionItemDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteActionItemBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('shows the overlay text on action item notes', async () => {
    const { getAllByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <ActionItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('actionItemPreCompletionNotesOverlay')[0],
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.mouseEnter(
        getAllByTestId('actionItemPreCompletionNotesOverlay')[0],
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('popover-actionItem1')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.mouseLeave(
        getAllByTestId('actionItemPreCompletionNotesOverlay')[0],
      );
    });

    await waitFor(() => {
      fireEvent.mouseEnter(
        getAllByTestId('actionItemPostCompletionNotesOverlay')[0],
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('popover-actionItem2')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.mouseLeave(
        getAllByTestId('actionItemPostCompletionNotesOverlay')[0],
      );
    });
  });

  test('Action Items loads with correct headers', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <ActionItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    const actionItemHeaders = screen.getByTestId('actionItemsHeader');
    expect(actionItemHeaders).toBeInTheDocument();
    expect(screen.getByText(translations.assignee)).toBeInTheDocument();
    expect(
      screen.getByText(translations.actionItemCategory),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations.preCompletionNotes),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations.postCompletionNotes),
    ).toBeInTheDocument();
    expect(screen.getByText(translations.options)).toBeInTheDocument();
  });
});
