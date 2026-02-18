/**
 * Logger utility for installation script
 * Provides colored output and progress indicators
 */

export function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

export function logError(message: string): void {
  console.error(`❌ ${message}`);
}

export function logWarning(message: string): void {
  console.warn(`⚠️  ${message}`);
}

export function logInfo(message: string): void {
  console.log(`ℹ️  ${message}`);
}

export function logStep(message: string): void {
  console.log(`\n📦 ${message}`);
}

export interface ISpinner {
  start(): void;
  succeed(message?: string): void;
  fail(message?: string): void;
  stop(): void;
}

/**
 * Simple spinner implementation using console
 * Can be replaced with ora library later
 */
export function createSpinner(message: string): ISpinner {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let frameIndex = 0;
  let interval: NodeJS.Timeout | null = null;
  let currentMessage = message;

  const start = (): void => {
    process.stdout.write(`${frames[frameIndex]} ${currentMessage}`);
    interval = setInterval(() => {
      process.stdout.write('\r');
      frameIndex = (frameIndex + 1) % frames.length;
      process.stdout.write(`${frames[frameIndex]} ${currentMessage}`);
    }, 100);
  };

  const succeed = (message?: string): void => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    process.stdout.write('\r');
    console.log(`✅ ${message || currentMessage}`);
  };

  const fail = (message?: string): void => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    process.stdout.write('\r');
    console.error(`❌ ${message || currentMessage}`);
  };

  const stop = (): void => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    process.stdout.write('\r');
  };

  return {
    start,
    succeed,
    fail,
    stop,
  };
}
