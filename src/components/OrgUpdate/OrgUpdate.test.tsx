import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import OrgUpdate from './OrgUpdate';
import { UPDATE_ORGANIZATION_MUTATION } from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: UPDATE_ORGANIZATION_MUTATION,
      variable: {
        id: '123',
        name: 'John Doe',
        description: 'This is testing',
        isPublic: true,
        visibleInSearch: true,
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '1',
          },
        ],
      },
    },
  },
];

async function wait(ms = 0) {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Testing Organization Update', () => {
  const props = {
    id: '123',
    orgid: '456',
  };

  const formData = {
    name: 'John Doe',
    description: 'This is a description',
    creator: 'Sam Francisco',
    apiUrl: 'https://github.com/PalisadoesFoundation/talawa-admin',
    displayImage: new File(['hello'], 'hello.png', { type: 'image/png' }),
    isPublic: true,
    isVisible: true,
  };

  global.alert = jest.fn();

  test('should render props and text elements test for the page component', async () => {
    render(
      <MockedProvider addTypename={false} mocks={MOCKS}>
        <I18nextProvider i18n={i18nForTest}>
          <OrgUpdate {...props} />
        </I18nextProvider>
      </MockedProvider>
    );

    userEvent.type(
      screen.getByPlaceholderText(/Enter Organization Name/i),
      formData.name
    );
    userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      formData.description
    );
    userEvent.type(screen.getByPlaceholderText(/Creator/i), formData.creator);
    userEvent.type(screen.getByPlaceholderText(/Api Url/i), formData.apiUrl);
    userEvent.upload(
      screen.getByLabelText(/display image:/i),
      formData.displayImage
    );
    userEvent.click(screen.getByLabelText(/Is Public:/i));
    userEvent.click(screen.getByLabelText(/Is Registrable:/i));

    await wait();

    userEvent.click(screen.getByText(/Save Changes/i));

    expect(screen.getByPlaceholderText(/Organization Name/i)).toHaveValue(
      formData.name
    );
    expect(screen.getByPlaceholderText(/Description/i)).toHaveValue(
      formData.description
    );
    expect(screen.getByPlaceholderText(/Creator/i)).toHaveValue(
      formData.creator
    );
    expect(screen.getByPlaceholderText(/Api Url/i)).toHaveValue(
      formData.apiUrl
    );
    expect(screen.getByLabelText(/display image:/i)).toBeTruthy();
    expect(screen.getByLabelText(/Is Public:/i)).not.toBeChecked();
    expect(screen.getByLabelText(/Is Registrable:/i)).toBeChecked();
    expect(screen.getByText(/Cancel/i)).toBeTruthy();

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Creator')).toBeInTheDocument();
    expect(screen.getByText('Api Url')).toBeInTheDocument();
    expect(screen.getByText('Display Image:')).toBeInTheDocument();
    expect(screen.getByText('Is Public:')).toBeInTheDocument();
    expect(screen.getByText('Is Registrable:')).toBeInTheDocument();
  });
});
