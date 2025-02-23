import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';
import i18next from 'i18next';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OrgProfileFieldSettings from './OrgProfileFieldSettings';
import {
  ADD_CUSTOM_FIELD,
  REMOVE_CUSTOM_FIELD,
} from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_CUSTOM_FIELDS } from 'GraphQl/Queries/Queries';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: vi.fn(),
      },
    }),
  };
});

describe('OrgProfileFieldSettings', () => {
  const mockOrgId = '123';
  const mockCustomFields = [
    { id: '1', name: 'Field 1', type: 'Text' },
    { id: '2', name: 'Field 2', type: 'Number' },
  ];

  const mocks = [
    {
      request: {
        query: ORGANIZATION_CUSTOM_FIELDS,
        variables: { organizationId: mockOrgId },
      },
      result: {
        data: {
          organization: {
            customFields: mockCustomFields,
          },
        },
      },
    },
    {
      request: {
        query: ADD_CUSTOM_FIELD,
        variables: {
          organizationId: mockOrgId,
          name: 'New Field',
          type: 'Text',
        },
      },
      result: {
        data: {
          addCustomField: {
            id: '3',
            name: 'New Field',
            type: 'Text',
          },
        },
      },
    },
    {
      request: {
        query: REMOVE_CUSTOM_FIELD,
        variables: { id: '1' },
      },
      result: {
        data: {
          removeCustomField: {
            id: '1',
          },
        },
      },
    },
  ];

  const renderComponent = (): void => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <I18nextProvider i18n={i18next}>
          <MemoryRouter initialEntries={[`/org/${mockOrgId}`]}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgProfileFieldSettings />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('renders custom fields after loading', async () => {
    renderComponent();

    await waitFor(() => {
      mockCustomFields.forEach((field) => {
        expect(screen.getByText(field.name)).toBeInTheDocument();
        expect(screen.getByText(field.type)).toBeInTheDocument();
      });
    });
  });

  it('shows error message when adding field without required data', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument();
    });

    const saveButton = screen.getByTestId('saveChangesBtn');
    fireEvent.click(saveButton);

    expect(toast.error).toHaveBeenCalledWith('pleaseFillAllRequiredFields');
  });

  it('handles Enter key press in name input', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('customFieldInput');
    fireEvent.change(nameInput, { target: { value: 'New Field' } });
    fireEvent.keyDown(nameInput, { key: 'Enter' });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('renders no custom fields message when empty', async () => {
    const emptyMock = [
      {
        request: {
          query: ORGANIZATION_CUSTOM_FIELDS,
          variables: { organizationId: mockOrgId },
        },
        result: {
          data: {
            organization: {
              customFields: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMock} addTypename={false}>
        <I18nextProvider i18n={i18next}>
          <MemoryRouter initialEntries={[`/org/${mockOrgId}`]}>
            <Routes>
              <Route path="/org/:orgId" element={<OrgProfileFieldSettings />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('noCustomField')).toBeInTheDocument();
    });
  });
});
