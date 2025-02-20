import { vi } from 'vitest';

export const MOCK_VENUE_ITEM = {
  _id: '1',
  name: 'Grand Hall',
  image: null,
  capacity: '500',
  description: 'A spacious venue for large events and gatherings.',
};

export const MOCK_VENUE_ITEM_WITH_IMAGE = {
  _id: '2',
  name: 'Conference Room',
  image: 'https://surl.li/odyiad',
  capacity: '200',
  description: 'A modern conference room with all amenities.',
};

export const MOCK_VENUE_ITEM_LONG_TEXT = {
  _id: '4',
  name: 'This is a very long venue name that should definitely be truncated in the display',
  image: null,
  capacity: '300',
  description:
    'This is a very long description that should be truncated. It contains more than seventy five characters to ensure we can test the truncation logic properly. This text will be cut off.',
};

export const MOCK_HANDLE_EDIT = vi.fn();
export const MOCK_HANDLE_DELETE = vi.fn();
