/**
 * Typed mock utilities for Vitest 4.0 compatibility.
 *
 * Vitest 4.0 changed `vi.fn()` to return `Mock<Procedure | Constructable>` instead of
 * a simple function type. This causes TypeScript errors when mocks are passed to
 * component props expecting specific function signatures.
 *
 * These utilities provide type-safe mock creation that works with both Vitest and TypeScript.
 *
 * @example
 * ```tsx
 * // Instead of:
 * const mockHandler = vi.fn(); // Type: Mock<Procedure | Constructable>
 *
 * // Use:
 * const mockHandler = mockFn<() => void>(); // Type: () => void
 * ```
 */
import { vi, type Mock } from 'vitest';

/**
 * Creates a typed mock function compatible with Vitest 4.0.
 *
 * @template T - The function signature type
 * @returns A mock function that satisfies the type T while preserving mock capabilities
 *
 * @example
 * ```tsx
 * const onClose = mockFn<() => void>();
 * const onSubmit = mockFn<(data: FormData) => Promise<void>>();
 * const onChange = mockFn<(e: React.ChangeEvent<HTMLInputElement>) => void>();
 * ```
 */
export function mockFn<T extends (...args: never[]) => unknown>(): Mock<T> &
    T {
    return vi.fn() as Mock<T> & T;
}

/**
 * Type alias for creating properly typed mock functions inline in JSX.
 * Use with `as` assertion for inline prop values.
 *
 * @example
 * ```tsx
 * <Component onToggle={vi.fn() as MockedFn<(role: string) => void>} />
 * ```
 */
export type MockedFn<T extends (...args: never[]) => unknown> = Mock<T> & T;
