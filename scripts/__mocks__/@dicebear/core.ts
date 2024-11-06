export const createAvatar = jest.fn(() => {
  return {
    toDataUri: jest.fn(() => 'mocked-data-uri'),
  };
});
