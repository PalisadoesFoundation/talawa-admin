export const createAvatar = jest.fn(() => {
  return {
    toDataUriSync: jest.fn(() => 'mocked-data-uri'),
  };
});
