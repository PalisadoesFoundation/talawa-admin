import { isValidLink } from './linkValidator';

describe('Testing link validator', () => {
  it('returns true for a valid link', () => {
    const validLink = 'https://www.example.com';
    const result = isValidLink(validLink);
    expect(result).toBe(true);
  });

  it('returns false for an invalid link', () => {
    const invalidLink = 'not a valid link';
    const result = isValidLink(invalidLink);
    expect(result).toBe(false);
  });
});
