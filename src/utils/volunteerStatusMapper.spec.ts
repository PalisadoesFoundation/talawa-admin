/**
 * Unit tests for volunteerStatusMapper utility
 *
 * Tests the centralized volunteer status to StatusBadge variant mapping logic
 * to ensure consistent visual representation across all volunteer screens.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { mapVolunteerStatusToVariant } from './volunteerStatusMapper';

describe('volunteerStatusMapper', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe('mapVolunteerStatusToVariant', () => {
    it('should map "requested" status to "pending" variant', () => {
      const result = mapVolunteerStatusToVariant('requested');
      expect(result).toEqual({ variant: 'pending' });
    });

    it('should map "invited" status to "pending" variant', () => {
      const result = mapVolunteerStatusToVariant('invited');
      expect(result).toEqual({ variant: 'pending' });
    });

    it('should map "accepted" status to "accepted" variant', () => {
      const result = mapVolunteerStatusToVariant('accepted');
      expect(result).toEqual({ variant: 'accepted' });
    });

    it('should map "rejected" status to "declined" variant', () => {
      const result = mapVolunteerStatusToVariant('rejected');
      expect(result).toEqual({ variant: 'declined' });
    });

    it('should map unknown status to "no_response" variant', () => {
      const result = mapVolunteerStatusToVariant('unknown');
      expect(result).toEqual({ variant: 'no_response' });
    });

    it('should map empty string to "no_response" variant', () => {
      const result = mapVolunteerStatusToVariant('');
      expect(result).toEqual({ variant: 'no_response' });
    });

    it('should handle case-sensitive status values', () => {
      // Status values should be case-sensitive
      const result = mapVolunteerStatusToVariant('ACCEPTED');
      expect(result).toEqual({ variant: 'no_response' });
    });
  });
});
