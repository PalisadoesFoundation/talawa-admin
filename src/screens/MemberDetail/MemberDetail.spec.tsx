import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
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
import { MOCKS1, MOCKS2 } from './MemberDetailMocks';
import type { ApolloLink } from '@apollo/client';
import { vi } from 'vitest';

const link1 = new StaticMockLink(MOCKS1, true);
const link2 = new StaticMockLink(MOCKS2, true);

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
    expect(screen.getAllByText(/name/i)).toBeTruthy();
    expect(screen.getAllByText(/Birth Date/i)).toBeTruthy();
    expect(screen.getAllByText(/Gender/i)).toBeTruthy();
    expect(screen.getAllByText(/Profile Details/i)).toBeTruthy();
    expect(screen.getAllByText(/Profile Details/i)).toHaveLength(1);
    expect(screen.getAllByText(/Contact Information/i)).toHaveLength(1);
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
      addressLine1: 'Line 1',
      addressLine2: 'Line 2',
      avatarMimeType: 'image/jpeg',
      avatarURL: 'http://example.com/avatar.jpg',
      birthDate: '2000-01-01',
      city: 'nyc',
      countryCode: 'bb',
      createdAt: '2025-02-06T03:10:50.254',
      description: 'This is a description',
      educationGrade: 'grade_8',
      emailAddress: 'test221@gmail.com',
      employmentStatus: 'employed',
      homePhoneNumber: '+9999999998',
      id: '0194d80f-03cd-79cd-8135-683494b187a1',
      isEmailAddressVerified: false,
      maritalStatus: 'engaged',
      mobilePhoneNumber: '+9999999999',
      name: 'Rishav Jha',
      natalSex: 'male',
      naturalLanguageCode: 'en',
      postalCode: '111111',
      role: 'regular',
      state: 'State1',
      updatedAt: '2025-02-06T03:22:17.808',
      workPhoneNumber: '+9999999998',
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

    userEvent.type(screen.getByTestId(/inputName/i), formData.name);

    userEvent.clear(screen.getByTestId(/inputName/i));
    userEvent.clear(screen.getByTestId(/addressLine1/i));
    userEvent.clear(screen.getByTestId(/addressLine2/i));
    userEvent.clear(screen.getByTestId(/inputCity/i));
    userEvent.clear(screen.getByTestId(/inputState/i));
    userEvent.clear(screen.getByTestId(/inputPostalCode/i));
    userEvent.clear(screen.getByTestId(/inputDescription/i));
    userEvent.clear(screen.getByTestId(/inputEmail/i));
    userEvent.clear(screen.getByTestId(/inputMobilePhoneNumber/i));
    userEvent.clear(screen.getByTestId(/inputHomePhoneNumber/i));
    userEvent.clear(screen.getByTestId(/workPhoneNumber/i));

    userEvent.type(screen.getByTestId(/inputName/i), formData.name);
    userEvent.type(screen.getByTestId(/addressLine1/i), formData.addressLine1);
    userEvent.type(screen.getByTestId(/addressLine2/i), formData.addressLine2);
    userEvent.type(screen.getByTestId(/inputCity/i), formData.city);
    userEvent.type(screen.getByTestId(/inputState/i), formData.state);
    userEvent.type(screen.getByTestId(/inputPostalCode/i), formData.postalCode);
    userEvent.type(
      screen.getByTestId(/inputDescription/i),
      formData.description,
    );
    userEvent.type(screen.getByTestId(/inputCountry/i), formData.countryCode);
    userEvent.type(screen.getByTestId(/inputEmail/i), formData.emailAddress);
    userEvent.type(
      screen.getByTestId(/inputMobilePhoneNumber/i),
      formData.mobilePhoneNumber,
    );
    userEvent.type(
      screen.getByTestId(/inputHomePhoneNumber/i),
      formData.homePhoneNumber,
    );
    userEvent.type(
      screen.getByTestId(/workPhoneNumber/i),
      formData.workPhoneNumber,
    );

    await wait();

    await userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByTestId(/inputName/i)).toHaveValue(formData.name);
    expect(screen.getByTestId(/addressLine1/i)).toHaveValue(
      formData.addressLine1,
    );
    expect(screen.getByTestId(/addressLine2/i)).toHaveValue(
      formData.addressLine2,
    );
    expect(screen.getByTestId(/inputCity/i)).toHaveValue(formData.city);
    expect(screen.getByTestId(/inputState/i)).toHaveValue(formData.state);
    expect(screen.getByTestId(/inputPostalCode/i)).toHaveValue(
      formData.postalCode,
    );
    expect(screen.getByTestId(/inputDescription/i)).toHaveValue(
      formData.description,
    );
    expect(screen.getByTestId(/inputCountry/i)).toHaveValue(
      formData.countryCode,
    );
    expect(screen.getByTestId(/inputEmail/i)).toHaveValue(
      formData.emailAddress,
    );
    expect(screen.getByTestId(/inputMobilePhoneNumber/i)).toHaveValue(
      formData.mobilePhoneNumber,
    );
    expect(screen.getByTestId(/inputHomePhoneNumber/i)).toHaveValue(
      formData.homePhoneNumber,
    );
    expect(screen.getByTestId(/workPhoneNumber/i)).toHaveValue(
      formData.workPhoneNumber,
    );
  });

  test('display admin', async () => {
    renderMemberDetailScreen(link1);
    await wait();
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('Should display dicebear image if image is null', async () => {
    renderMemberDetailScreen(link1);

    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();

    const dicebearUrl = 'mocked-data-uri';

    const userImage = await screen.findByTestId('userImageAbsent');
    expect(userImage).toBeInTheDocument();
    expect(userImage.getAttribute('src')).toBe(dicebearUrl);
  });

  test('resetChangesBtn works properly', async () => {
    renderMemberDetailScreen(link1);

    await waitFor(() => {
      expect(screen.getByTestId(/AddressLine1/i)).toBeInTheDocument();
    });

    userEvent.type(screen.getByTestId(/addressLine1/i), 'random');
    userEvent.type(screen.getByTestId(/inputState/i), 'random');

    await userEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();

    expect(screen.getByTestId(/Name/i)).toHaveValue('Rishav Jha');
    expect(screen.getByTestId(/inputMobilePhoneNumber/i)).toHaveValue(
      '+9999999999',
    );
    expect(screen.getByTestId(/inputHomePhoneNumber/i)).toHaveValue(
      '+9999999998',
    );
    expect(screen.getByTestId(/workPhoneNumber/i)).toHaveValue('+9999999998');
    expect(screen.getByTestId(/inputDescription/i)).toHaveValue(
      'This is a description',
    );
    expect(screen.getByTestId(/inputCity/i)).toHaveValue('');
    expect(screen.getByTestId(/inputPostalCode/i)).toHaveValue('111111');
    expect(screen.getByTestId(/inputCountry/i)).toHaveValue('');
    expect(screen.getByTestId(/inputState/i)).toHaveValue('');
    expect(screen.getByTestId(/addressLine1/i)).toHaveValue('Line 1');
    expect(screen.getByTestId(/addressLine2/i)).toHaveValue('Line 2');
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

  test('display tags Assigned', async () => {
    renderMemberDetailScreen(link1);
    await wait();
    expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    expect(screen.getByText('Tags Assigned')).toBeInTheDocument();
  });
});
