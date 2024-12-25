import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AgendaItemsPreviewModal from './AgendaItemsPreviewModal';
import { describe, test, expect, vi } from 'vitest';

const mockFormState = {
  title: 'Test Title',
  description: 'Test Description',
  duration: '20',
  attachments: [
    'https://example.com/video.mp4',
    'https://example.com/image.jpg',
  ],
  urls: [
    'https://example.com',
    'https://thisisaverylongurlthatexceedsfiftycharacters.com/very/long/path',
  ],
  agendaItemCategoryIds: ['category'],
  agendaItemCategoryNames: ['category'],
  createdBy: {
    firstName: 'Test',
    lastName: 'User',
  },
};

const mockT = (key: string): string => key;

describe('AgendaItemsPreviewModal', () => {
  test('check url and attachment links', () => {
    render(
      <MockedProvider addTypename={false}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AgendaItemsPreviewModal
                  agendaItemPreviewModalIsOpen
                  hidePreviewModal={vi.fn()}
                  formState={mockFormState}
                  showUpdateModal={vi.fn()}
                  toggleDeleteModal={vi.fn()}
                  t={mockT}
                />
              </LocalizationProvider>
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();

    // Check attachments
    const videoLink = screen.getByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'a' &&
        (element as HTMLAnchorElement)?.href ===
          'https://example.com/video.mp4',
    );
    expect(videoLink).toBeInTheDocument();

    const imageLink = screen.getByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'a' &&
        (element as HTMLAnchorElement)?.href ===
          'https://example.com/image.jpg',
    );
    expect(imageLink).toBeInTheDocument();

    // Check URLs
    const shortUrlLink = screen.getByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'a' &&
        (element as HTMLAnchorElement)?.href === 'https://example.com/',
    );
    expect(shortUrlLink).toBeInTheDocument();
    expect(shortUrlLink).toHaveTextContent('https://example.com');

    const longUrlLink = screen.getByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'a' &&
        (element as HTMLAnchorElement)?.href ===
          'https://thisisaverylongurlthatexceedsfiftycharacters.com/very/long/path',
    );
    expect(longUrlLink).toBeInTheDocument();
    expect(longUrlLink).toHaveTextContent(
      'https://thisisaverylongurlthatexceedsfiftycharacte...',
    );
  });
});
