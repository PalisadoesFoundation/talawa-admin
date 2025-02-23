import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { type Mock, describe, it, expect, beforeEach, vi } from 'vitest';
import OrgProfileFieldSettings from './OrgProfileFieldSettings';

// --- Mocks --- //
vi.mock('@apollo/client', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));
import { useQuery, useMutation } from '@apollo/client';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-router-dom', () => ({
  useParams: () => ({ orgId: 'testOrgId' }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
import { toast } from 'react-toastify';

// Mock i18next
vi.mock('i18next', () => {
  const listeners: Record<string, ((...args: never[]) => void)[]> = {};
  return {
    default: {
      on: vi.fn((event: string, cb: (...args: never[]) => void) => {
        if (!listeners[event]) {
          listeners[event] = [];
        }
        listeners[event].push(cb);
      }),
      off: vi.fn((event: string, cb: (...args: never[]) => void) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter(
            (listener) => listener !== cb,
          );
        }
      }),
      emit: vi.fn((event: string, ...args: never[]) => {
        if (listeners[event]) {
          listeners[event].forEach((cb) => cb(...args));
        }
      }),
    },
  };
});
import i18next from 'i18next';

// Mock EditOrgCustomFieldDropDown component
vi.mock(
  'components/EditCustomFieldDropDown/EditOrgCustomFieldDropDown',
  () => ({
    default: ({
      setCustomFieldData,
      customFieldData,
    }: {
      setCustomFieldData: (data: {
        type: string;
        name: string;
        id: string;
      }) => void;
      customFieldData: { type: string; name: string; id: string };
    }) => (
      <select
        data-testid="customFieldTypeSelect"
        value={customFieldData.type}
        onChange={(e) =>
          setCustomFieldData({ ...customFieldData, type: e.target.value })
        }
      >
        <option value="">Select Type</option>
        <option value="text">Text</option>
      </select>
    ),
  }),
);

describe('OrgProfileFieldSettings', () => {
  let refetchMock: ReturnType<typeof vi.fn>;
  let addCustomFieldMock: ReturnType<typeof vi.fn>;
  let removeCustomFieldMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    refetchMock = vi.fn().mockResolvedValue({});
    addCustomFieldMock = vi.fn().mockResolvedValue({});
    removeCustomFieldMock = vi.fn().mockResolvedValue({});

    (useQuery as Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { organization: { customFields: [] } },
      refetch: refetchMock,
    });

    // Fix: Mock both mutations properly
    (useMutation as Mock)
      .mockReturnValueOnce([addCustomFieldMock])
      .mockReturnValueOnce([removeCustomFieldMock]);
  });

  it('renders loading state', () => {
    (useQuery as Mock).mockReturnValueOnce({
      loading: true,
      error: null,
      data: null,
      refetch: refetchMock,
    });
    render(<OrgProfileFieldSettings />);
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (useQuery as Mock).mockReturnValueOnce({
      loading: false,
      error: new Error('Test error'),
      data: null,
      refetch: refetchMock,
    });
    render(<OrgProfileFieldSettings />);
    expect(screen.getByText('pleaseFillAllRequiredFields')).toBeInTheDocument();
  });

  it('renders no custom fields message', () => {
    render(<OrgProfileFieldSettings />);
    expect(screen.getByText('noCustomField')).toBeInTheDocument();
  });

  it('renders custom fields table', () => {
    (useQuery as Mock).mockReturnValueOnce({
      loading: false,
      error: null,
      data: {
        organization: {
          customFields: [{ id: '1', name: 'Field1', type: 'text' }],
        },
      },
      refetch: refetchMock,
    });
    render(<OrgProfileFieldSettings />);
    expect(screen.getByText('Field1')).toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('does not call handleRemove when field id is empty', () => {
    (useQuery as Mock).mockReturnValueOnce({
      loading: false,
      error: null,
      data: {
        organization: {
          customFields: [{ id: '', name: 'Field1', type: 'text' }],
        },
      },
      refetch: refetchMock,
    });
    render(<OrgProfileFieldSettings />);
    const removeBtn = screen.getByTestId('removeCustomFieldBtn');
    fireEvent.click(removeBtn);
    expect(removeCustomFieldMock).not.toHaveBeenCalled();
  });

  it('calls toast.error on save when required fields are missing', async () => {
    render(<OrgProfileFieldSettings />);
    fireEvent.click(screen.getByTestId('saveChangesBtn'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('pleaseFillAllRequiredFields');
    });
  });

  it('successfully removes a custom field', async () => {
    (useQuery as Mock).mockReturnValueOnce({
      loading: false,
      error: null,
      data: {
        organization: {
          customFields: [{ id: '1', name: 'Field1', type: 'text' }],
        },
      },
      refetch: refetchMock,
    });

    render(<OrgProfileFieldSettings />);

    const removeBtn = screen.getByTestId('removeCustomFieldBtn');
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(removeCustomFieldMock).toHaveBeenCalledWith({
        variables: { id: '1' },
      });
      expect(refetchMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('customFieldRemoved');
    });
  });

  it('refetches on language change', async () => {
    render(<OrgProfileFieldSettings />);
    i18next.emit('languageChanged');
    await waitFor(() => {
      expect(refetchMock).toHaveBeenCalled();
    });
  });

  it('removes languageChanged listener on unmount', () => {
    const { unmount } = render(<OrgProfileFieldSettings />);
    unmount();
    expect(i18next.off).toHaveBeenCalled();
  });
});
