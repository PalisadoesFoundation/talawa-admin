import { describe, it, expect } from 'vitest';
import type {
    Event,
    EventInput,
    EventVolunteerResponse,
    EventOrderByInput,
    EventWhereInput,
} from './type';
import { EventVolunteerResponseEnum, EventOrderByInputEnum } from './type';

describe('Event Type Definitions Tests', () => {
    // Test 1: Event type
    describe('Event Type', () => {
        it('should accept valid event with all fields', () => {
            const validEvent: Event = {
                _id: 'event123',
                title: 'Sample Event',
                description: 'Sample description',
                status: 'active',
                startDate: new Date('2025-12-25'),
                endDate: new Date('2025-12-25'),
                startTime: '10:00',
                endTime: '12:00',
                allDay: false,
                isPublic: true,
                isRegisterable: true,
                recurring: false,
                recurrance: 'weekly',
                latitude: 10.0,
                longitude: 20.0,
                location: 'Test Location',
                organization: {
                    _id: 'org123',
                    name: 'Test Organization',
                    description: 'Test description',
                    apiUrl: 'https://example.com',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    customFields: [],
                    userRegistrationRequired: false,
                    visibleInSearch: true,
                },
                creator: {
                    id: 'user123',
                    name: 'John Doe',
                    emailAddress: 'john@example.com',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                actionItems: [],
                admins: [],
                attendees: [],
                attendeesCheckInStatus: [],
                feedback: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                averageFeedbackScore: 5,
            };

            expect(validEvent._id).toBe('event123');
            expect(validEvent.title).toBe('Sample Event');
            expect(validEvent.isPublic).toBe(true);
        });

        it('should allow optional fields to be undefined', () => {
            const minimalEvent: Event = {
                _id: 'event456',
                title: 'Minimal Event',
                description: 'Minimal description',
                status: 'draft',
                startDate: new Date(),
                allDay: true,
                isPublic: false,
                isRegisterable: false,
                recurring: false,
                actionItems: [],
                attendeesCheckInStatus: [],
                feedback: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            expect(minimalEvent.title).toBe('Minimal Event');
            expect(minimalEvent.endDate).toBeUndefined();
            expect(minimalEvent.location).toBeUndefined();
        });
    });

    // Test 2: EventInput type
    describe('EventInput Type', () => {
        it('should accept valid input for creating event', () => {
            const eventInput: EventInput = {
                organizationId: 'org123',
                title: 'New Event',
                description: 'New event description',
                startDate: new Date(),
                allDay: false,
                isPublic: true,
                isRegisterable: true,
                recurring: true,
                recurrance: 'daily',
                location: 'Virtual',
            };

            expect(eventInput.organizationId).toBe('org123');
            expect(eventInput.title).toBe('New Event');
        });
    });

    // Test 3: EventVolunteerResponseEnum
    describe('EventVolunteerResponseEnum', () => {
        it('should have correct values', () => {
            expect(EventVolunteerResponseEnum.NO).toBe('NO');
            expect(EventVolunteerResponseEnum.YES).toBe('YES');
        });

        it('should allow valid response values', () => {
            const response: EventVolunteerResponse = EventVolunteerResponseEnum.YES;
            expect(response).toBe('YES');
        });
    });

    // Test 4: EventOrderByInputEnum
    describe('EventOrderByInputEnum', () => {
        it('should have expected sorting options', () => {
            const keys = Object.keys(EventOrderByInputEnum);
            expect(keys).toContain('allDay_ASC');
            expect(keys).toContain('allDay_DESC');
            expect(keys).toContain('description_ASC');
            expect(keys).toContain('description_DESC');
            expect(keys).toContain('endDate_ASC');
            expect(keys).toContain('endDate_DESC');
            expect(keys).toContain('endTime_ASC');
            expect(keys).toContain('endTime_DESC');
            expect(keys).toContain('id_ASC');
            expect(keys).toContain('id_DESC');
            expect(keys).toContain('location_ASC');
            expect(keys).toContain('location_DESC');
            expect(keys).toContain('recurrance_ASC');
            expect(keys).toContain('recurrance_DESC');
            expect(keys).toContain('startDate_ASC');
            expect(keys).toContain('startDate_DESC');
            expect(keys).toContain('startTime_ASC');
            expect(keys).toContain('startTime_DESC');
            expect(keys).toContain('title_ASC');
            expect(keys).toContain('title_DESC');
        });

        it('should allow valid order by values', () => {
            const orderBy: EventOrderByInput = EventOrderByInputEnum.startDate_DESC;
            expect(orderBy).toBe('startDate_DESC');
        });
    });

    // Test 5: EventWhereInput
    describe('EventWhereInput Type', () => {
        it('should accept search criteria', () => {
            const searchCriteria: EventWhereInput = {
                title_contains: 'Party',
                location_starts_with: 'Room',
                organization_id: 'org123',
            };

            expect(searchCriteria.title_contains).toBe('Party');
            expect(searchCriteria.organization_id).toBe('org123');
        });

        it('should support array filters', () => {
            const arrayFilter: EventWhereInput = {
                id_in: ['id1', 'id2'],
                description_not_in: ['ignore', 'skip'],
            };

            expect(arrayFilter.id_in).toHaveLength(2);
            expect(arrayFilter.description_not_in).toContain('ignore');
        });
    });
});
