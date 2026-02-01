import { Iso3166Alpha2CountryCode } from './interfaces';

describe('interfaces.ts enums', () => {
  it('Iso3166Alpha2CountryCode should contain valid country codes', () => {
    expect(Iso3166Alpha2CountryCode.in).toBe('in');
    expect(Iso3166Alpha2CountryCode.us).toBe('us');
    expect(Iso3166Alpha2CountryCode.gb).toBe('gb');
  });

  it('Iso3166Alpha2CountryCode should have many entries', () => {
    expect(Object.keys(Iso3166Alpha2CountryCode).length).toBeGreaterThan(200);
  });
});
