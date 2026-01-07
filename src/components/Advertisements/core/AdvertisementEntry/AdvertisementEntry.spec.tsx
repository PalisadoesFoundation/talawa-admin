/**
 * Testing Advertisement Entry Component
 */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router';
import AdvertisementEntry from './AdvertisementEntry';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'react-i18next';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { client } from 'components/Advertisements/AdvertisementsMocks';
import { AdvertisementType } from 'types/Advertisement/type';

let mockUseMutation: ReturnType<typeof vi.fn>;
vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    useMutation: () => mockUseMutation(),
  };
});

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: '1' }),
  };
});

describe('Testing Advertisement Entry Component', () => {
  beforeEach(() => {
    mockUseMutation = vi.fn();
    vi.clearAllMocks();
    mockUseMutation.mockReturnValue([vi.fn()]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Testing rendering and deleting of advertisement with required orgId', async () => {
    const deleteAdByIdMock = vi.fn().mockResolvedValue({
      data: { deleteAdvertisement: { id: '1' } },
    });
    mockUseMutation.mockReturnValue([deleteAdByIdMock]);

    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [{ url: 'test.jpg', mimeType: 'image/jpeg' }],
                  name: 'Advert1',
                  createdAt: new Date(),
                  organization: { id: '12' },
                  orgId: '1', // Added required orgId property
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('AdEntry')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('moreiconbtn'));
    fireEvent.click(screen.getByTestId('deletebtn'));

    await waitFor(() => {
      expect(screen.getByTestId('delete_title')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete_yes'));

    await waitFor(() => {
      expect(deleteAdByIdMock).toHaveBeenCalledWith({
        variables: { id: '1' },
      });
    });
  });

  it('should render LoadingState placeholder in view button', () => {
    render(
      <ApolloProvider client={client}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AdvertisementEntry
                advertisement={{
                  endAt: new Date(),
                  startAt: new Date(),
                  id: '1',
                  attachments: [],
                  name: 'Advert1',
                  createdAt: new Date(),
                  organization: { id: '12' },
                  orgId: '1', // Added required orgId property
                  type: AdvertisementType.Banner,
                  updatedAt: new Date(),
                }}
                setAfterActive={vi.fn()}
                setAfterCompleted={vi.fn()}
              />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>,
    );

    expect(screen.getByTestId('AddOnEntry_btn_install')).toBeInTheDocument();
  });
});
