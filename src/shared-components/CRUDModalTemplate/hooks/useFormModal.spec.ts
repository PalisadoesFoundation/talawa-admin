import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useFormModal } from './useFormModal';

interface InterfaceTestFormData {
  id: string;
  name: string;
  email: string;
}

describe('useFormModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      expect(result.current.isOpen).toBe(false);
      expect(result.current.formData).toBe(null);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should initialize with custom initial data', () => {
      const initialData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(initialData),
      );

      expect(result.current.isOpen).toBe(false);
      expect(result.current.formData).toEqual(initialData);
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('open function', () => {
    it('should set isOpen to true when open is called', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should not affect formData when open is called', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      act(() => {
        result.current.open();
      });

      expect(result.current.formData).toBe(null);
    });

    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const initialOpen = result.current.open;

      rerender();

      expect(result.current.open).toBe(initialOpen);
    });
  });

  describe('close function', () => {
    it('should set isOpen to false when close is called', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should not affect formData when close is called', () => {
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      act(() => {
        result.current.openWithData(testData);
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.formData).toEqual(testData);
    });

    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const initialClose = result.current.close;

      rerender();

      expect(result.current.close).toBe(initialClose);
    });
  });

  describe('toggle function', () => {
    it('should toggle isOpen from false to true', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should toggle isOpen from true to false', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const initialToggle = result.current.toggle;

      rerender();

      expect(result.current.toggle).toBe(initialToggle);
    });
  });

  describe('openWithData function', () => {
    it('should set formData and open the modal', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      act(() => {
        result.current.openWithData(testData);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.formData).toEqual(testData);
    });

    it('should update formData when called with different data', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const firstData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };
      const secondData: InterfaceTestFormData = {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      act(() => {
        result.current.openWithData(firstData);
      });
      expect(result.current.formData).toEqual(firstData);

      act(() => {
        result.current.openWithData(secondData);
      });
      expect(result.current.formData).toEqual(secondData);
    });

    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const initialOpenWithData = result.current.openWithData;

      rerender();

      expect(result.current.openWithData).toBe(initialOpenWithData);
    });
  });

  describe('reset function', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      act(() => {
        result.current.openWithData(testData);
        result.current.setIsSubmitting(true);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.formData).toEqual(testData);
      expect(result.current.isSubmitting).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.formData).toBe(null);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should reset formData to initialData when provided', () => {
      const initialData: InterfaceTestFormData = {
        id: '0',
        name: 'Initial',
        email: 'initial@example.com',
      };
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(initialData),
      );
      const newData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      act(() => {
        result.current.openWithData(newData);
      });
      expect(result.current.formData).toEqual(newData);

      act(() => {
        result.current.reset();
      });

      expect(result.current.formData).toEqual(initialData);
    });

    it('should reset isSubmitting to false', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      act(() => {
        result.current.setIsSubmitting(true);
      });
      expect(result.current.isSubmitting).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('isSubmitting state', () => {
    it('should update isSubmitting when setIsSubmitting is called', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      expect(result.current.isSubmitting).toBe(false);

      act(() => {
        result.current.setIsSubmitting(true);
      });

      expect(result.current.isSubmitting).toBe(true);

      act(() => {
        result.current.setIsSubmitting(false);
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('Combined operations', () => {
    it('should handle typical edit modal workflow', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Open modal with data
      act(() => {
        result.current.openWithData(testData);
      });
      expect(result.current.isOpen).toBe(true);
      expect(result.current.formData).toEqual(testData);

      // Simulate form submission
      act(() => {
        result.current.setIsSubmitting(true);
      });
      expect(result.current.isSubmitting).toBe(true);

      // Simulate submission complete and close
      act(() => {
        result.current.setIsSubmitting(false);
        result.current.reset();
      });
      expect(result.current.isOpen).toBe(false);
      expect(result.current.formData).toBe(null);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should handle cancel workflow', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      act(() => {
        result.current.openWithData(testData);
      });

      // User cancels without submitting
      act(() => {
        result.current.reset();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.formData).toBe(null);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should handle opening empty modal then closing', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
      expect(result.current.formData).toBe(null);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Multiple hook instances', () => {
    it('should keep multiple hook instances isolated', () => {
      const hookA = renderHook(() => useFormModal<InterfaceTestFormData>());
      const hookB = renderHook(() => useFormModal<InterfaceTestFormData>());
      const dataA: InterfaceTestFormData = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
      };
      const dataB: InterfaceTestFormData = {
        id: '2',
        name: 'Jane',
        email: 'jane@example.com',
      };

      act(() => {
        hookA.result.current.openWithData(dataA);
        hookB.result.current.openWithData(dataB);
      });

      expect(hookA.result.current.formData).toEqual(dataA);
      expect(hookB.result.current.formData).toEqual(dataB);

      act(() => {
        hookA.result.current.reset();
      });

      expect(hookA.result.current.isOpen).toBe(false);
      expect(hookB.result.current.isOpen).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle null formData correctly', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(null),
      );

      expect(result.current.formData).toBe(null);

      act(() => {
        result.current.reset();
      });

      expect(result.current.formData).toBe(null);
    });

    it('should handle undefined formData correctly', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );

      expect(result.current.formData).toBe(null);
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() =>
        useFormModal<InterfaceTestFormData>(),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      act(() => {
        result.current.openWithData(testData);
        result.current.close();
        result.current.open();
        result.current.setIsSubmitting(true);
        result.current.reset();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.formData).toBe(null);
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
