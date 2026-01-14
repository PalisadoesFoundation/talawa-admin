import { Iso3166Alpha2CountryCode } from '../interfaces';

describe('Iso3166Alpha2CountryCode enum', () => {
  it('should contain known country codes', () => {
    expect(Iso3166Alpha2CountryCode.in).toBe('in');
    expect(Iso3166Alpha2CountryCode.us).toBe('us');
    expect(Iso3166Alpha2CountryCode.gb).toBe('gb');
  });

  it('should have valid alpha-2 values', () => {
    const values = Object.values(Iso3166Alpha2CountryCode);

    expect(values.length).toBeGreaterThan(0);

    values.forEach((code) => {
      expect(code).toMatch(/^[a-z]{2}$/);
    });
  });
});
