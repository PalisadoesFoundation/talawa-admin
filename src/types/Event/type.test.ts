import { EventVolunteerResponseEnum, EventOrderByInputEnum } from './type';

describe('EventVolunteerResponseEnum', () => {
  test('is defined and not null', () => {
    expect(EventVolunteerResponseEnum).toBeDefined();
    expect(EventVolunteerResponseEnum).not.toBeNull();
    expect(typeof EventVolunteerResponseEnum).toBe('object');
  });

  test('contains representative values', () => {
    expect(EventVolunteerResponseEnum.YES).toBe('YES');
    expect(EventVolunteerResponseEnum.NO).toBe('NO');
  });

  test('all values are strings', () => {
    Object.values(EventVolunteerResponseEnum).forEach((value) => {
      expect(typeof value).toBe('string');
    });
  });
});

describe('EventOrderByInputEnum', () => {
  test('is defined and not null', () => {
    expect(EventOrderByInputEnum).toBeDefined();
    expect(EventOrderByInputEnum).not.toBeNull();
    expect(typeof EventOrderByInputEnum).toBe('object');
  });

  test('contains representative ordering values', () => {
    expect(EventOrderByInputEnum.title_ASC).toBe('title_ASC');
    expect(EventOrderByInputEnum.title_DESC).toBe('title_DESC');
    expect(EventOrderByInputEnum.startDate_ASC).toBe('startDate_ASC');
    expect(EventOrderByInputEnum.endDate_DESC).toBe('endDate_DESC');
  });

  test('all values are strings', () => {
    Object.values(EventOrderByInputEnum).forEach((value) => {
      expect(typeof value).toBe('string');
    });
  });
});
