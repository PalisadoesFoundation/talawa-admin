import { act } from '@testing-library/react';

// Helper to wait for async operations with fake timers
// Using shouldAdvanceTime: true makes this compatible with userEvent
export async function waitForAsync(ms = 100): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}
