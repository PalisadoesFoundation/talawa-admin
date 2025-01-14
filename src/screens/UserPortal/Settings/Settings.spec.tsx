import React from 'react';
import { describe, expect, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { UPDATE_USER_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Settings from './Settings';
import userEvent from '@testing-library/user-event';
import { CHECK_AUTH } from 'GraphQl/Queries/Queries';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

const MOCKS = [
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: {
        firstName: 'Noble',
        lastName: 'Mittal',
        createdAt: '2021-03-01',
        gender: 'MALE',
        phoneNumber: '+174567890',
        birthDate: '2024-03-01',
        grade: 'GRADE_1',
        empStatus: 'UNEMPLOYED',
        maritalStatus: 'SINGLE',
        address: 'random',
        state: 'random',
        country: 'IN',
      },
      result: {
        data: {
          updateUserProfile: {
            _id: '453',
          },
        },
      },
    },
  },
];

const Mocks1 = [
  {
    request: {
      query: CHECK_AUTH,
    },
    result: {
      data: {
        checkAuth: {
          email: 'johndoe@gmail.com',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: '2021-03-01T00:00:00.000Z',
          gender: 'MALE',
          maritalStatus: 'SINGLE',
          educationGrade: 'GRADUATE',
          employmentStatus: 'PART_TIME',
          birthDate: '2024-03-01',
          address: {
            state: 'random',
            countryCode: 'IN',
            line1: 'random',
          },
          eventsAttended: [{ _id: 'event1' }, { _id: 'event2' }],
          phone: {
            mobile: '+174567890',
          },
          image: 'https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe',
          _id: '65ba1621b7b00c20e5f1d8d2',
        },
      },
    },
  },
];

const Mocks2 = [
  {
    request: {
      query: CHECK_AUTH,
    },
    result: {
      data: {
        checkAuth: {
          email: 'johndoe@gmail.com',
          firstName: '',
          lastName: '',
          createdAt: '',
          gender: '',
          maritalStatus: '',
          educationGrade: '',
          employmentStatus: '',
          eventsAttended: [],
          birthDate: '',
          address: {
            state: '',
            countryCode: '',
            line1: '',
          },
          phone: {
            mobile: '',
          },
          image: '',
          _id: '65ba1621b7b00c20e5f1d8d2',
        },
      },
    },
  },
];

const updateMock = [
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: {
        firstName: 'John',
        lastName: 'randomUpdated',
        createdAt: '2021-03-01T00:00:00.000Z',
        gender: 'MALE',
        email: 'johndoe@gmail.com',
        phoneNumber: '+174567890',
        birthDate: '2024-03-01',
        grade: 'GRADUATE',
        empStatus: 'PART_TIME',
        maritalStatus: 'SINGLE',
        address: 'random',
        state: 'random',
        country: 'IN',
        eventsAttended: [{ _id: 'event1' }, { _id: 'event2' }],
        image: '',
      },
    },
    result: {
      data: {
        updateUserProfile: {
          _id: '65ba1621b7b00c20e5f1d8d2',
        },
      },
    },
  },
  ...Mocks1,
];

const errorMock = [
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: {
        firstName: 'John',
        lastName: 'Doe2',
        createdAt: '2021-03-01T00:00:00.000Z',
        gender: 'MALE',
        email: 'johndoe@gmail.com',
        phoneNumber: '4567890',
        birthDate: '2024-03-01',
        grade: 'GRADUATE',
        empStatus: 'PART_TIME',
        maritalStatus: 'SINGLE',
        address: 'random',
        state: 'random',
        country: 'IN',
        eventsAttended: [{ _id: 'event1' }, { _id: 'event2' }],
        image: '',
      },
    },
    error: new Error('Please enter a valid phone number'),
  },
  ...Mocks1,
];

const link = new StaticMockLink(MOCKS, true);
const link1 = new StaticMockLink(Mocks1, true);
const link2 = new StaticMockLink(Mocks2, true);
const link3 = new StaticMockLink(updateMock, true);
const link4 = new StaticMockLink(errorMock, true);

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

async function wait(ms = 100): Promise<void> {
  await act(async () => {
    vi.advanceTimersByTime(ms);
  });
}

describe('Testing Settings Screen [User Portal]', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('Screen should be rendered properly', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    await wait();

    expect(screen.queryAllByText('Settings')).not.toBe([]);
  });

  it('input works properly', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    await wait();

    userEvent.type(screen.getByTestId('inputFirstName'), 'Noble');
    await wait();
    userEvent.type(screen.getByTestId('inputLastName'), 'Mittal');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputGender'), 'Male');
    await wait();
    userEvent.type(screen.getByTestId('inputPhoneNumber'), '1234567890');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputGrade'), 'Grade-1');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputEmpStatus'), 'Unemployed');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputMaritalStatus'), 'Single');
    await wait();
    userEvent.type(screen.getByTestId('inputAddress'), 'random');
    await wait();
    userEvent.type(screen.getByTestId('inputState'), 'random');
    await wait();
    userEvent.selectOptions(screen.getByTestId('inputCountry'), 'IN');
    await wait();
    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    await wait();
    fireEvent.change(screen.getByLabelText('Birth Date'), {
      target: { value: '2024-03-01' },
    });
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2024-03-01');
    await wait();
    const fileInp = screen.getByTestId('fileInput');
    fileInp.style.display = 'block';
    userEvent.click(screen.getByTestId('uploadImageBtn'));
    await wait();
    const imageFile = new File(['(⌐□_□)'], 'profile-image.jpg', {
      type: 'image/jpeg',
    });
    const files = [imageFile];
    userEvent.upload(fileInp, files);
    await wait();
    expect(screen.getByTestId('profile-picture')).toBeInTheDocument();
  });

  it('resetChangesBtn works properly', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link1}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    await wait();
    userEvent.type(screen.getByTestId('inputAddress'), 'random');
    await wait();
    userEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();
    expect(screen.getByTestId('inputFirstName')).toHaveValue('John');
    expect(screen.getByTestId('inputLastName')).toHaveValue('Doe');
    expect(screen.getByTestId('inputGender')).toHaveValue('MALE');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('+174567890');
    expect(screen.getByTestId('inputGrade')).toHaveValue('GRADUATE');
    expect(screen.getByTestId('inputEmpStatus')).toHaveValue('PART_TIME');
    expect(screen.getByTestId('inputMaritalStatus')).toHaveValue('SINGLE');
    expect(screen.getByTestId('inputAddress')).toHaveValue('random');
    expect(screen.getByTestId('inputState')).toHaveValue('random');
    expect(screen.getByTestId('inputCountry')).toHaveValue('IN');
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2024-03-01');
  });

  it('resetChangesBtn works properly when the details are empty', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    await wait();
    userEvent.type(screen.getByTestId('inputAddress'), 'random');
    await wait();
    userEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();
    expect(screen.getByTestId('inputFirstName')).toHaveValue('');
    expect(screen.getByTestId('inputLastName')).toHaveValue('');
    expect(screen.getByTestId('inputGender')).toHaveValue('');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('');
    expect(screen.getByTestId('inputGrade')).toHaveValue('');
    expect(screen.getByTestId('inputEmpStatus')).toHaveValue('');
    expect(screen.getByTestId('inputMaritalStatus')).toHaveValue('');
    expect(screen.getByTestId('inputAddress')).toHaveValue('');
    expect(screen.getByTestId('inputState')).toHaveValue('');
    expect(screen.getByTestId('inputCountry')).toHaveValue('');
    expect(screen.getByLabelText('Birth Date')).toHaveValue('');
  });

  it('sidebar', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    await wait();

    const closeMenubtn = screen.getByTestId('closeMenu');
    expect(closeMenubtn).toBeInTheDocument();
    act(() => closeMenubtn.click());
    const openMenuBtn = screen.getByTestId('openMenu');
    expect(openMenuBtn).toBeInTheDocument();
    act(() => openMenuBtn.click());
  });

  it('Testing sidebar when the screen size is less than or equal to 820px', async () => {
    resizeWindow(800);
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Settings />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });

    await wait();
    screen.debug();

    const openMenuBtn = screen.queryByTestId('openMenu');
    console.log('Open Menu Button:', openMenuBtn);
    expect(openMenuBtn).toBeInTheDocument();

    if (openMenuBtn) {
      act(() => openMenuBtn.click());
    }

    const closeMenuBtn = screen.queryByTestId('closeMenu');
    console.log('Close Menu Button:', closeMenuBtn);
    expect(closeMenuBtn).toBeInTheDocument();

    if (closeMenuBtn) {
      act(() => closeMenuBtn.click());
    }
  });

  it('renders events attended card correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    // Check if the card title is rendered
    expect(screen.getByText('Events Attended')).toBeInTheDocument();
    await wait(1000);
    // Check for empty state immediately
    expect(screen.getByText('No Events Attended')).toBeInTheDocument();
  });

  it('renders events attended card correctly with events', async () => {
    const mockEventsAttended = [
      { _id: '1', title: 'Event 1' },
      { _id: '2', title: 'Event 2' },
    ];

    const MocksWithEvents = [
      {
        ...Mocks1[0],
        result: {
          data: {
            checkAuth: {
              ...Mocks1[0].result.data.checkAuth,
              eventsAttended: mockEventsAttended,
            },
          },
        },
      },
    ];

    const linkWithEvents = new StaticMockLink(MocksWithEvents, true);

    render(
      <MockedProvider addTypename={false} link={linkWithEvents}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(1000);

    expect(screen.getByText('Events Attended')).toBeInTheDocument();
    const eventsCards = screen.getAllByTestId('usereventsCard');
    expect(eventsCards.length).toBe(2);

    eventsCards.forEach((card) => {
      expect(card).toBeInTheDocument();
      expect(card.children.length).toBe(1);
    });
  });
});

it('prevents selecting future dates for birth date', async () => {
  await act(async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });

  const birthDateInput = screen.getByLabelText(
    'Birth Date',
  ) as HTMLInputElement;
  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 100);
  const futureDateString = futureDate.toISOString().split('T')[0];

  // Trying future date
  fireEvent.change(birthDateInput, { target: { value: futureDateString } });
  // Checking if value is not updated to future date
  expect(birthDateInput.value).not.toBe(futureDateString);

  // Checking if value set correctly
  fireEvent.change(birthDateInput, { target: { value: today } });
  expect(birthDateInput.value).toBe(today);
});

it('should update user profile successfully', async () => {
  const toastSuccessSpy = vi.spyOn(toast, 'success');
  await act(async () => {
    render(
      <MockedProvider link={link3} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });

  await wait();

  const lastNameInput = screen.getByTestId('inputLastName');
  expect(lastNameInput).toHaveValue('Doe');
  await act(async () => {
    fireEvent.change(lastNameInput, { target: { value: 'randomUpdated' } });
  });

  const saveButton = screen.getByTestId('updateUserBtn');
  expect(saveButton).toBeInTheDocument();
  await act(async () => {
    fireEvent.click(saveButton);
  });
  await wait();

  expect(lastNameInput).toHaveValue('randomUpdated');
  expect(toastSuccessSpy).toHaveBeenCalledWith('Profile updated Successfully');

  toastSuccessSpy.mockRestore();
});

it('should call errorHandler when updating profile with an invalid phone number', async () => {
  await act(async () => {
    render(
      <MockedProvider link={link4} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Settings />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  });

  await wait(200);

  const lastNameInput = screen.getByTestId('inputLastName');
  await act(async () => {
    fireEvent.change(lastNameInput, { target: { value: 'Doe2' } });
  });

  const phoneNumberInput = screen.getByTestId('inputPhoneNumber');

  await act(async () => {
    fireEvent.change(phoneNumberInput, { target: { value: '4567890' } });
  });
  await wait(200);

  const saveButton = screen.getByTestId('updateUserBtn');
  expect(saveButton).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(saveButton);
  });
  await wait();
  expect(errorHandler).toHaveBeenCalled();
});
