import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
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

import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';

import OrgActionItemCategories from './OrgActionItemCategories';
import {
  MOCKS,
  MOCKS_ERROR_QUERY,
  MOCKS_ERROR_MUTATIONS,
} from './OrgActionItemCategoryMocks';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_QUERY, true);
const link3 = new StaticMockLink(MOCKS_ERROR_MUTATIONS, true);

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.orgActionItemCategories,
  ),
);

describe('Testing Action Item Categories Component', () => {
  test('Component loads correctly', async () => {
    window.location.assign('/orgsetting/id=123');
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(getByText(translations.createButton)).toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful query', async () => {
    window.location.assign('/orgsetting/id=123');
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(queryByText(translations.createButton)).not.toBeInTheDocument();
    });
  });

  test('opens and closes create and update modals on button clicks', async () => {
    window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      userEvent.click(screen.getByTestId('actionItemCategoryModalOpenBtn'));
      userEvent.click(screen.getByTestId('actionItemCategoryModalCloseBtn'));
    });

    await waitFor(() => {
      userEvent.click(
        screen.getAllByTestId('actionItemCategoryUpdateModalOpenBtn')[0],
      );
      userEvent.click(screen.getByTestId('actionItemCategoryModalCloseBtn'));
    });
  });

  test('create a new action item category', async () => {
    window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      userEvent.click(screen.getByTestId('actionItemCategoryModalOpenBtn'));
      userEvent.type(
        screen.getByPlaceholderText(translations.enterName),
        'ActionItemCategory 4',
      );

      userEvent.click(screen.getByTestId('formSubmitButton'));
    });

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulCreation);
    });
  });

  test('toast error on unsuccessful creation', async () => {
    window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      userEvent.click(screen.getByTestId('actionItemCategoryModalOpenBtn'));
      userEvent.type(
        screen.getByPlaceholderText(translations.enterName),
        'ActionItemCategory 4',
      );

      userEvent.click(screen.getByTestId('formSubmitButton'));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('update an action item category', async () => {
    window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      userEvent.click(
        screen.getAllByTestId('actionItemCategoryUpdateModalOpenBtn')[0],
      );

      const name = screen.getByPlaceholderText(translations.enterName);
      fireEvent.change(name, { target: { value: '' } });

      userEvent.type(
        screen.getByPlaceholderText(translations.enterName),
        'ActionItemCategory 1 updated',
      );

      userEvent.click(screen.getByTestId('formSubmitButton'));
    });

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });
  });

  test('toast error on unsuccessful updation', async () => {
    window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      userEvent.click(
        screen.getAllByTestId('actionItemCategoryUpdateModalOpenBtn')[0],
      );

      const name = screen.getByPlaceholderText(translations.enterName);
      fireEvent.change(name, { target: { value: '' } });

      userEvent.type(
        screen.getByPlaceholderText(translations.enterName),
        'ActionItemCategory 1 updated',
      );

      userEvent.click(screen.getByTestId('formSubmitButton'));
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('toast error on providing the same name on updation', async () => {
    window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      userEvent.click(
        screen.getAllByTestId('actionItemCategoryUpdateModalOpenBtn')[0],
      );

      const name = screen.getByPlaceholderText(translations.enterName);
      fireEvent.change(name, { target: { value: '' } });

      userEvent.type(
        screen.getByPlaceholderText(translations.enterName),
        'ActionItemCategory 1',
      );

      userEvent.click(screen.getByTestId('formSubmitButton'));
    });

    await waitFor(() => {
      expect(toast.error).toBeCalledWith(translations.sameNameConflict);
    });
  });

  test('toggle the disablity status of an action item category', async () => {
    window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      userEvent.click(screen.getAllByTestId('disabilityStatusButton')[0]);
    });

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.categoryDisabled);
    });

    await waitFor(() => {
      userEvent.click(screen.getAllByTestId('disabilityStatusButton')[1]);
    });

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.categoryEnabled);
    });
  });

  test('toast error on unsuccessful toggling of the disablity status', async () => {
    window.location.assign('/orgsetting/id=123');
    render(
      <MockedProvider addTypename={false} link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrgActionItemCategories />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      userEvent.click(screen.getAllByTestId('disabilityStatusButton')[0]);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    await waitFor(() => {
      userEvent.click(screen.getAllByTestId('disabilityStatusButton')[1]);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
