import { describe, test, expect, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfileForm } from './useProfileForm';
import type { UserProfile } from './useProfileForm';

describe('useProfileForm Hook', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const initialProfile: UserProfile = {
    name: 'John Doe',
    natalSex: 'Male',
    password: undefined,
    emailAddress: 'john@example.com',
    mobilePhoneNumber: '+1234567890',
    homePhoneNumber: '+0987654321',
    workPhoneNumber: '+1122334455',
    birthDate: '1990-01-01',
    educationGrade: 'Bachelor',
    employmentStatus: 'Employed',
    maritalStatus: 'Single',
    description: 'Test user',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    state: 'CA',
    countryCode: 'US',
    city: 'San Francisco',
    postalCode: '94102',
    avatarURL: 'https://example.com/avatar.jpg',
  };

  describe('Initial State', () => {
    test('should initialize with provided initial profile', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      expect(result.current.form).toEqual(initialProfile);
      expect(result.current.errors).toEqual({});
      expect(result.current.isUpdated).toBe(false);
    });

    test('should have all required methods', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      expect(typeof result.current.setField).toBe('function');
      expect(typeof result.current.validate).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('setField', () => {
    test('should update a single field', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', 'Jane Doe');
      });

      expect(result.current.form.name).toBe('Jane Doe');
      expect(result.current.isUpdated).toBe(true);
    });

    test('should update multiple fields consecutively', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', 'Jane Doe');
        result.current.setField('emailAddress', 'jane@example.com');
        result.current.setField('city', 'Los Angeles');
      });

      expect(result.current.form.name).toBe('Jane Doe');
      expect(result.current.form.emailAddress).toBe('jane@example.com');
      expect(result.current.form.city).toBe('Los Angeles');
      expect(result.current.isUpdated).toBe(true);
    });

    test('should update optional fields', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('password', 'NewPass123!');
        result.current.setField('avatarURL', 'https://example.com/new-avatar.jpg');
      });

      expect(result.current.form.password).toBe('NewPass123!');
      expect(result.current.form.avatarURL).toBe('https://example.com/new-avatar.jpg');
    });

    test('should set isUpdated to true after any field change', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      expect(result.current.isUpdated).toBe(false);

      act(() => {
        result.current.setField('description', 'Updated description');
      });

      expect(result.current.isUpdated).toBe(true);
    });
  });

  describe('validate', () => {
    test('should return true for valid profile', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));
      let isValid = false;

      act(() => {
        isValid = result.current.validate();
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });

    describe('name validation', () => {
      test('should set error when name is empty', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('name', '');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.name).toBe('Name is required');
      });

      test('should set error when name is only whitespace', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('name', '   ');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.name).toBe('Name is required');
      });

      test('should pass when name has valid content', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('name', ' Valid Name ');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.name).toBeUndefined();
      });
    });

    describe('emailAddress validation', () => {
      test('should set error when emailAddress is empty', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('emailAddress', '');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.emailAddress).toBe('Email is required');
      });

      test('should set error when emailAddress is only whitespace', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('emailAddress', '   ');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.emailAddress).toBe('Email is required');
      });

      test('should pass when emailAddress has valid content', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('emailAddress', ' user@example.com ');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.emailAddress).toBeUndefined();
      });
    });

    describe('password validation', () => {
      test('should pass when password is undefined', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', undefined);
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.password).toBeUndefined();
      });

      test('should pass when password is empty string', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', '');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.password).toBeUndefined();
      });

      test('should pass when password is only whitespace', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', '   ');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.password).toBeUndefined();
      });

      test('should set error when password is invalid (too short)', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', 'Short1!');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.password).toBe('Password does not meet policy');
      });

      test('should set error when password is invalid (missing special char)', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', 'NoSpecial123');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.password).toBe('Password does not meet policy');
      });

      test('should set error when password is invalid (missing number)', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', 'NoNumber!@#');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.password).toBe('Password does not meet policy');
      });

      test('should set error when password is invalid (missing uppercase)', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', 'nouppercase123!');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.password).toBe('Password does not meet policy');
      });

      test('should set error when password is invalid (missing lowercase)', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', 'NOLOWERCASE123!');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.password).toBe('Password does not meet policy');
      });

      test('should pass when password meets all requirements', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', 'ValidPass123!');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.password).toBeUndefined();
      });

      test('should pass when password has spaces and meets requirements', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', 'Valid Pass 123!');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.password).toBeUndefined();
      });

      test('should pass when password is exactly 8 characters with all requirements', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('password', 'Pass123!');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.password).toBeUndefined();
      });
    });

    describe('multiple validation errors', () => {
      test('should set multiple errors when multiple fields are invalid', () => {
        const { result } = renderHook(() => useProfileForm(initialProfile));

        act(() => {
          result.current.setField('name', '');
          result.current.setField('emailAddress', '   ');
          result.current.setField('password', 'weak');
        });

        let isValid = false;
        act(() => {
          isValid = result.current.validate();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.name).toBe('Name is required');
        expect(result.current.errors.emailAddress).toBe('Email is required');
        expect(result.current.errors.password).toBe('Password does not meet policy');
      });
    });

    test('should be callable multiple times', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.validate();
        result.current.validate();
        result.current.validate();
      });

      expect(result.current.errors).toEqual({});
    });
  });

  describe('reset', () => {
    test('should restore form to initial state', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', 'Changed Name');
        result.current.setField('emailAddress', 'changed@example.com');
        result.current.setField('city', 'New York');
      });

      expect(result.current.form.name).toBe('Changed Name');

      act(() => {
        result.current.reset();
      });

      expect(result.current.form).toEqual(initialProfile);
    });

    test('should clear all errors', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', '');
        result.current.setField('emailAddress', '');
        result.current.validate();
      });

      expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);

      act(() => {
        result.current.reset();
      });

      expect(result.current.errors).toEqual({});
    });

    test('should set isUpdated to false', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', 'Changed Name');
      });

      expect(result.current.isUpdated).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isUpdated).toBe(false);
    });

    test('should be callable multiple times', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', 'Changed Name');
        result.current.reset();
        result.current.reset();
        result.current.reset();
      });

      expect(result.current.form).toEqual(initialProfile);
      expect(result.current.isUpdated).toBe(false);
    });
  });

  describe('isUpdated tracking', () => {
    test('should be false initially', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      expect(result.current.isUpdated).toBe(false);
    });

    test('should be true after changing a field', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', 'New Name');
      });

      expect(result.current.isUpdated).toBe(true);
    });

    test('should remain true after multiple changes', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', 'Name 1');
        result.current.setField('name', 'Name 2');
        result.current.setField('city', 'City 1');
      });

      expect(result.current.isUpdated).toBe(true);
    });

    test('should be false after reset', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', 'Changed Name');
        result.current.reset();
      });

      expect(result.current.isUpdated).toBe(false);
    });

test('should remain true after changing back to initial value due to dirty flag', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      // Initially false
      expect(result.current.isUpdated).toBe(false);

      // Change and then change back
      act(() => {
        result.current.setField('name', 'Different Name');
      });
      expect(result.current.isUpdated).toBe(true);

      act(() => {
        result.current.setField('name', initialProfile.name);
      });
      
      // Still true because dirty flag is set
      expect(result.current.isUpdated).toBe(true);
    });

    test('should detect deep changes in form', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('addressLine1', '456 New St');
      });

      expect(result.current.isUpdated).toBe(true);
    });
  });

  describe('Edge cases', () => {
    test('should handle null birthDate', () => {
      const profileWithNullBirthDate: UserProfile = {
        ...initialProfile,
        birthDate: null,
      };

      const { result } = renderHook(() => useProfileForm(profileWithNullBirthDate));

      expect(result.current.form.birthDate).toBeNull();

      act(() => {
        result.current.setField('birthDate', '2000-01-01');
      });

      expect(result.current.form.birthDate).toBe('2000-01-01');
    });

    test('should handle special characters in text fields', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('name', "O'Brien-Smith");
        result.current.setField('description', 'Test with <html> & "quotes"');
      });

      let isValid = false;
      act(() => {
        isValid = result.current.validate();
      });

      expect(isValid).toBe(true);
      expect(result.current.form.name).toBe("O'Brien-Smith");
      expect(result.current.form.description).toBe('Test with <html> & "quotes"');
    });

    test('should handle empty strings in optional fields', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('addressLine2', '');
        result.current.setField('description', '');
      });

      let isValid = false;
      act(() => {
        isValid = result.current.validate();
      });

      expect(isValid).toBe(true);
    });

    test('should handle profile with minimal required fields only', () => {
      const minimalProfile: UserProfile = {
        name: 'Min User',
        natalSex: '',
        emailAddress: 'min@example.com',
        mobilePhoneNumber: '',
        homePhoneNumber: '',
        workPhoneNumber: '',
        birthDate: null,
        educationGrade: '',
        employmentStatus: '',
        maritalStatus: '',
        description: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        countryCode: '',
        city: '',
        postalCode: '',
      };

      const { result } = renderHook(() => useProfileForm(minimalProfile));

      let isValid = false;
      act(() => {
        isValid = result.current.validate();
      });

      expect(isValid).toBe(true);
      expect(result.current.form).toEqual(minimalProfile);
    });

    test('should handle updating avatarURL', () => {
      const { result } = renderHook(() => useProfileForm(initialProfile));

      act(() => {
        result.current.setField('avatarURL', undefined);
      });

      expect(result.current.form.avatarURL).toBeUndefined();

      act(() => {
        result.current.setField('avatarURL', 'https://new-url.com/image.png');
      });

      expect(result.current.form.avatarURL).toBe('https://new-url.com/image.png');
    });
  });

  describe('Callback stability', () => {
    test('setField should maintain referential equality', () => {
      const { result, rerender } = renderHook(() => useProfileForm(initialProfile));

      const firstSetField = result.current.setField;

      act(() => {
        result.current.setField('name', 'Test');
      });

      rerender();

      expect(result.current.setField).toBe(firstSetField);
    });

    test('reset should update when initial changes', () => {
      const { result, rerender } = renderHook(
        ({ initial }) => useProfileForm(initial),
        { initialProps: { initial: initialProfile } },
      );

      const firstReset = result.current.reset;

      const newInitial = { ...initialProfile, name: 'New Initial Name' };
      rerender({ initial: newInitial });

      expect(result.current.reset).not.toBe(firstReset);
    });
  });
});
