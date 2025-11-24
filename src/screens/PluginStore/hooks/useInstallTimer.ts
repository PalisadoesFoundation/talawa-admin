import { useEffect, useState } from 'react';

/**
 * useInstallTimer
 * Tracks and formats elapsed time as mm:ss while `loading` is true.
 * Resets to "00:00" when `loading` is false.
 */
export function useInstallTimer(loading: boolean): string {
  const [installingStartedAt, setInstallingStartedAt] = useState<number | null>(
    null,
  );
  const [installElapsed, setInstallElapsed] = useState<string>('00:00');

  useEffect(() => {
    if (!loading) {
      setInstallingStartedAt(null);
      setInstallElapsed('00:00');
      return;
    }

    if (installingStartedAt === null) {
      setInstallingStartedAt(Date.now());
    }

    if (installingStartedAt === null) return;

    const id = setInterval(() => {
      const ms = Date.now() - (installingStartedAt || Date.now());
      const totalSeconds = Math.floor(ms / 1000);
      const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      const ss = String(totalSeconds % 60).padStart(2, '0');
      setInstallElapsed(`${mm}:${ss}`);
    }, 500);

    return () => clearInterval(id);
  }, [loading, installingStartedAt]);

  return installElapsed;
}

export default useInstallTimer;
