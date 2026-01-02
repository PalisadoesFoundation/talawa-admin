import { EventVolunteerResponseEnum, EventOrderByInputEnum } from './type';

describe('EventVolunteerResponseEnum', () => {
  test('contains YES value', () => {
    expect(EventVolunteerResponseEnum.YES).toBe('YES');
  });

  test('contains NO value', () => {
    expect(EventVolunteerResponseEnum.NO).toBe('NO');
  });

  test('has exactly 2 keys', () => {
    expect(Object.keys(EventVolunteerResponseEnum)).toHaveLength(2);
  });

  test('all values are strings', () => {
    Object.values(EventVolunteerResponseEnum).forEach((value) => {
      expect(typeof value).toBe('string');
    });
  });

  test('all keys match their values', () => {
    Object.entries(EventVolunteerResponseEnum).forEach(([key, value]) => {
      expect(key).toBe(value);
    });
  });
});

describe('EventOrderByInputEnum', () => {
  test('contains allDay ordering options', () => {
    expect(EventOrderByInputEnum.allDay_ASC).toBe('allDay_ASC');
    expect(EventOrderByInputEnum.allDay_DESC).toBe('allDay_DESC');
  });

  test('contains description ordering options', () => {
    expect(EventOrderByInputEnum.description_ASC).toBe('description_ASC');
    expect(EventOrderByInputEnum.description_DESC).toBe('description_DESC');
  });

  test('contains endDate ordering options', () => {
    expect(EventOrderByInputEnum.endDate_ASC).toBe('endDate_ASC');
    expect(EventOrderByInputEnum.endDate_DESC).toBe('endDate_DESC');
  });

  test('contains endTime ordering options', () => {
    expect(EventOrderByInputEnum.endTime_ASC).toBe('endTime_ASC');
    expect(EventOrderByInputEnum.endTime_DESC).toBe('endTime_DESC');
  });

  test('contains id ordering options', () => {
    expect(EventOrderByInputEnum.id_ASC).toBe('id_ASC');
    expect(EventOrderByInputEnum.id_DESC).toBe('id_DESC');
  });

  test('contains location ordering options', () => {
    expect(EventOrderByInputEnum.location_ASC).toBe('location_ASC');
    expect(EventOrderByInputEnum.location_DESC).toBe('location_DESC');
  });

  test('contains recurrence ordering options', () => {
    expect(EventOrderByInputEnum.recurrence_ASC).toBe('recurrence_ASC');
    expect(EventOrderByInputEnum.recurrence_DESC).toBe('recurrence_DESC');
  });

  test('contains startDate ordering options', () => {
    expect(EventOrderByInputEnum.startDate_ASC).toBe('startDate_ASC');
    expect(EventOrderByInputEnum.startDate_DESC).toBe('startDate_DESC');
  });

  test('contains startTime ordering options', () => {
    expect(EventOrderByInputEnum.startTime_ASC).toBe('startTime_ASC');
    expect(EventOrderByInputEnum.startTime_DESC).toBe('startTime_DESC');
  });

  test('contains title ordering options', () => {
    expect(EventOrderByInputEnum.title_ASC).toBe('title_ASC');
    expect(EventOrderByInputEnum.title_DESC).toBe('title_DESC');
  });

  test('has exactly 20 keys', () => {
    expect(Object.keys(EventOrderByInputEnum)).toHaveLength(20);
  });

  test('all values are strings', () => {
    Object.values(EventOrderByInputEnum).forEach((value) => {
      expect(typeof value).toBe('string');
    });
  });

  test('all keys match their values', () => {
    Object.entries(EventOrderByInputEnum).forEach(([key, value]) => {
      expect(key).toBe(value);
    });
  });

  test('each enum value is accessible', () => {
    const expectedKeys = [
      'allDay_ASC',
      'allDay_DESC',
      'description_ASC',
      'description_DESC',
      'endDate_ASC',
      'endDate_DESC',
      'endTime_ASC',
      'endTime_DESC',
      'id_ASC',
      'id_DESC',
      'location_ASC',
      'location_DESC',
      'recurrence_ASC',
      'recurrence_DESC',
      'startDate_ASC',
      'startDate_DESC',
      'startTime_ASC',
      'startTime_DESC',
      'title_ASC',
      'title_DESC',
    ];

    expectedKeys.forEach((key) => {
      expect(
        EventOrderByInputEnum[key as keyof typeof EventOrderByInputEnum],
      ).toBe(key);
    });
  });
});

describe('Enum exports', () => {
  test('EventVolunteerResponseEnum is defined', () => {
    expect(EventVolunteerResponseEnum).toBeDefined();
  });

  test('EventOrderByInputEnum is defined', () => {
    expect(EventOrderByInputEnum).toBeDefined();
  });

  test('enums are objects', () => {
    expect(typeof EventVolunteerResponseEnum).toBe('object');
    expect(typeof EventOrderByInputEnum).toBe('object');
  });

  test('enums are not null', () => {
    expect(EventVolunteerResponseEnum).not.toBeNull();
    expect(EventOrderByInputEnum).not.toBeNull();
  });
});
