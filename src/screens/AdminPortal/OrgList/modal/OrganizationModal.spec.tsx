import React from 'react';
import {
  render,
  screen,
  fireEvent,
  RenderResult,
  cleanup,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '../../../../state/store';
import { I18nextProvider } from 'react-i18next';
// Imported InterfaceFormStateType from the component file to avoid duplication
import OrganizationModal, { InterfaceFormStateType } from './OrganizationModal';
import i18nForTest from '../../../../utils/i18nForTest';

describe('OrganizationModal Component', () => {
  const mockToggleModal = vi.fn();
  const mockCreateOrg = vi.fn((e) => e.preventDefault());
  const mockSetFormState = vi.fn();

  const initialFormState: InterfaceFormStateType = {
    addressLine1: '',
    addressLine2: '',
    avatar: null,
    avatarPreview: null,
    city: '',
    countryCode: '',
    description: '',
    name: '',
    postalCode: '',
    state: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const setup = (customFormState = initialFormState): RenderResult => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <OrganizationModal
              showModal={true}
              toggleModal={mockToggleModal}
              formState={customFormState}
              setFormState={mockSetFormState}
              createOrg={mockCreateOrg}
              t={(key) => key}
              tCommon={(key) => key}
              userData={undefined}
            />
          </I18nextProvider>
        </BrowserRouter>
      </Provider>,
    );
  };

  test('renders OrganizationModal and all available fields correctly', () => {
    setup();
    expect(screen.getByTestId('modalOrganizationHeader')).toBeInTheDocument();
    expect(screen.getByTestId('modalOrganizationName')).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationDescription'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationCountryCode'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('modalOrganizationState')).toBeInTheDocument();
    expect(screen.getByTestId('modalOrganizationCity')).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationPostalCode'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationAddressLine1'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('modalOrganizationAddressLine2'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('submitOrganizationForm')).toBeInTheDocument();

    // Avatar input is temporarily removed and should not be in the document
    expect(screen.queryByTestId('organisationImage')).not.toBeInTheDocument();
  });

  const textFields = [
    { id: 'modalOrganizationName', key: 'name', value: 'New Org', limit: 50 },
    {
      id: 'modalOrganizationDescription',
      key: 'description',
      value: 'Description',
      limit: 200,
    },
    { id: 'modalOrganizationState', key: 'state', value: 'State', limit: 50 },
    { id: 'modalOrganizationCity', key: 'city', value: 'City', limit: 50 },
    {
      id: 'modalOrganizationPostalCode',
      key: 'postalCode',
      value: '12345',
      limit: 50,
    },
    {
      id: 'modalOrganizationAddressLine1',
      key: 'addressLine1',
      value: 'Addr 1',
      limit: 50,
    },
  ];

  textFields.forEach(({ id, key, value, limit }) => {
    test(`updates ${key} field correctly and respects limit`, () => {
      setup();
      const input = screen.getByTestId(id);
      fireEvent.change(input, { target: { value } });
      expect(mockSetFormState).toHaveBeenCalled();

      mockSetFormState.mockClear();
      fireEvent.change(input, { target: { value: 'a'.repeat(limit + 1) } });
      expect(mockSetFormState).not.toHaveBeenCalled();
    });
  });

  test('updates addressLine2 field correctly', () => {
    setup();
    const input = screen.getByTestId('modalOrganizationAddressLine2');
    fireEvent.change(input, { target: { value: 'Apt 2' } });

    expect(mockSetFormState).toHaveBeenCalledWith(expect.any(Function));
  });

  test('handles country code selection correctly', () => {
    setup();
    const select = screen.getByTestId('modalOrganizationCountryCode');
    fireEvent.change(select, { target: { value: 'us' } });
    expect(mockSetFormState).toHaveBeenCalled();
  });

  test('triggers createOrg on form submission', async () => {
    setup();
    const form = screen.getByTestId('submitOrganizationForm').closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    expect(mockCreateOrg).toHaveBeenCalled();
  });

  test('closes modal via toggleModal prop', async () => {
    setup();
    const closeButton = screen.getByLabelText(/close/i);
    await userEvent.click(closeButton);
    expect(mockToggleModal).toHaveBeenCalled();
  });

  test('validates required fields presence', () => {
    setup();
    expect(screen.getByTestId('modalOrganizationName')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationDescription')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationCountryCode')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationState')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationCity')).toBeRequired();
    expect(screen.getByTestId('modalOrganizationAddressLine1')).toBeRequired();
  });
});
