import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';

vi.mock('@apollo/client', async () => {
  const actual =
    await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

vi.mock('utils/urlToFile', () => ({
  urlToFile: vi.fn(),
}));

import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { urlToFile } from 'utils/urlToFile';
import Settings from './Settings';

const baseUser = {
  addressLine1: 'Line 1',
  addressLine2: 'Line 2',
  avatarMimeType: 'image/jpeg',
  avatarURL: 'http://example.com/avatar.jpg',
  birthDate: '2000-01-01',
  city: 'nyc',
  countryCode: 'in',
  createdAt: '2025-02-06T03:10:50.254Z',
  description: 'Persistent description',
  educationGrade: 'grade_8',
  emailAddress: 'test221@gmail.com',
  employmentStatus: 'employed',
  homePhoneNumber: '+9999999998',
  id: '0194d80f-03cd-79cd-8135-683494b187a1',
  isEmailAddressVerified: false,
  maritalStatus: 'engaged',
  mobilePhoneNumber: '+9999999999',
  name: 'Bandhan Majumder',
  natalSex: 'male',
  naturalLanguageCode: 'en',
  postalCode: '11111111f',
  role: 'regular',
  state: 'State1',
  updatedAt: '2025-02-06T03:22:17.808Z',
  workPhoneNumber: '+9999999998',
  __typename: 'User',
};

describe('Settings update flows', () => {
  const useQueryMock = vi.mocked(useQuery);
  const useMutationMock = vi.mocked(useMutation);
  const urlToFileMock = vi.mocked(urlToFile);
  const toastSuccess = vi.mocked(toast.success);
  const toastError = vi.mocked(toast.error);
  let updateUserMock: ReturnType<typeof vi.fn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let reloadSpy: ReturnType<typeof vi.fn>;

  const originalLocation = window.location;

  beforeAll(() => {
    reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ancestorOrigins: originalLocation.ancestorOrigins,
        assign: vi.fn(),
        hash: originalLocation.hash,
        host: originalLocation.host,
        hostname: originalLocation.hostname,
        href: originalLocation.href,
        origin: originalLocation.origin,
        pathname: originalLocation.pathname,
        port: originalLocation.port,
        protocol: originalLocation.protocol,
        reload: reloadSpy,
        replace: vi.fn(),
        search: originalLocation.search,
      } as Location,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  beforeEach(() => {
    useQueryMock.mockReturnValue({
      data: { currentUser: baseUser },
      loading: false,
      error: undefined,
    } as unknown as ReturnType<typeof useQuery>);

    updateUserMock = vi.fn().mockResolvedValue({
      data: {
        updateCurrentUser: {
          avatarURL: 'http://example.com/new-avatar.png',
          name: 'Updated Name',
          emailAddress: 'updated@example.com',
          id: 'abc-123',
          role: 'regular',
        },
      },
    });

    useMutationMock.mockReturnValue([updateUserMock] as unknown as ReturnType<
      typeof useMutation
    >);

    urlToFileMock.mockResolvedValue(
      new File(['avatar'], 'avatar.png', { type: 'image/png' }),
    );

    setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem');

    // Ensure viewport large enough to avoid sidebar auto hiding side effects
    window.innerWidth = 1200;
    toastSuccess.mockReset();
    toastError.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    setItemSpy.mockRestore();
  });

  const renderSettings = (): ReturnType<typeof render> =>
    render(
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Settings />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>,
    );

  it('converts existing avatar URL and strips empty fields before updating', async () => {
    const { getByTestId } = renderSettings();

    await waitFor(() => expect(getByTestId('inputName')).toBeInTheDocument());

    fireEvent.change(getByTestId('inputName'), {
      target: { value: 'Updated Name' },
    });

    fireEvent.change(getByTestId('inputDescription'), {
      target: { value: '   ' },
    });

    const updateButton = await waitFor(() => getByTestId('updateUserBtn'));

    await act(async () => {
      fireEvent.click(updateButton);
    });

    await waitFor(() => expect(updateUserMock).toHaveBeenCalledTimes(1));

    expect(urlToFileMock).toHaveBeenCalledWith('http://example.com/avatar.jpg');

    const variables = updateUserMock.mock.calls[0][0]?.variables?.input ?? {};
    expect(variables.name).toBe('Updated Name');
    expect(variables.avatar).toBeInstanceOf(File);
    expect(variables).not.toHaveProperty('description');

    expect(setItemSpy).toHaveBeenCalledWith(
      'Talawa-admin_UserImage',
      JSON.stringify('http://example.com/new-avatar.png'),
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      'Talawa-admin_name',
      JSON.stringify('Updated Name'),
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      'Talawa-admin_email',
      JSON.stringify('updated@example.com'),
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      'Talawa-admin_id',
      JSON.stringify('abc-123'),
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      'Talawa-admin_role',
      JSON.stringify('regular'),
    );
    expect(toastSuccess).toHaveBeenCalled();
  });

  it('shows error toast when existing avatar cannot be converted', async () => {
    urlToFileMock.mockRejectedValueOnce(new Error('convert failed'));

    const { getByTestId } = renderSettings();

    await waitFor(() => expect(getByTestId('inputName')).toBeInTheDocument());

    fireEvent.change(getByTestId('inputName'), {
      target: { value: 'Another Name' },
    });

    const updateButton = await waitFor(() => getByTestId('updateUserBtn'));

    await act(async () => {
      fireEvent.click(updateButton);
    });

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        'Failed to process profile picture. Please try uploading again.',
      ),
    );

    expect(updateUserMock).not.toHaveBeenCalled();
  });
});
