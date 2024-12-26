import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import OrgProfileFieldSettings from './OrgProfileFieldSettings';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  ADD_CUSTOM_FIELD,
  REMOVE_CUSTOM_FIELD,
} from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_CUSTOM_FIELDS } from 'GraphQl/Queries/Queries';
import { ToastContainer, toast } from 'react-toastify';
import { vi } from 'vitest';

/**
 * Unit Tests for `OrgProfileFieldSettings` Component
 *
 * - Saving Custom Field: Verifies success and failure of adding a custom field.
 * - Typing Custom Field Name: Ensures input updates correctly.
 * - Handling No Custom Fields: Displays message when no custom fields exist.
 * - Removing Custom Field: Verifies success and failure of removing a custom field.
 * - Error Handling: Ensures error messages for GraphQL mutations are displayed.
 * - Mock GraphQL Responses: Mocks GraphQL queries and mutations for different scenarios.
 */

const MOCKS = [
  {
    request: {
      query: ADD_CUSTOM_FIELD,
      variables: {
        type: '',
        name: '',
      },
    },
    result: {
      data: {
        addOrganizationCustomField: {
          name: 'Custom Field Name',
          type: 'string',
        },
      },
    },
  },

  {
    request: {
      query: REMOVE_CUSTOM_FIELD,
      variables: { customFieldId: 'adsdasdsa334343yiu423434' },
    },
    result: {
      data: {
        removeOrganizationCustomField: {
          type: '',
          name: '',
        },
      },
    },
  },

  {
    request: {
      query: ORGANIZATION_CUSTOM_FIELDS,
      variables: {},
    },
    result: {
      data: {
        customFieldsByOrganization: [
          {
            _id: 'adsdasdsa334343yiu423434',
            type: 'fieldType',
            name: 'fieldName',
          },
        ],
      },
    },
  },
];

const ERROR_MOCKS = [
  {
    request: {
      query: ADD_CUSTOM_FIELD,
      variables: {
        type: '',
        name: '',
      },
    },
    error: new Error('Failed to add custom field'),
  },
  {
    request: {
      query: REMOVE_CUSTOM_FIELD,
      variables: {
        customFieldId: 'adsdasdsa334343yiu423434',
      },
    },
    error: new Error('Failed to remove custom field'),
  },
  {
    request: {
      query: ORGANIZATION_CUSTOM_FIELDS,
      variables: {},
    },
    result: {
      data: {
        customFieldsByOrganization: [
          {
            _id: 'adsdasdsa334343yiu423434',
            type: 'fieldType',
            name: 'fieldName',
          },
        ],
      },
    },
  },
];

const ORGANIZATION_CUSTOM_FIELDS_ERROR_MOCKS = [
  {
    request: {
      query: ORGANIZATION_CUSTOM_FIELDS,
      variables: {},
    },
    error: new Error('Failed to fetch custom field'),
  },
];

const NO_C_FIELD_MOCK = [
  {
    request: {
      query: ADD_CUSTOM_FIELD,
      variables: {
        type: 'fieldType',
        name: 'fieldName',
      },
    },
    result: {
      data: {
        addOrganizationCustomField: {
          name: 'Custom Field Name',
          type: 'string',
        },
      },
    },
  },

  {
    request: {
      query: ORGANIZATION_CUSTOM_FIELDS,
      variables: {},
    },
    result: {
      data: {
        customFieldsByOrganization: [],
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(NO_C_FIELD_MOCK, true);
const link3 = new StaticMockLink(ERROR_MOCKS, true);
const link4 = new StaticMockLink(ORGANIZATION_CUSTOM_FIELDS_ERROR_MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Save Button', () => {
  it('Testing Failure Case For Fetching Custom field', async () => {
    render(
      <MockedProvider
        mocks={ORGANIZATION_CUSTOM_FIELDS_ERROR_MOCKS}
        addTypename={false}
        link={link4}
      >
        <I18nextProvider i18n={i18nForTest}>
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    expect(
      screen.queryByText('Failed to fetch custom field'),
    ).toBeInTheDocument();
  });
  it('Saving Organization Custom Field', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <ToastContainer />
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('saveChangesBtn'));
    await wait();
    expect(screen.queryByText('Field added successfully')).toBeInTheDocument();
  });

  it('Testing Failure Case For Saving Custom Field', async () => {
    render(
      <MockedProvider mocks={ERROR_MOCKS} addTypename={false} link={link3}>
        <I18nextProvider i18n={i18nForTest}>
          <ToastContainer />
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId('saveChangesBtn'));
    await wait();
    expect(
      screen.queryByText('Failed to add custom field'),
    ).toBeInTheDocument();
    await wait();
    userEvent.type(screen.getByTestId('customFieldInput'), 'Age{enter}');
    await wait();
    expect(
      screen.queryByText('Failed to add custom field'),
    ).toBeInTheDocument();
  });

  it('Testing Typing Organization Custom Field Name', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={MOCKS} addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    const fieldNameInput = getByTestId('customFieldInput');
    userEvent.type(fieldNameInput, 'Age');
  });
  it('When No Custom Data is Present', async () => {
    const { getByText } = render(
      <MockedProvider mocks={NO_C_FIELD_MOCK} addTypename={false} link={link2}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    expect(getByText('No custom fields available')).toBeInTheDocument();
  });
  it('Testing Remove Custom Field Button', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <ToastContainer />
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();
    userEvent.click(screen.getByTestId('removeCustomFieldBtn'));
    await wait();
    expect(
      screen.queryByText('Field removed successfully'),
    ).toBeInTheDocument();
  });

  it('Testing Failure Case For Removing Custom Field', async () => {
    const toastSpy = vi.spyOn(toast, 'error');
    render(
      <MockedProvider mocks={ERROR_MOCKS} addTypename={false} link={link3}>
        <I18nextProvider i18n={i18nForTest}>
          <ToastContainer />
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    userEvent.click(screen.getByTestId('removeCustomFieldBtn'));
    await wait();
    expect(toastSpy).toHaveBeenCalledWith('Failed to remove custom field');
  });
});
