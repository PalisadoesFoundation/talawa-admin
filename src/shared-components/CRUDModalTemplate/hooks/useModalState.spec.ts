import { renderHook, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useModalState } from './useModalState';

describe('useModalState', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with isOpen as false by default', () => {
      const { result } = renderHook(() => useModalState());
      expect(result.current.isOpen).toBe(false);
    });

    it('should initialize with isOpen as true when initialState is true', () => {
      const { result } = renderHook(() => useModalState(true));
      expect(result.current.isOpen).toBe(true);
    });

    it('should initialize with isOpen as false when initialState is explicitly false', () => {
      const { result } = renderHook(() => useModalState(false));
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('open function', () => {
    it('should set isOpen to true when open is called', () => {
      const { result } = renderHook(() => useModalState());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should keep isOpen as true when open is called multiple times', () => {
      const { result } = renderHook(() => useModalState());

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(() => useModalState());
      const initialOpen = result.current.open;

      rerender();

      expect(result.current.open).toBe(initialOpen);
    });
  });

  describe('close function', () => {
    it('should set isOpen to false when close is called', () => {
      const { result } = renderHook(() => useModalState(true));

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should keep isOpen as false when close is called multiple times', () => {
      const { result } = renderHook(() => useModalState());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(() => useModalState());
      const initialClose = result.current.close;

      rerender();

      expect(result.current.close).toBe(initialClose);
    });
  });

  describe('toggle function', () => {
    it('should toggle isOpen from false to true', () => {
      const { result } = renderHook(() => useModalState());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should toggle isOpen from true to false', () => {
      const { result } = renderHook(() => useModalState(true));

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should toggle isOpen multiple times correctly', () => {
      const { result } = renderHook(() => useModalState());

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(() => useModalState());
      const initialToggle = result.current.toggle;

      rerender();

      expect(result.current.toggle).toBe(initialToggle);
    });
  });

  describe('Combined operations', () => {
    it('should handle open then close sequence', () => {
      const { result } = renderHook(() => useModalState());

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });

    it('should handle close then open sequence', () => {
      const { result } = renderHook(() => useModalState(true));

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });

    it('should handle toggle then open sequence', () => {
      const { result } = renderHook(() => useModalState());

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('Multiple hook instances', () => {
    it('should keep multiple hook instances isolated', () => {
      const hookA = renderHook(() => useModalState());
      const hookB = renderHook(() => useModalState(true));

      expect(hookA.result.current.isOpen).toBe(false);
      expect(hookB.result.current.isOpen).toBe(true);

      act(() => {
        hookA.result.current.open();
      });

      expect(hookA.result.current.isOpen).toBe(true);
      expect(hookB.result.current.isOpen).toBe(true);

      act(() => {
        hookB.result.current.close();
      });

      expect(hookA.result.current.isOpen).toBe(true);
      expect(hookB.result.current.isOpen).toBe(false);
    });

    it('should handle independent toggle operations', () => {
      const hookA = renderHook(() => useModalState());
      const hookB = renderHook(() => useModalState());

      act(() => {
        hookA.result.current.toggle();
      });

      expect(hookA.result.current.isOpen).toBe(true);
      expect(hookB.result.current.isOpen).toBe(false);
    });
  });
});
