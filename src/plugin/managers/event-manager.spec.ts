import { describe, it, expect, vi, afterEach } from 'vitest';
import { EventManager } from './event-manager';

describe('EventManager', () => {
  let manager: EventManager;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('on()', () => {
    it('registers a listener for a new event', () => {
      manager = new EventManager();
      const cb = vi.fn();

      manager.on('test', cb);

      expect(manager.getListenerCount('test')).toBe(1);
    });

    it('registers multiple listeners for the same event', () => {
      manager = new EventManager();
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      manager.on('test', cb1);
      manager.on('test', cb2);

      expect(manager.getListenerCount('test')).toBe(2);
    });

    it('logs error for invalid event or callback', () => {
      manager = new EventManager();
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      manager.on('', vi.fn());
      manager.on('test', null as unknown as () => void);

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('covers defensive else branch when listeners map is corrupted', () => {
      manager = new EventManager();
      const cb = vi.fn();

      // Intentionally corrupt internal state to hit defensive branch
      const internalManager = manager as unknown as {
        eventListeners: Map<
          string,
          Array<(...args: unknown[]) => void> | undefined
        >;
      };

      internalManager.eventListeners.set('corrupt', undefined);

      manager.on('corrupt', cb);

      const listeners = internalManager.eventListeners.get('corrupt');

      expect(listeners).toEqual([cb]);
    });
  });

  describe('off()', () => {
    it('removes a registered listener', () => {
      manager = new EventManager();
      const cb = vi.fn();

      manager.on('test', cb);
      manager.off('test', cb);

      expect(manager.getListenerCount('test')).toBe(0);
      expect(manager.getEvents()).toEqual([]);
    });

    it('does nothing if listener does not exist', () => {
      manager = new EventManager();
      const cb = vi.fn();

      manager.on('test', cb);
      manager.off('test', vi.fn());

      expect(manager.getListenerCount('test')).toBe(1);
    });

    it('logs error for invalid event or callback', () => {
      manager = new EventManager();
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      manager.off('', vi.fn());
      manager.off('test', null as unknown as () => void);

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('emit()', () => {
    it('calls listeners with provided arguments', () => {
      manager = new EventManager();
      const cb = vi.fn();

      manager.on('test', cb);
      manager.emit('test', 1, 'a');

      expect(cb).toHaveBeenCalledWith(1, 'a');
    });

    it('logs error when listener throws', () => {
      manager = new EventManager();
      const errorCb = vi.fn(() => {
        throw new Error('boom');
      });

      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      manager.on('test', errorCb);
      manager.emit('test');

      expect(spy).toHaveBeenCalled();
    });

    it('logs error for invalid event name', () => {
      manager = new EventManager();
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      manager.emit('');

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('removeAllListeners()', () => {
    it('removes listeners for a specific event', () => {
      manager = new EventManager();
      manager.on('a', vi.fn());
      manager.on('b', vi.fn());

      manager.removeAllListeners('a');

      expect(manager.getEvents()).toEqual(['b']);
    });

    it('removes all listeners when no event is provided', () => {
      manager = new EventManager();
      manager.on('a', vi.fn());
      manager.on('b', vi.fn());

      manager.removeAllListeners();

      expect(manager.getEvents()).toEqual([]);
    });
  });

  describe('getListenerCount()', () => {
    it('returns 0 for unknown event', () => {
      manager = new EventManager();

      expect(manager.getListenerCount('missing')).toBe(0);
    });
  });

  describe('getEvents()', () => {
    it('returns all registered event names', () => {
      manager = new EventManager();
      manager.on('a', vi.fn());
      manager.on('b', vi.fn());

      expect(manager.getEvents().sort()).toEqual(['a', 'b']);
    });
  });
});
