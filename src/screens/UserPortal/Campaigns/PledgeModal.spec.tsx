import type { ApolloLink } from '@apollo/client';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type { RenderResult } from '@testing-library/react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import type { InterfacePledgeModal } from './PledgeModal';
import PledgeModal from './PledgeModal';
import React from 'react';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';
import { CREATE_PLEDGE, UPDATE_PLEDGE } from 'GraphQl/Mutations/PledgeMutation';
import { vi } from 'vitest';
import dayjs from 'dayjs';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@mui/x-date-pickers/DesktopDateTimePicker', async () => {
  const { DesktopDateTimePicker } = await vi.importActual(
    '@mui/x-date-pickers/DesktopDateTimePicker',
  );
  return {
    DateTimePicker: DesktopDateTimePicker,
  };
});

const pledgeProps: InterfacePledgeModal[] = [
  {
    isOpen: true,
    hide: vi.fn(),
    pledge: {
      id: '1',
      amount: 100,
      currency: 'USD',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      users: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          name: 'John Doe',
          image: undefined,
        },
      ],
    },
    refetchPledge: vi.fn(),
    campaignId: 'campaignId',
    userId: 'userId',
    endDate: new Date(),
    mode: 'create',
  },
  {
    isOpen: true,
    hide: vi.fn(),
    pledge: {
      id: '1',
      amount: 100,
      currency: 'USD',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      users: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          name: 'John Doe',
          image: undefined,
        },
      ],
    },
    refetchPledge: vi.fn(),
    campaignId: 'campaignId',
    userId: 'userId',
    endDate: new Date(),
    mode: 'edit',
  },
];

const PLEDGE_MODAL_MOCKS = [
  {
    request: {
      query: USER_DETAILS,
      variables: {
        id: 'userId',
      },
    },
    result: {
      data: {
        user: {
          user: {
            _id: 'userId',
            joinedOrganizations: [
              {
                _id: '6537904485008f171cf29924',
                __typename: 'Organization',
              },
            ],
            firstName: 'Harve',
            lastName: 'Lance',
            email: 'testuser1@example.com',
            image: null,
            createdAt: '2023-04-13T04:53:17.742Z',
            birthDate: null,
            educationGrade: null,
            employmentStatus: null,
            gender: null,
            maritalStatus: null,
            phone: null,
            address: {
              line1: 'Line1',
              countryCode: 'CountryCode',
              city: 'CityName',
              state: 'State',
              __typename: 'Address',
            },
            registeredEvents: [],
            membershipRequests: [],
            __typename: 'User',
          },
          appUserProfile: {
            _id: '67078abd85008f171cf2991d',
            adminFor: [],
            isSuperAdmin: false,
            appLanguageCode: 'en',
            createdOrganizations: [],
            createdEvents: [],
            eventAdmin: [],
            __typename: 'AppUserProfile',
          },
          __typename: 'UserData',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_PLEDGE,
      variables: {
        id: '1',
        amount: 200,
        users: ['1'],
      },
    },
    result: {
      data: {
        updateFundraisingCampaignPledge: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_PLEDGE,
      variables: {
        campaignId: 'campaignId',
        amount: 200,
        currency: 'USD',
        startDate: '2024-01-02',
        endDate: '2024-01-02',
        userIds: ['1'],
      },
    },
    result: {
      data: {
        createFundraisingCampaignPledge: {
          _id: '3',
        },
      },
    },
  },
];

const link1 = new StaticMockLink(PLEDGE_MODAL_MOCKS);
const translations = JSON.parse(
  JSON.stringify(i18nForTest.getDataByLanguage('en')?.translation.pledges),
);

const renderPledgeModal = (
  link: ApolloLink,
  props: InterfacePledgeModal,
): RenderResult => {
  return render(
    <MockedProvider link={link} addTypename={false}>
      <Provider store={store}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <I18nextProvider i18n={i18nForTest}>
              <PledgeModal {...props} />
            </I18nextProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </Provider>
    </MockedProvider>,
  );
};

describe('PledgeModal', () => {
  beforeAll(() => {
    vi.mock('react-router', async () => {
      const actual = await vi.importActual('react-router');
      return {
        ...actual,
        useParams: () => ({ orgId: 'orgId', fundCampaignId: 'fundCampaignId' }),
        useNavigate: vi.fn(),
      };
    });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });
  it('should populate form fields with correct values in edit mode', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    await waitFor(() =>
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument(),
    );
    expect(screen.getAllByText(/John Doe/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toHaveValue('01/01/2024');
    expect(screen.getByLabelText('End Date')).toHaveValue('10/01/2024');
    expect(screen.getByLabelText('Currency')).toHaveTextContent('USD ($)');
    expect(screen.getByLabelText('Amount')).toHaveValue('100');
  });

  it('should update pledgeAmount when input value changes', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const amountInput = screen.getByLabelText('Amount');
    expect(amountInput).toHaveValue('100');
    fireEvent.change(amountInput, { target: { value: '200' } });
    expect(amountInput).toHaveValue('200');
  });

  it('should not update pledgeAmount when input value is less than or equal to 0', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const amountInput = screen.getByLabelText('Amount');
    expect(amountInput).toHaveValue('100');
    fireEvent.change(amountInput, { target: { value: '-10' } });
    expect(amountInput).toHaveValue('100');
  });

  it('should update pledgeStartDate when a new date is selected', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '02/01/2024' } });
    expect(startDateInput).toHaveValue('02/01/2024');
    expect(pledgeProps[1].pledge?.startDate).toEqual('2024-01-01');
  });

  it('pledgeStartDate onChange when its null', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: null } });
    expect(pledgeProps[1].pledge?.startDate).toEqual('2024-01-01');
  });

  it('should update pledgeEndDate when a new date is selected', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const startDateInput = screen.getByLabelText('End Date');
    fireEvent.change(startDateInput, { target: { value: '02/01/2024' } });
    expect(startDateInput).toHaveValue('02/01/2024');
    expect(pledgeProps[1].pledge?.endDate).toEqual('2024-01-10');
  });

  it('pledgeEndDate onChange when its null', async () => {
    renderPledgeModal(link1, pledgeProps[1]);
    const endDateInput = screen.getByLabelText('End Date');
    fireEvent.change(endDateInput, { target: { value: null } });
    expect(pledgeProps[1].pledge?.endDate).toEqual('2024-01-10');
  });

  it('should create pledge', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '200' },
    });
    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '02/01/2024' },
    });
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '02/01/2024' },
    });

    // Submit the form
    const form = screen.getByTestId('pledgeForm');
    fireEvent.submit(form);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(translations.pledgeCreated);
      },
      { timeout: 2000 },
    );

    expect(pledgeProps[0].refetchPledge).toHaveBeenCalled();
    expect(pledgeProps[0].hide).toHaveBeenCalled();
  });

  it('should handle error when creating pledge fails', async () => {
    const errorMessage = 'Failed to create pledge';
    const createProps = {
      ...pledgeProps[0],
      pledge: null,
    };

    const mockErrorLink = new StaticMockLink(
      [
        {
          request: {
            query: USER_DETAILS,
            variables: {
              id: 'userId',
            },
          },
          result: {
            data: {
              user: {
                user: {
                  _id: 'userId',
                  joinedOrganizations: [
                    {
                      _id: '6537904485008f171cf29924',
                      __typename: 'Organization',
                    },
                  ],
                  firstName: 'Harve',
                  lastName: 'Lance',
                  email: 'testuser1@example.com',
                  image: null,
                  createdAt: '2023-04-13T04:53:17.742Z',
                  birthDate: null,
                  educationGrade: null,
                  employmentStatus: null,
                  gender: null,
                  maritalStatus: null,
                  phone: null,
                  address: {
                    line1: 'Line1',
                    countryCode: 'CountryCode',
                    city: 'CityName',
                    state: 'State',
                    __typename: 'Address',
                  },
                  registeredEvents: [],
                  membershipRequests: [],
                  __typename: 'User',
                },
                appUserProfile: {
                  _id: '67078abd85008f171cf2991d',
                  adminFor: [],
                  isSuperAdmin: false,
                  appLanguageCode: 'en',
                  createdOrganizations: [],
                  createdEvents: [],
                  eventAdmin: [],
                  __typename: 'AppUserProfile',
                },
                __typename: 'UserData',
              },
            },
          },
        },
        {
          request: {
            query: CREATE_PLEDGE,
            variables: {
              campaignId: 'campaignId',
              amount: 200,
              currency: 'USD',
              startDate: '2024-01-02',
              endDate: '2024-01-02',
              userIds: ['userId'],
            },
          },
          error: new Error(errorMessage),
        },
      ],
      false,
    );

    renderPledgeModal(mockErrorLink, createProps);

    await waitFor(
      () => {
        expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const autoCompleteInput = within(pledgerSelect).getByRole('combobox');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'Harve' } });

    await waitFor(
      () => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
      },
      { timeout: 2000 },
    );

    const options = screen.getAllByRole('option');
    fireEvent.click(options[0]);

    await waitFor(
      () => {
        expect(within(pledgerSelect).getByText(/Harve/)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '200' },
    });
    fireEvent.change(screen.getByLabelText('Start Date'), {
      target: { value: '02/01/2024' },
    });
    fireEvent.change(screen.getByLabelText('End Date'), {
      target: { value: '02/01/2024' },
    });

    const form = screen.getByTestId('pledgeForm');
    fireEvent.submit(form);

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      },
      { timeout: 2000 },
    );
  });

  it('should update pledge when amount is changed in edit mode', async () => {
    renderPledgeModal(link1, pledgeProps[1]);

    const amountInput = screen.getByLabelText('Amount');
    fireEvent.change(amountInput, { target: { value: '200' } });

    const form = screen.getByTestId('pledgeForm');
    fireEvent.submit(form);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(translations.pledgeUpdated);
      },
      { timeout: 2000 },
    );

    expect(pledgeProps[1].refetchPledge).toHaveBeenCalled();
    expect(pledgeProps[1].hide).toHaveBeenCalled();
  });

  it('should update pledge when currency is changed in edit mode', async () => {
    const mockLink = new StaticMockLink(
      [
        ...PLEDGE_MODAL_MOCKS,
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: { id: '1', currency: 'EUR', users: ['1'] },
          },
          result: {
            data: {
              updateFundraisingCampaignPledge: {
                _id: '1',
              },
            },
          },
        },
      ],
      false,
    );

    renderPledgeModal(mockLink, pledgeProps[1]);

    const currencySelect = screen.getByLabelText('Currency');
    fireEvent.mouseDown(currencySelect);

    await waitFor(
      () => {
        const eurOption = screen.getByText(/EUR/);
        fireEvent.click(eurOption);
      },
      { timeout: 2000 },
    );

    const form = screen.getByTestId('pledgeForm');
    fireEvent.submit(form);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(translations.pledgeUpdated);
      },
      { timeout: 2000 },
    );
  });

  it('should update pledge when startDate is changed in edit mode', async () => {
    const mockLink = new StaticMockLink(
      [
        ...PLEDGE_MODAL_MOCKS,
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: { id: '1', startDate: '2024-02-01', users: ['1'] },
          },
          result: {
            data: {
              updateFundraisingCampaignPledge: {
                _id: '1',
              },
            },
          },
        },
      ],
      false,
    );

    renderPledgeModal(mockLink, pledgeProps[1]);

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '01/02/2024' } });

    const form = screen.getByTestId('pledgeForm');
    fireEvent.submit(form);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(translations.pledgeUpdated);
      },
      { timeout: 2000 },
    );
  });

  it('should update pledge when endDate is changed in edit mode', async () => {
    const mockLink = new StaticMockLink(
      [
        ...PLEDGE_MODAL_MOCKS,
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: { id: '1', endDate: '2024-02-10', users: ['1'] },
          },
          result: {
            data: {
              updateFundraisingCampaignPledge: {
                _id: '1',
              },
            },
          },
        },
      ],
      false,
    );

    renderPledgeModal(mockLink, pledgeProps[1]);

    const endDateInput = screen.getByLabelText('End Date');
    fireEvent.change(endDateInput, { target: { value: '10/02/2024' } });

    const form = screen.getByTestId('pledgeForm');
    fireEvent.submit(form);

    await waitFor(
      () => {
        expect(toast.success).toHaveBeenCalledWith(translations.pledgeUpdated);
      },
      { timeout: 2000 },
    );
  });

  it('should handle error when updating pledge fails', async () => {
    const errorMessage = 'Failed to update pledge';
    const mockErrorLink = new StaticMockLink(
      [
        {
          request: {
            query: USER_DETAILS,
            variables: {
              id: 'userId',
            },
          },
          result: {
            data: {
              user: {
                user: {
                  _id: 'userId',
                  joinedOrganizations: [
                    {
                      _id: '6537904485008f171cf29924',
                      __typename: 'Organization',
                    },
                  ],
                  firstName: 'Harve',
                  lastName: 'Lance',
                  email: 'testuser1@example.com',
                  image: null,
                  createdAt: '2023-04-13T04:53:17.742Z',
                  birthDate: null,
                  educationGrade: null,
                  employmentStatus: null,
                  gender: null,
                  maritalStatus: null,
                  phone: null,
                  address: {
                    line1: 'Line1',
                    countryCode: 'CountryCode',
                    city: 'CityName',
                    state: 'State',
                    __typename: 'Address',
                  },
                  registeredEvents: [],
                  membershipRequests: [],
                  __typename: 'User',
                },
                appUserProfile: {
                  _id: '67078abd85008f171cf2991d',
                  adminFor: [],
                  isSuperAdmin: false,
                  appLanguageCode: 'en',
                  createdOrganizations: [],
                  createdEvents: [],
                  eventAdmin: [],
                  __typename: 'AppUserProfile',
                },
                __typename: 'UserData',
              },
            },
          },
        },
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: {
              id: '1',
              amount: 200,
              users: ['1'],
            },
          },
          error: new Error(errorMessage),
        },
      ],
      false,
    );

    renderPledgeModal(mockErrorLink, pledgeProps[1]);

    await waitFor(
      () => {
        expect(screen.getByLabelText('Amount')).toHaveValue('100');
      },
      { timeout: 2000 },
    );

    const amountInput = screen.getByLabelText('Amount');
    fireEvent.change(amountInput, { target: { value: '200' } });

    const form = screen.getByTestId('pledgeForm');
    fireEvent.submit(form);

    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      },
      { timeout: 2000 },
    );
  });

  it('should adjust endDate when startDate is changed to a date after current endDate', async () => {
    const props = {
      ...pledgeProps[0],
      pledge: {
        ...pledgeProps[0].pledge!,
        startDate: '2024-01-01',
        endDate: '2024-01-15',
      },
    };

    renderPledgeModal(link1, props);

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '20/01/2024' } });

    await waitFor(
      () => {
        const endDateInput = screen.getByLabelText('End Date');
        expect(endDateInput).toHaveValue('20/01/2024');
      },
      { timeout: 2000 },
    );
  });

  it('should only update amount when value is greater than 0', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');

    fireEvent.change(amountInput, { target: { value: '0' } });
    expect(amountInput).not.toHaveValue('0');

    fireEvent.change(amountInput, { target: { value: '150' } });
    await waitFor(
      () => {
        expect(amountInput).toHaveValue('150');
      },
      { timeout: 2000 },
    );
  });

  it('should update pledgeUsers when selecting pledgers in Autocomplete', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    const autoCompleteInput = within(pledgerSelect).getByRole('combobox');

    fireEvent.focus(autoCompleteInput);
    fireEvent.change(autoCompleteInput, { target: { value: 'Harve' } });

    await waitFor(
      () => {
        const options = screen.getAllByRole('option');
        expect(options.length).toBeGreaterThan(0);
      },
      { timeout: 2000 },
    );

    const options = screen.getAllByRole('option');
    fireEvent.click(options[0]);

    await waitFor(
      () => {
        expect(within(pledgerSelect).getByText(/Harve/)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it('should correctly compare options in Autocomplete using isOptionEqualToValue', async () => {
    const propsWithMultipleUsers = {
      ...pledgeProps[0],
      pledge: {
        ...pledgeProps[0].pledge!,
        users: [
          {
            id: '1',
            firstName: 'Harve',
            lastName: 'Lance',
            name: 'Harve Lance',
            image: undefined,
          },
        ],
      },
    };

    renderPledgeModal(link1, propsWithMultipleUsers);

    await waitFor(
      () => {
        const pledgerSelect = screen.getByTestId('pledgerSelect');
        expect(
          within(pledgerSelect).getByText(/Harve Lance/),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it('should close modal when clicking close button', async () => {
    renderPledgeModal(link1, pledgeProps[1]);

    const closeButton = screen.getByTestId('pledgeModalCloseBtn');
    fireEvent.click(closeButton);

    expect(pledgeProps[1].hide).toHaveBeenCalled();
  });

  it('should handle NaN values for amount input', async () => {
    renderPledgeModal(link1, pledgeProps[0]);

    const amountInput = screen.getByLabelText('Amount');
    const currentValue = amountInput.getAttribute('value');

    fireEvent.change(amountInput, { target: { value: 'abc' } });

    expect(amountInput.getAttribute('value')).toBe(currentValue);
  });

  it('should handle getUserDetails query loading state', async () => {
    const loadingProps = {
      ...pledgeProps[0],
      pledge: null,
    };

    renderPledgeModal(link1, loadingProps);

    await waitFor(
      () => {
        expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    const pledgerSelect = screen.getByTestId('pledgerSelect');
    expect(pledgerSelect).toBeInTheDocument();
  });

  it('should handle NaN amount input', async () => {
    renderPledgeModal(link1, pledgeProps[0]);
    const amountInput = screen.getByLabelText(translations.amount);
    const initialValue = amountInput.getAttribute('value');

    fireEvent.change(amountInput, { target: { value: 'abc' } });

    await waitFor(() => {
      expect(amountInput.getAttribute('value')).toBe(initialValue);
    });
  });

  it('should handle negative amount input', async () => {
    renderPledgeModal(link1, pledgeProps[0]);
    const amountInput = screen.getByLabelText(translations.amount);
    const initialValue = amountInput.getAttribute('value');

    fireEvent.change(amountInput, { target: { value: '-50' } });

    await waitFor(() => {
      expect(amountInput.getAttribute('value')).toBe(initialValue);
    });
  });

  it('should handle zero amount input', async () => {
    renderPledgeModal(link1, pledgeProps[0]);
    const amountInput = screen.getByLabelText(translations.amount);
    const initialValue = amountInput.getAttribute('value');

    fireEvent.change(amountInput, { target: { value: '0' } });

    await waitFor(() => {
      expect(amountInput.getAttribute('value')).toBe(initialValue);
    });
  });

  it('should update pledgeEndDate when pledgeStartDate exceeds current endDate', async () => {
    const propsWithDates = {
      ...pledgeProps[0],
      pledge: {
        ...pledgeProps[0].pledge!,
        startDate: '2024-01-01',
        endDate: '2024-01-05',
      },
    };

    renderPledgeModal(link1, propsWithDates);

    await waitFor(() => {
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    });

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '10/01/2024' } });

    await waitFor(() => {
      const endDateInput = screen.getByLabelText('End Date');
      expect(endDateInput).toHaveValue('10/01/2024');
    });
  });

  it('should not update pledgeEndDate when pledgeStartDate does not exceed current endDate', async () => {
    const propsWithDates = {
      ...pledgeProps[1],
      pledge: {
        ...pledgeProps[1].pledge!,
        startDate: '2024-01-01',
        endDate: '2024-01-30',
      },
    };

    renderPledgeModal(link1, propsWithDates);

    await waitFor(() => {
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    });

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '15/01/2024' } });

    await waitFor(() => {
      const endDateInput = screen.getByLabelText('End Date');
      expect(endDateInput).toHaveValue('30/01/2024');
    });
  });

  it('should update pledge with changed users array', async () => {
    const mockLink = new StaticMockLink(
      [
        ...PLEDGE_MODAL_MOCKS,
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: { id: '1', users: ['userId2'] },
          },
          result: {
            data: {
              updateFundraisingCampaignPledge: {
                _id: '1',
              },
            },
          },
        },
      ],
      false,
    );

    const updatedPledgeProps = {
      ...pledgeProps[1],
      pledge: {
        ...pledgeProps[1].pledge!,
        users: [
          {
            id: 'userId2',
            firstName: 'Jane',
            lastName: 'Doe',
            name: 'Jane Doe',
            image: null,
          },
        ],
      },
    };

    renderPledgeModal(mockLink, updatedPledgeProps);

    await waitFor(() => {
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument();
    });

    const submitBtn = screen.getByTestId('submitPledgeBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.pledgeUpdated);
    });
  });

  it('should update pledge without changing users when users reference is same', async () => {
    const usersArray = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        image: undefined,
      },
    ];

    const pledgeWithSameUsersRef = {
      ...pledgeProps[1],
      pledge: {
        ...pledgeProps[1].pledge!,
        users: usersArray,
      },
    };

    const mockLink = new StaticMockLink(
      [
        ...PLEDGE_MODAL_MOCKS,
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: { id: '1', amount: 200, users: ['1'] },
          },
          result: {
            data: {
              updateFundraisingCampaignPledge: {
                _id: '1',
              },
            },
          },
        },
      ],
      false,
    );

    renderPledgeModal(mockLink, pledgeWithSameUsersRef);

    await waitFor(() => {
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument();
    });

    const amountInput = screen.getByLabelText(translations.amount);
    fireEvent.change(amountInput, { target: { value: '200' } });

    const submitBtn = screen.getByTestId('submitPledgeBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.pledgeUpdated);
    });
  });

  it('should handle missing user data gracefully', async () => {
    const nullUserDataLink = new StaticMockLink(
      [
        {
          request: {
            query: USER_DETAILS,
            variables: { id: 'userId' },
          },
          result: {
            data: null,
          },
        },
      ],
      false,
    );

    renderPledgeModal(nullUserDataLink, pledgeProps[0]);

    await waitFor(() => {
      expect(screen.getByTestId('pledgerSelect')).toBeInTheDocument();
    });
  });

  it('should not include users in update when users array is empty', async () => {
    const pledgeWithNoUsers = {
      ...pledgeProps[1],
      pledge: {
        ...pledgeProps[1].pledge!,
        users: [],
      },
    };

    const mockLink = new StaticMockLink(
      [
        ...PLEDGE_MODAL_MOCKS,
        {
          request: {
            query: UPDATE_PLEDGE,
            variables: { id: '1', amount: 200 },
          },
          result: {
            data: {
              updateFundraisingCampaignPledge: {
                _id: '1',
              },
            },
          },
        },
      ],
      false,
    );

    renderPledgeModal(mockLink, pledgeWithNoUsers);

    await waitFor(() => {
      expect(screen.getByText(translations.editPledge)).toBeInTheDocument();
    });

    const submitBtn = screen.getByTestId('submitPledgeBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(translations.pledgeUpdated);
    });
  });
});
