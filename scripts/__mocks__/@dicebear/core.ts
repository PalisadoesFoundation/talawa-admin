import { vi } from 'vitest';

export const createAvatar = vi.fn(() => {
  return {
    toDataUri: vi.fn(() => 'mocked-data-uri'),
  };
});
