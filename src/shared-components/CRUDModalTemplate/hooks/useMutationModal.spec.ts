import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMutationModal } from './useMutationModal';

interface InterfaceTestFormData {
  id: string;
  name: string;
  email: string;
}

interface InterfaceTestResult {
  success: boolean;
  message: string;
}

describe('useMutationModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const mockMutation = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );

      expect(result.current.isOpen).toBe(false);
      expect(result.current.formData).toBe(null);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Modal state operations', () => {
    it('should open modal and clear error', async () => {
      const mockMutation = vi.fn().mockRejectedValue(new Error('Test error'));
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );

      // Set an error first
      await act(async () => {
        await result.current.execute({
          id: '1',
          name: 'Test',
          email: 'test@example.com',
        });
      });

      expect(result.current.error).not.toBe(null);

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('should close modal', () => {
      const mockMutation = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
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

    it('should toggle modal state', () => {
      const mockMutation = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('openWithData function', () => {
    it('should set formData, open modal, and clear error', () => {
      const mockMutation = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
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
      expect(result.current.error).toBe(null);
    });
  });

  describe('reset function', () => {
    it('should reset all state to initial values', async () => {
      const mockMutation = vi.fn().mockRejectedValue(new Error('Test error'));
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      act(() => {
        result.current.openWithData(testData);
      });

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.error).not.toBe(null);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.formData).toBe(null);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('clearError function', () => {
    it('should clear error state', async () => {
      const mockMutation = vi.fn().mockRejectedValue(new Error('Test error'));
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );

      await act(async () => {
        await result.current.execute({
          id: '1',
          name: 'Test',
          email: 'test@example.com',
        });
      });

      expect(result.current.error).not.toBe(null);

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('execute function', () => {
    it('should execute mutation with formData and call onSuccess', async () => {
      const mockResult: InterfaceTestResult = {
        success: true,
        message: 'Success',
      };
      const mockMutation = vi.fn().mockResolvedValue(mockResult);
      const mockOnSuccess = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
          {
            onSuccess: mockOnSuccess,
          },
        ),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      act(() => {
        result.current.openWithData(testData);
      });

      let returnedResult: InterfaceTestResult | undefined;
      await act(async () => {
        returnedResult = await result.current.execute();
      });

      expect(mockMutation).toHaveBeenCalledWith(testData);
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResult);
      expect(returnedResult).toEqual(mockResult);
      expect(result.current.error).toBe(null);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should execute mutation with provided data parameter', async () => {
      const mockResult: InterfaceTestResult = {
        success: true,
        message: 'Success',
      };
      const mockMutation = vi.fn().mockResolvedValue(mockResult);
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      await act(async () => {
        await result.current.execute(testData);
      });

      expect(mockMutation).toHaveBeenCalledWith(testData);
    });

    it('should set isSubmitting during execution', async () => {
      const mockMutation = vi.fn().mockResolvedValue({
        success: true,
        message: 'Success',
      });
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      expect(result.current.isSubmitting).toBe(false);

      await act(async () => {
        await result.current.execute(testData);
      });

      expect(result.current.isSubmitting).toBe(false);
      expect(mockMutation).toHaveBeenCalledWith(testData);
    });

    it('should handle mutation errors and call onError', async () => {
      const mockError = new Error('Mutation failed');
      const mockMutation = vi.fn().mockRejectedValue(mockError);
      const mockOnError = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
          {
            onError: mockOnError,
          },
        ),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      let returnedResult: InterfaceTestResult | undefined;
      await act(async () => {
        returnedResult = await result.current.execute(testData);
      });

      expect(mockMutation).toHaveBeenCalledWith(testData);
      expect(mockOnError).toHaveBeenCalledWith(mockError);
      expect(result.current.error).toEqual(mockError);
      expect(returnedResult).toBe(undefined);
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should convert non-Error objects to Error instances', async () => {
      const mockMutation = vi.fn().mockRejectedValue('String error');
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );

      await act(async () => {
        await result.current.execute({
          id: '1',
          name: 'Test',
          email: 'test@example.com',
        });
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('String error');
    });

    it('should return undefined when formData is null and allowEmptyData is false', async () => {
      const mockMutation = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );

      let returnedResult: InterfaceTestResult | undefined;
      await act(async () => {
        returnedResult = await result.current.execute();
      });

      expect(mockMutation).not.toHaveBeenCalled();
      expect(returnedResult).toBe(undefined);
    });

    it('should allow execution with null data when allowEmptyData is true', async () => {
      const mockResult: InterfaceTestResult = {
        success: true,
        message: 'Success',
      };
      const mockMutation = vi.fn().mockResolvedValue(mockResult);
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
          {
            allowEmptyData: true,
          },
        ),
      );

      await act(async () => {
        await result.current.execute();
      });

      expect(mockMutation).toHaveBeenCalledWith(null);
    });

    it('should clear error before executing mutation', async () => {
      const mockMutation = vi
        .fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({ success: true, message: 'Success' });
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'Test',
        email: 'test@example.com',
      };

      // First execution fails
      await act(async () => {
        await result.current.execute(testData);
      });
      expect(result.current.error).not.toBe(null);

      // Second execution succeeds and should clear the error
      await act(async () => {
        await result.current.execute(testData);
      });
      expect(result.current.error).toBe(null);
    });
  });

  describe('Options callback updates', () => {
    it('should use updated onSuccess callback', async () => {
      const mockResult: InterfaceTestResult = {
        success: true,
        message: 'Success',
      };
      const mockMutation = vi.fn().mockResolvedValue(mockResult);
      const firstOnSuccess = vi.fn();
      const secondOnSuccess = vi.fn();

      const { result, rerender } = renderHook(
        ({ onSuccess }) =>
          useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
            mockMutation,
            {
              onSuccess,
            },
          ),
        {
          initialProps: { onSuccess: firstOnSuccess },
        },
      );

      // Execute with first callback
      await act(async () => {
        await result.current.execute({
          id: '1',
          name: 'Test',
          email: 'test@example.com',
        });
      });
      expect(firstOnSuccess).toHaveBeenCalledWith(mockResult);
      expect(secondOnSuccess).not.toHaveBeenCalled();

      // Update to second callback
      rerender({ onSuccess: secondOnSuccess });

      // Execute with second callback
      await act(async () => {
        await result.current.execute({
          id: '2',
          name: 'Test2',
          email: 'test2@example.com',
        });
      });
      expect(secondOnSuccess).toHaveBeenCalledWith(mockResult);
    });

    it('should use updated onError callback', async () => {
      const mockError = new Error('Test error');
      const mockMutation = vi.fn().mockRejectedValue(mockError);
      const firstOnError = vi.fn();
      const secondOnError = vi.fn();

      const { result, rerender } = renderHook(
        ({ onError }) =>
          useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
            mockMutation,
            { onError },
          ),
        {
          initialProps: { onError: firstOnError },
        },
      );

      // Execute with first callback
      await act(async () => {
        await result.current.execute({
          id: '1',
          name: 'Test',
          email: 'test@example.com',
        });
      });
      expect(firstOnError).toHaveBeenCalledWith(mockError);

      // Update to second callback
      rerender({ onError: secondOnError });

      // Execute with second callback
      await act(async () => {
        await result.current.execute({
          id: '2',
          name: 'Test2',
          email: 'test2@example.com',
        });
      });
      expect(secondOnError).toHaveBeenCalledWith(mockError);
    });

    it('should use updated allowEmptyData option', async () => {
      const mockResult: InterfaceTestResult = {
        success: true,
        message: 'Success',
      };
      const mockMutation = vi.fn().mockResolvedValue(mockResult);

      const { result, rerender } = renderHook(
        ({ allowEmptyData }) =>
          useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
            mockMutation,
            {
              allowEmptyData,
            },
          ),
        {
          initialProps: { allowEmptyData: false },
        },
      );

      // Execute with allowEmptyData false
      await act(async () => {
        await result.current.execute();
      });
      expect(mockMutation).not.toHaveBeenCalled();

      // Update to allowEmptyData true
      rerender({ allowEmptyData: true });

      // Execute with allowEmptyData true
      await act(async () => {
        await result.current.execute();
      });
      expect(mockMutation).toHaveBeenCalledWith(null);
    });
  });

  describe('Complete workflow scenarios', () => {
    it('should handle successful create workflow', async () => {
      const mockResult: InterfaceTestResult = {
        success: true,
        message: 'Created',
      };
      const mockMutation = vi.fn().mockResolvedValue(mockResult);
      const mockOnSuccess = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
          {
            onSuccess: mockOnSuccess,
          },
        ),
      );

      // Open modal
      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      // Submit form
      await act(async () => {
        await result.current.execute({
          id: '1',
          name: 'New Item',
          email: 'new@example.com',
        });
      });

      expect(mockOnSuccess).toHaveBeenCalled();

      // Reset after success
      act(() => {
        result.current.reset();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.formData).toBe(null);
    });

    it('should handle successful edit workflow', async () => {
      const mockResult: InterfaceTestResult = {
        success: true,
        message: 'Updated',
      };
      const mockMutation = vi.fn().mockResolvedValue(mockResult);
      const mockOnSuccess = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
          {
            onSuccess: mockOnSuccess,
          },
        ),
      );
      const editData: InterfaceTestFormData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      // Open modal with data
      act(() => {
        result.current.openWithData(editData);
      });

      // Submit
      await act(async () => {
        await result.current.execute();
      });

      expect(mockMutation).toHaveBeenCalledWith(editData);
      expect(mockOnSuccess).toHaveBeenCalled();

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should handle error and retry workflow', async () => {
      const mockError = new Error('Network error');
      const mockResult: InterfaceTestResult = {
        success: true,
        message: 'Success',
      };
      const mockMutation = vi
        .fn()
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce(mockResult);
      const mockOnError = vi.fn();
      const mockOnSuccess = vi.fn();
      const { result } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
          {
            onError: mockOnError,
            onSuccess: mockOnSuccess,
          },
        ),
      );
      const testData: InterfaceTestFormData = {
        id: '1',
        name: 'Test',
        email: 'test@example.com',
      };

      act(() => {
        result.current.openWithData(testData);
      });

      // First attempt fails
      await act(async () => {
        await result.current.execute();
      });

      expect(mockOnError).toHaveBeenCalledWith(mockError);
      expect(result.current.error).toEqual(mockError);
      expect(result.current.isOpen).toBe(true);

      // Clear error and retry
      act(() => {
        result.current.clearError();
      });

      await act(async () => {
        await result.current.execute();
      });

      expect(mockOnSuccess).toHaveBeenCalledWith(mockResult);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Multiple hook instances', () => {
    it('should keep multiple hook instances isolated', async () => {
      const mockMutation1 = vi
        .fn()
        .mockResolvedValue({ success: true, message: 'Success 1' });
      const mockMutation2 = vi
        .fn()
        .mockResolvedValue({ success: true, message: 'Success 2' });
      const hookA = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation1,
        ),
      );
      const hookB = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation2,
        ),
      );
      const dataA: InterfaceTestFormData = {
        id: '1',
        name: 'A',
        email: 'a@example.com',
      };
      const dataB: InterfaceTestFormData = {
        id: '2',
        name: 'B',
        email: 'b@example.com',
      };

      act(() => {
        hookA.result.current.openWithData(dataA);
        hookB.result.current.openWithData(dataB);
      });

      await act(async () => {
        await hookA.result.current.execute();
      });

      expect(mockMutation1).toHaveBeenCalledWith(dataA);
      expect(mockMutation2).not.toHaveBeenCalled();
      expect(hookA.result.current.error).toBe(null);
      expect(hookB.result.current.error).toBe(null);

      await act(async () => {
        await hookB.result.current.execute();
      });

      expect(mockMutation2).toHaveBeenCalledWith(dataB);
    });
  });

  describe('Function reference stability', () => {
    it('should maintain stable function references', () => {
      const mockMutation = vi.fn();
      const { result, rerender } = renderHook(() =>
        useMutationModal<InterfaceTestFormData, InterfaceTestResult>(
          mockMutation,
        ),
      );

      const initialFunctions = {
        open: result.current.open,
        close: result.current.close,
        toggle: result.current.toggle,
        openWithData: result.current.openWithData,
        reset: result.current.reset,
        clearError: result.current.clearError,
        execute: result.current.execute,
      };

      rerender();

      expect(result.current.open).toBe(initialFunctions.open);
      expect(result.current.close).toBe(initialFunctions.close);
      expect(result.current.toggle).toBe(initialFunctions.toggle);
      expect(result.current.openWithData).toBe(initialFunctions.openWithData);
      expect(result.current.reset).toBe(initialFunctions.reset);
      expect(result.current.clearError).toBe(initialFunctions.clearError);
      // execute depends on formData, so it might change
    });
  });
});
