import React from 'react';
import { describe, expect, beforeAll, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Settings from './Settings';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { errorHandler } from 'utils/errorHandler';
import useLocalStorage from 'utils/useLocalstorage';
import '../../../style/app.module.css';
import { errorMock, MOCKS, Mocks1, Mocks2, updateMock } from './SettingsMocks';
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
    const { setItem } = useLocalStorage();
    setItem('Talawa-admin', 'name', 'Bandhan Majumder');
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
    vi.mock('URL', () => ({
      createObjectURL: vi.fn(),
    }));

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

    userEvent.type(screen.getByTestId('inputName'), 'Noble Mittal');
    userEvent.selectOptions(screen.getByTestId('inputGender'), 'Male');
    userEvent.type(screen.getByTestId('inputPassword'), '12qw!@QW');
    userEvent.type(screen.getByTestId('inputPhoneNumber'), '1234567890');
    userEvent.type(screen.getByTestId('inputHomePhoneNumber'), '1234567890');
    userEvent.type(screen.getByTestId('inputWorkPhoneNumber'), '1234567890');
    userEvent.selectOptions(screen.getByTestId('inputGrade'), 'Grade-1');
    userEvent.selectOptions(screen.getByTestId('inputEmpStatus'), 'Unemployed');
    userEvent.selectOptions(screen.getByTestId('inputMaritalStatus'), 'Single');
    userEvent.type(screen.getByTestId('inputAddress1'), 'random');
    userEvent.type(screen.getByTestId('inputAddress2'), 'random');
    userEvent.type(screen.getByTestId('inputState'), 'random');
    userEvent.type(screen.getByTestId('inputCity'), 'random');
    userEvent.selectOptions(screen.getByTestId('inputCountry'), 'in');
    userEvent.type(screen.getByTestId('postalCode'), '1212121');
    userEvent.type(
      screen.getByTestId('inputDescription'),
      'This is a random description by Bandhan',
    );
    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Birth Date'), {
      target: { value: '2024-03-01' },
    });

    expect(screen.getByLabelText('Birth Date')).toHaveValue('2024-03-01');
    expect(screen.getByTestId('updateUserBtn')).toBeInTheDocument();
    expect(screen.getByTestId('resetChangesBtn')).toBeInTheDocument();
    expect(screen.getByTestId('inputName')).toHaveValue('Noble Mittal');
    expect(screen.getByTestId('inputGender')).toHaveValue('male');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('1234567890');
    expect(screen.getByTestId('inputHomePhoneNumber')).toHaveValue(
      '1234567890',
    );
    expect(screen.getByTestId('inputWorkPhoneNumber')).toHaveValue(
      '1234567890',
    );
    expect(screen.getByTestId('inputGrade')).toHaveValue('grade_1');
    expect(screen.getByTestId('inputEmpStatus')).toHaveValue('unemployed');
    expect(screen.getByTestId('inputMaritalStatus')).toHaveValue('single');
    expect(screen.getByTestId('inputAddress1')).toHaveValue('random');
    expect(screen.getByTestId('inputAddress2')).toHaveValue('random');
    expect(screen.getByTestId('inputState')).toHaveValue('random');
    expect(screen.getByTestId('inputCity')).toHaveValue('random');
    expect(screen.getByTestId('inputCountry')).toHaveValue('in');
    expect(screen.getByTestId('postalCode')).toHaveValue('1212121');
    expect(screen.getByTestId('inputDescription')).toHaveValue(
      'This is a random description by Bandhan',
    );
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2024-03-01');
    expect(screen.getByTestId('inputPassword')).toHaveValue('12qw!@QW');
    expect(screen.getByTestId('postalCode')).toHaveValue('1212121');
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
    userEvent.type(screen.getByTestId('inputName'), 'Majumder');
    await wait();

    userEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();

    expect(screen.getByTestId('inputName')).toHaveValue('Bandhan Majumder');
    expect(screen.getByTestId('inputGender')).toHaveValue('male');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('+9999999999');
    expect(screen.getByTestId('inputHomePhoneNumber')).toHaveValue(
      '+9999999998',
    );
    expect(screen.getByTestId('inputWorkPhoneNumber')).toHaveValue(
      '+9999999998',
    );
    expect(screen.getByTestId('inputGrade')).toHaveValue('grade_8');
    expect(screen.getByTestId('inputEmpStatus')).toHaveValue('full_time');
    expect(screen.getByTestId('inputMaritalStatus')).toHaveValue('engaged');
    expect(screen.getByTestId('inputAddress1')).toHaveValue('Line 1');
    expect(screen.getByTestId('inputAddress2')).toHaveValue('Line 2');
    expect(screen.getByTestId('inputState')).toHaveValue('State1');
    expect(screen.getByTestId('inputCity')).toHaveValue('nyc');
    expect(screen.getByTestId('inputCountry')).toHaveValue('bb');
    expect(screen.getByTestId('postalCode')).toHaveValue('11111111f');
    expect(screen.getByTestId('inputDescription')).toHaveValue(
      'This is a description',
    );
    expect(screen.getByLabelText('Birth Date')).toHaveValue('2000-01-01');
    expect(screen.getByTestId('inputPassword')).toHaveValue('');
    expect(screen.getByTestId('postalCode')).toHaveValue('11111111f');
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

    userEvent.type(screen.getByTestId('inputName'), 'Bandhan Majumder');

    await wait();
    fireEvent.click(screen.getByTestId('resetChangesBtn'));
    await wait();
    expect(screen.getByTestId('inputName')).toHaveValue('');
    expect(screen.getByTestId('inputGender')).toHaveValue('');
    expect(screen.getByTestId('inputPhoneNumber')).toHaveValue('');
    expect(screen.getByTestId('inputHomePhoneNumber')).toHaveValue('');
    expect(screen.getByTestId('inputWorkPhoneNumber')).toHaveValue('');
    expect(screen.getByTestId('inputGrade')).toHaveValue('');
    expect(screen.getByTestId('inputEmpStatus')).toHaveValue('');
    expect(screen.getByTestId('inputMaritalStatus')).toHaveValue('');
    expect(screen.getByTestId('inputAddress1')).toHaveValue('');
    expect(screen.getByTestId('inputAddress2')).toHaveValue('');
    expect(screen.getByTestId('inputState')).toHaveValue('');
    expect(screen.getByTestId('inputCity')).toHaveValue('');
    expect(screen.getByTestId('inputCountry')).toHaveValue('');
    expect(screen.getByTestId('postalCode')).toHaveValue('');
    expect(screen.getByTestId('inputDescription')).toHaveValue('');
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
    const openMenuBtn = screen.queryByTestId('openMenu');
    expect(openMenuBtn).toBeInTheDocument();

    if (openMenuBtn) {
      act(() => openMenuBtn.click());
    }

    const closeMenuBtn = screen.queryByTestId('closeMenu');
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

    expect(screen.getByText('Events Attended')).toBeInTheDocument();
    await wait(1000);

    expect(screen.getByText('No Events Attended')).toBeInTheDocument();
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

    fireEvent.change(birthDateInput, { target: { value: futureDateString } });

    expect(birthDateInput.value).not.toBe(futureDateString);

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

    expect(screen.getByTestId('inputName')).toBeInTheDocument();

    const nameInput = screen.getByTestId('inputName');

    expect(nameInput).toHaveValue('');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Bandhan Majumder' } });
    });

    const saveButton = screen.getByTestId('updateUserBtn');

    userEvent.click(saveButton);

    vi.runAllTimersAsync();

    await waitFor(() => {
      expect(toastSuccessSpy).toHaveBeenCalledWith(
        'Profile updated Successfully',
      );
    });
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

    const phoneNumberInput = screen.getByTestId('inputPhoneNumber');

    await act(async () => {
      fireEvent.change(phoneNumberInput, { target: { value: '12000' } });
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
});
