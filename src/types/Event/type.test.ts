import { EventVolunteerResponseEnum, EventOrderByInputEnum } from './type';

test('EventVolunteerResponseEnum values', () => {
  expect(EventVolunteerResponseEnum.YES).toBe('YES');
  expect(EventVolunteerResponseEnum.NO).toBe('NO');
});

test('EventOrderByInputEnum contains expected keys', () => {
  expect(EventOrderByInputEnum.title_ASC).toBe('title_ASC');
  expect(EventOrderByInputEnum.startDate_DESC).toBe('startDate_DESC');
});
