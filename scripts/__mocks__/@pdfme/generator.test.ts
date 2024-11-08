import { generate } from './generator';

describe('Testing mock generate util', () => {
  test('should return a Promise', async () => {
    const result = generate({ template: {}, inputs: [] });
    expect(result).toBeInstanceOf(Promise);
  });

  test('should resolve to a Uint8Array', async () => {
    const result = generate({ template: {}, inputs: [] });
    expect(result).toBeInstanceOf(Uint8Array);
  });
});
