import { generate } from './generator';

describe('Testing mock generate util', () => {
  test('should return a Promise', async () => {
    const result = generate();
    expect(result).toBeInstanceOf(Promise);
  });

  test('should resolve to a Uint8Array', async () => {
    const result = await generate();
    expect(result).toBeInstanceOf(Uint8Array);
  });

  test('should resolve to a Uint8Array with correct values', async () => {
    const result = await generate();
    expect(result).toEqual(new Uint8Array([10, 20, 30, 40, 50]));
  });
});
