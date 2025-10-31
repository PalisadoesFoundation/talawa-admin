import React from 'react';
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import GroupChatDetails from './GroupChatDetails';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useLocalStorage } from 'utils/useLocalstorage';
import { vi } from 'vitest';
import { toast } from 'react-toastify';
import {
  mocks,
  filledMockChat,
  incompleteMockChat,
} from './GroupChatDetailsMocks';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

i18n.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        // Add your translations here
      },
    },
  },
});

describe('GroupChatDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders Error modal if userId is not in localStorage', () => {
    const toastSpy = vi.spyOn(toast, 'error');

    useLocalStorage().setItem('userId', null);

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );
    expect(screen.getByText('userChat.Error')).toBeInTheDocument();
    expect(screen.getByText('User not found')).toBeInTheDocument();
    expect(toastSpy).toHaveBeenCalledTimes(1);
    expect(toastSpy).toHaveBeenCalledWith('userChat.userNotFound');
  });

  it('renders correctly without name and image', () => {
    const toastSpy = vi.spyOn(toast, 'error');
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={incompleteMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    expect(toastSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByText('userChat.groupInfo')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
  });

  it('renders correctly', () => {
    const toastSpy = vi.spyOn(toast, 'error');
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    expect(toastSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
  });

  it('cancelling editing chat title', async () => {
    useLocalStorage().setItem('userId', '2');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={incompleteMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('cancelEditBtn')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('cancelEditBtn'));
    });

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('edit chat title', async () => {
    useLocalStorage().setItem('userId', '2');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();

    await act(async () => {
      fireEvent.click(await screen.findByTestId('editTitleBtn'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('chatNameInput')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('chatNameInput'), {
        target: { value: 'New Group name' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('updateTitleBtn'));
    });

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editTitleBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('add user to group chat using first name', async () => {
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();
    await act(async () => {
      fireEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('searchUser'), {
        target: { value: 'Disha' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('searchBtn'));
    });

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('user')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      fireEvent.click(await screen.findByTestId('addUserBtn'));
    });
  });

  it('add user to group chat using last name', async () => {
    useLocalStorage().setItem('userId', 'user1');

    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={filledMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();
    await act(async () => {
      fireEvent.click(await screen.findByTestId('addMembers'));
    });

    await waitFor(async () => {
      expect(await screen.findByTestId('searchUser')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(await screen.findByTestId('searchUser'), {
        target: { value: 'Smith' },
      });
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId('searchBtn'));
    });

    await wait();
  });

  it('handling invalid image type', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MockedProvider mocks={mocks}>
          <GroupChatDetails
            toggleGroupChatDetailsModal={vi.fn()}
            groupChatDetailsModalisOpen={true}
            chat={incompleteMockChat}
            chatRefetch={vi.fn()}
          />
        </MockedProvider>
      </I18nextProvider>,
    );

    await wait();

    await waitFor(
      async () => {
        expect(await screen.findByTestId('editImageBtn')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    await act(async () => {
      fireEvent.click(await screen.findByTestId('editImageBtn'));
    });

    const fileInput = screen.getByTestId('fileInput');

    Object.defineProperty(fileInput, 'files', {
      value: null,
    });

    fireEvent.change(fileInput);
  });
});
