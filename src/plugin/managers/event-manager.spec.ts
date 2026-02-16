import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventManager } from './event-manager';

describe('EventManager Coverage Suite', () => {
  let manager: EventManager;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    manager = new EventManager();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ----------------------------------------------------------------
  // 1. on() Method Coverage
  // ----------------------------------------------------------------
  describe('on()', () => {
    it('registers a new listener for a new event', () => {
      const callback = vi.fn();

      manager.on('test:event', callback);

      expect(manager.getListenerCount('test:event')).toBe(1);
      expect(manager.getEvents()).toContain('test:event');
    });

    it('adds multiple listeners to the same event', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      manager.on('multi:event', cb1);
      manager.on('multi:event', cb2);

      expect(manager.getListenerCount('multi:event')).toBe(2);
    });

    it('creates event entry when registering a new event', () => {
      const cb = vi.fn();

      manager.on('broken:event', cb);

      expect(manager.getEvents()).toContain('broken:event');
      expect(manager.getListenerCount('broken:event')).toBe(1);
    });

    it('logs error when event name is invalid', () => {
      manager.on('', vi.fn());

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Invalid event name or callback provided',
      );
    });

    it('logs error when callback is invalid', () => {
      manager.on('invalid:event', null as unknown as () => void);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Invalid event name or callback provided',
      );
    });
  });

  // ----------------------------------------------------------------
  // 2. off() Method Coverage
  // ----------------------------------------------------------------
  describe('off()', () => {
    it('removes a specific listener', () => {
      const cb = vi.fn();

      manager.on('remove:event', cb);
      manager.off('remove:event', cb);

      expect(manager.getListenerCount('remove:event')).toBe(0);
      expect(manager.getEvents()).not.toContain('remove:event');
    });

    it('does nothing if callback is not found', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      manager.on('event', cb1);
      manager.off('event', cb2);

      expect(manager.getListenerCount('event')).toBe(1);
    });

    it('logs error when invalid input provided', () => {
      manager.off('', vi.fn());

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Invalid event name or callback provided',
      );
    });

    it('does nothing if event does not exist', () => {
      manager.off('nonexistent', vi.fn());

      expect(manager.getListenerCount('nonexistent')).toBe(0);
    });
  });

  // ----------------------------------------------------------------
  // 3. emit() Method Coverage
  // ----------------------------------------------------------------
  describe('emit()', () => {
    it('calls all registered listeners with arguments', () => {
      const cb = vi.fn();

      manager.on('emit:event', cb);
      manager.emit('emit:event', 1, 2, 3);

      expect(cb).toHaveBeenCalledWith(1, 2, 3);
    });

    it('handles multiple listeners correctly', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      manager.on('multi:emit', cb1);
      manager.on('multi:emit', cb2);

      manager.emit('multi:emit', 'data');

      expect(cb1).toHaveBeenCalledWith('data');
      expect(cb2).toHaveBeenCalledWith('data');
    });

    it('continues execution if a listener throws', () => {
      const failingCallback = vi.fn(() => {
        throw new Error('Listener failure');
      });
      const safeCallback = vi.fn();

      manager.on('error:event', failingCallback);
      manager.on('error:event', safeCallback);

      manager.emit('error:event', 'payload');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error in event listener for error:event:'),
        expect.any(Error),
      );
      expect(safeCallback).toHaveBeenCalledWith('payload');
    });

    it('logs error when emitting with invalid event name', () => {
      manager.emit('');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Invalid event name provided for emission',
      );
    });

    it('does nothing when emitting non-existent event', () => {
      expect(() => manager.emit('ghost:event')).not.toThrow();
    });
  });

  // ----------------------------------------------------------------
  // 4. removeAllListeners()
  // ----------------------------------------------------------------
  describe('removeAllListeners()', () => {
    it('removes all listeners for a specific event', () => {
      const cb = vi.fn();

      manager.on('specific:event', cb);
      manager.removeAllListeners('specific:event');

      expect(manager.getListenerCount('specific:event')).toBe(0);
    });

    it('removes all listeners globally when no event specified', () => {
      manager.on('event1', vi.fn());
      manager.on('event2', vi.fn());

      manager.removeAllListeners();

      expect(manager.getListenerCount('event1')).toBe(0);
      expect(manager.getListenerCount('event2')).toBe(0);
      expect(manager.getEvents()).toHaveLength(0);
    });
  });

  // ----------------------------------------------------------------
  // 5. getListenerCount()
  // ----------------------------------------------------------------
  describe('getListenerCount()', () => {
    it('returns correct number of listeners', () => {
      const cb = vi.fn();

      manager.on('count:event', cb);
      manager.on('count:event', vi.fn());

      expect(manager.getListenerCount('count:event')).toBe(2);
    });

    it('returns 0 for unknown event', () => {
      expect(manager.getListenerCount('unknown')).toBe(0);
    });
  });

  // ----------------------------------------------------------------
  // 6. getEvents()
  // ----------------------------------------------------------------
  describe('getEvents()', () => {
    it('returns all registered event names', () => {
      manager.on('eventA', vi.fn());
      manager.on('eventB', vi.fn());

      const events = manager.getEvents();

      expect(events).toContain('eventA');
      expect(events).toContain('eventB');
      expect(events).toHaveLength(2);
    });

    it('returns empty array when no events registered', () => {
      expect(manager.getEvents()).toEqual([]);
    });
  });
});
