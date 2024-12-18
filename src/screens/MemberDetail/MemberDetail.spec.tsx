import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import MemberDetail, { getLanguageName, prettyDate } from './MemberDetail';
import { MOCKS1, MOCKS2, MOCKS3 } from './MemberDetailMocks';
import type { ApolloLink } from '@apollo/client';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);
const link3 = new StaticMockLink(MOCKS3, true);

async function wait(ms = 500): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

const translations = {
  ...JSON.parse(
    JSON.stringify(
      i18nForTest.getDataByLanguage('en')?.translation.memberDetail ?? {},
    ),
  ),
  ...JSON.parse(
    JSON.stringify(i18nForTest.getDataByLanguage('en')?.common ?? {}),
  ),
  ...JSON.parse(
    JSON.stringify(i18nForTest.getDataByLanguage('en')?.errors ?? {}),
  ),
};

vi.mock('@mui/x-date-pickers/DateTimePicker', async () => {
  const actual = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: actual.DesktopDateTimePicker,
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@dicebear/core', () => ({
  createAvatar: vi.fn(() => ({
    toDataUri: vi.fn(() => 'mocked-data-uri'),
  })),
}));

const props = {
  id: 'rishav-jha-mech',
};

const renderMemberDetailScreen = (link: ApolloLink): RenderResult => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/orgtags/123']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route
                path="/orgtags/:orgId"
                element={<MemberDetail {...props} />}
              />
              <Route
                path="/orgtags/:orgId/manageTag/:tagId"
                element={<div data-testid="manageTagScreen"></div>}
              />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

describe('MemberDetail', () => {
  global.alert = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  test('should render the elements', async () => {
    renderMemberDetailScreen(link1);

    await wait();

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Email/i)).toBeTruthy();
    expect(screen.getAllByText(/First name/i)).toBeTruthy();
    expect(screen.getAllByText(/Last name/i)).toBeTruthy();
    // expect(screen.getAllByText(/Language/i)).toBeTruthy();
    // expect(screen.getByText(/Plugin creation allowed/i)).toBeInTheDocument();
    // expect(screen.getAllByText(/Joined on/i)).toBeTruthy();
    // expect(screen.getAllByText(/Joined On/i)).toHaveLength(1);
    expect(screen.getAllByText(/Profile Details/i)).toHaveLength(1);
    // expect(screen.getAllByText(/Actions/i)).toHaveLength(1);
    expect(screen.getAllByText(/Contact Information/i)).toHaveLength(1);
    expect(screen.getAllByText(/Events Attended/i)).toHaveLength(2);
  });

  test('prettyDate function should work properly', () => {
    // If the date is provided
    const datePretty = vi.fn(prettyDate);
    expect(datePretty('2023-02-18T09:22:27.969Z')).toBe(
      prettyDate('2023-02-18T09:22:27.969Z'),
    );
    // If there's some error in formatting the date
    expect(datePretty('')).toBe('Unavailable');
  });

  test('getLanguageName function should work properly', () => {
    const getLangName = vi.fn(getLanguageName);
    // If the language code is provided
    expect(getLangName('en')).toBe('English');
    // If the language code is not provided
    expect(getLangName('')).toBe('Unavailable');
  });

  test('should render props and text elements test for the page component', async () => {
    const formData = {
      firstName: 'Ansh',
      lastName: 'Goyal',
      email: 'ansh@gmail.com',
      image: new File(['hello'], 'hello.png', { type: 'image/png' }),
      address: 'abc',
      countryCode: 'IN',
      state: 'abc',
      city: 'abc',
      phoneNumber: '1234567890',
      birthDate: '03/28/2022',
    };
    renderMemberDetailScreen(link2);

    await wait();

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getAllByText(/Email/i)).toBeTruthy();
    expect(screen.getByText('User')).toBeInTheDocument();
    const birthDateDatePicker = screen.getByTestId('birthDate');
    fireEvent.change(birthDateDatePicker, {
      target: { value: formData.birthDate },
    });

    userEvent.clear(screen.getByPlaceholderText(/First Name/i));
    userEvent.type(
      screen.getByPlaceholderText(/First Name/i),
      formData.firstName,
    );

    userEvent.clear(screen.getByPlaceholderText(/Last Name/i));
    userEvent.type(
      screen.getByPlaceholderText(/Last Name/i),
      formData.lastName,
    );

    userEvent.clear(screen.getByPlaceholderText(/Address/i));
    userEvent.type(screen.getByPlaceholderText(/Address/i), formData.address);

    userEvent.clear(screen.getByPlaceholderText(/Country Code/i));
    userEvent.type(
      screen.getByPlaceholderText(/Country Code/i),
      formData.countryCode,
    );

    userEvent.clear(screen.getByPlaceholderText(/State/i));
    userEvent.type(screen.getByPlaceholderText(/State/i), formData.state);

    userEvent.clear(screen.getByPlaceholderText(/City/i));
    userEvent.type(screen.getByPlaceholderText(/City/i), formData.city);

    userEvent.clear(screen.getByPlaceholderText(/Email/i));
    userEvent.type(screen.getByPlaceholderText(/Email/i), formData.email);

    userEvent.clear(screen.getByPlaceholderText(/Phone/i));
    userEvent.type(screen.getByPlaceholderText(/Phone/i), formData.phoneNumber);

    // userEvent.click(screen.getByPlaceholderText(/pluginCreationAllowed/i));
    // userEvent.selectOptions(screen.getByTestId('applangcode'), 'Français');
    // userEvent.upload(screen.getByLabelText(/Display Image:/i), formData.image);
    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByPlaceholderText(/First Name/i)).toHaveValue(
      formData.firstName,
    );
    expect(screen.getByPlaceholderText(/Last Name/i)).toHaveValue(
      formData.lastName,
    );
    expect(birthDateDatePicker).toHaveValue(formData.birthDate);
    expect(screen.getByPlaceholderText(/Email/i)).toHaveValue(formData.email);
    expect(screen.getByPlaceholderText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    // expect(screen.getByText(/Display Image/i)).toBeInTheDocument();
  });

  test('display admin', async () => {
    renderMemberDetailScreen(link1);
    await wait();
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('display super admin', async () => {
    renderMemberDetailScreen(link3);
    await wait();
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getByText('Super Admin')).toBeInTheDocument();
  });

  test('Should display dicebear image if image is null', async () => {
    renderMemberDetailScreen(link1);

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    const dicebearUrl = 'mocked-data-uri';

    const userImage = await screen.findByTestId('userImageAbsent');
    expect(userImage).toBeInTheDocument();
    expect(userImage.getAttribute('src')).toBe(dicebearUrl);
  });

  test('Should display image if image is present', async () => {
    renderMemberDetailScreen(link2);

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    const user = MOCKS2[0].result?.data?.user?.user;
    const userImage = await screen.findByTestId('userImagePresent');
    expect(userImage).toBeInTheDocument();
    expect(userImage.getAttribute('src')).toBe(user?.image);
  });

  test('resetChangesBtn works properly', async () => {
    renderMemberDetailScreen(link1);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Address/i)).toBeInTheDocument();
    });

    userEvent.type(screen.getByPlaceholderText(/Address/i), 'random');
    userEvent.type(screen.getByPlaceholderText(/State/i), 'random');

    userEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();
    expect(screen.getByPlaceholderText(/First Name/i)).toHaveValue('Aditya');
    expect(screen.getByPlaceholderText(/Last Name/i)).toHaveValue('Agarwal');
    expect(screen.getByPlaceholderText(/Phone/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/Address/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/State/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/Country Code/i)).toHaveValue('');
    expect(screen.getByTestId('birthDate')).toHaveValue('03/14/2024');
  });

  test('should be redirected to / if member id is undefined', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <MemberDetail />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    expect(window.location.pathname).toEqual('/');
  });

  test('renders events attended card correctly and show a message', async () => {
    renderMemberDetailScreen(link3);
    await waitFor(() => {
      expect(screen.getByText('Events Attended')).toBeInTheDocument();
    });
    // Check for empty state immediately
    expect(screen.getByText('No Events Attended')).toBeInTheDocument();
  });

  test('opens "Events Attended List" modal when View All button is clicked', async () => {
    renderMemberDetailScreen(link2);

    await wait();

    // Find and click the "View All" button
    const viewAllButton = screen.getByText('View All');
    userEvent.click(viewAllButton);

    // Check if the modal with the title "Events Attended List" is now visible
    const modalTitle = await screen.findByText('Events Attended List');
    expect(modalTitle).toBeInTheDocument();
  });

  test('lists all the tags assigned to the user', async () => {
    renderMemberDetailScreen(link1);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')).toHaveLength(10);
    });
  });

  test('navigates to manage tag screen after clicking manage tag option', async () => {
    renderMemberDetailScreen(link1);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('tagName')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('tagName')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('manageTagScreen')).toBeInTheDocument();
    });
  });

  test('loads more assigned tags with infinite scroll', async () => {
    renderMemberDetailScreen(link1);

    await wait();

    // now scroll to the bottom of the div
    const tagsAssignedScrollableDiv = screen.getByTestId(
      'tagsAssignedScrollableDiv',
    );

    // Get the initial number of tags loaded
    const initialTagsAssignedLength = screen.getAllByTestId('tagName').length;

    // Set scroll position to the bottom
    fireEvent.scroll(tagsAssignedScrollableDiv, {
      target: { scrollY: tagsAssignedScrollableDiv.scrollHeight },
    });

    await waitFor(() => {
      const finalTagsAssignedLength = screen.getAllByTestId('tagName').length;
      expect(finalTagsAssignedLength).toBeGreaterThan(
        initialTagsAssignedLength,
      );
    });
  });

  test('opens and closes the unassign tag modal', async () => {
    renderMemberDetailScreen(link1);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('unassignTagBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('unassignTagModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('unassignTagModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('unassignTagModalCloseBtn'),
    );
  });

  test('unassigns a tag from a member', async () => {
    renderMemberDetailScreen(link1);

    await wait();

    await waitFor(() => {
      expect(screen.getAllByTestId('unassignTagBtn')[0]).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('unassignTagBtn')[0]);

    userEvent.click(screen.getByTestId('unassignTagModalSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        translations.successfullyUnassigned,
      );
    });
  });
});
