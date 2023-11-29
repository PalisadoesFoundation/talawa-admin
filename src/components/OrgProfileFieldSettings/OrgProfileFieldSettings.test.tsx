import React from 'react';
import { act, render, screen } from '@testing-library/react';
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
      variables: {
        organizationId: '',
        customFieldId: '',
      },
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

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Save Button', () => {
  test('Saving Organization Custom Field', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();
    userEvent.click(screen.getByTestId('saveChangesBtn'));
  });

  test('Testing Typing Organization Custom Field Name', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={MOCKS} addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();

    const fieldNameInput = getByTestId('customFieldInput');
    userEvent.type(fieldNameInput, 'Age');
  });
  test('When No Custom Data is Presenet', async () => {
    const { getByText } = render(
      <MockedProvider mocks={NO_C_FIELD_MOCK} addTypename={false} link={link2}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();
    expect(getByText('No custom fields available')).toBeInTheDocument();
  });
  test('Testing Remove Custom Field Button', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false} link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgProfileFieldSettings />
        </I18nextProvider>
      </MockedProvider>
    );

    await wait();
    userEvent.click(screen.getByTestId('removeCustomFieldBtn'));
  });
});
