import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventManager } from '../../managers/event-manager';

describe('EventManager', () => {
  let eventManager: EventManager;

  beforeEach(() => {
    eventManager = new EventManager();
  });

  afterEach(() => {
    // Clean up any remaining listeners
    eventManager.removeAllListeners();
  });

  describe('Constructor', () => {
    it('should create a new EventManager instance', () => {
      expect(eventManager).toBeInstanceOf(EventManager);
    });

    it('should initialize with empty event listeners', () => {
      expect(eventManager.getEvents()).toEqual([]);
    });
  });

  describe('on', () => {
    it('should register an event listener', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);

      expect(eventManager.getListenerCount('test-event')).toBe(1);
      expect(eventManager.getEvents()).toContain('test-event');
    });

    it('should register multiple listeners for the same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      eventManager.on('test-event', callback1);
      eventManager.on('test-event', callback2);
      eventManager.on('test-event', callback3);

      expect(eventManager.getListenerCount('test-event')).toBe(3);
    });

    it('should register listeners for different events', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      eventManager.on('event-1', callback1);
      eventManager.on('event-2', callback2);

      expect(eventManager.getListenerCount('event-1')).toBe(1);
      expect(eventManager.getListenerCount('event-2')).toBe(1);
      expect(eventManager.getEvents()).toContain('event-1');
      expect(eventManager.getEvents()).toContain('event-2');
    });

    it('should handle invalid event name', () => {
      const callback = vi.fn();
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      eventManager.on('', callback);
      eventManager.on(null as any, callback);
      eventManager.on(undefined as any, callback);

      expect(eventManager.getListenerCount('')).toBe(0);
      expect(consoleSpy).toHaveBeenCalledTimes(3);

      consoleSpy.mockRestore();
    });

    it('should handle invalid callback', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      eventManager.on('test-event', null as any);
      eventManager.on('test-event', undefined as any);
      eventManager.on('test-event', 'not-a-function' as any);

      expect(eventManager.getListenerCount('test-event')).toBe(0);
      expect(consoleSpy).toHaveBeenCalledTimes(3);

      consoleSpy.mockRestore();
    });
  });

  describe('off', () => {
    it('should remove an event listener', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);
      eventManager.off('test-event', callback);

      expect(eventManager.getListenerCount('test-event')).toBe(0);
      expect(eventManager.getEvents()).not.toContain('test-event');
    });

    it('should remove specific listener when multiple exist', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      eventManager.on('test-event', callback1);
      eventManager.on('test-event', callback2);
      eventManager.on('test-event', callback3);

      eventManager.off('test-event', callback2);

      expect(eventManager.getListenerCount('test-event')).toBe(2);
    });

    it('should handle removing non-existent listener', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      eventManager.on('test-event', callback1);
      eventManager.off('test-event', callback2);

      expect(eventManager.getListenerCount('test-event')).toBe(1);
    });

    it('should handle removing listener from non-existent event', () => {
      const callback = vi.fn();
      eventManager.off('non-existent-event', callback);

      expect(eventManager.getListenerCount('non-existent-event')).toBe(0);
    });

    it('should handle invalid event name', () => {
      const callback = vi.fn();
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      eventManager.off('', callback);
      eventManager.off(null as any, callback);
      eventManager.off(undefined as any, callback);

      expect(consoleSpy).toHaveBeenCalledTimes(3);

      consoleSpy.mockRestore();
    });

    it('should handle invalid callback', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      eventManager.off('test-event', null as any);
      eventManager.off('test-event', undefined as any);
      eventManager.off('test-event', 'not-a-function' as any);

      expect(consoleSpy).toHaveBeenCalledTimes(3);

      consoleSpy.mockRestore();
    });
  });

  describe('emit', () => {
    it('should emit event to registered listeners', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);

      eventManager.emit('test-event', 'arg1', 'arg2');

      expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should emit event to multiple listeners', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      eventManager.on('test-event', callback1);
      eventManager.on('test-event', callback2);
      eventManager.on('test-event', callback3);

      eventManager.emit('test-event', 'data');

      expect(callback1).toHaveBeenCalledWith('data');
      expect(callback2).toHaveBeenCalledWith('data');
      expect(callback3).toHaveBeenCalledWith('data');
    });

    it('should emit event with no arguments', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);

      eventManager.emit('test-event');

      expect(callback).toHaveBeenCalledWith();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle non-existent event', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);

      eventManager.emit('non-existent-event', 'data');

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle listener errors gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Listener error');
      });
      const normalCallback = vi.fn();

      eventManager.on('test-event', errorCallback);
      eventManager.on('test-event', normalCallback);

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      eventManager.emit('test-event', 'data');

      expect(errorCallback).toHaveBeenCalledWith('data');
      expect(normalCallback).toHaveBeenCalledWith('data');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in event listener for test-event:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should handle invalid event name', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      eventManager.emit('');
      eventManager.emit(null as any);
      eventManager.emit(undefined as any);

      expect(consoleSpy).toHaveBeenCalledTimes(3);

      consoleSpy.mockRestore();
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for a specific event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      eventManager.on('event-1', callback1);
      eventManager.on('event-1', callback2);
      eventManager.on('event-2', callback3);

      eventManager.removeAllListeners('event-1');

      expect(eventManager.getListenerCount('event-1')).toBe(0);
      expect(eventManager.getListenerCount('event-2')).toBe(1);
      expect(eventManager.getEvents()).not.toContain('event-1');
      expect(eventManager.getEvents()).toContain('event-2');
    });

    it('should remove all listeners when no event specified', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      eventManager.on('event-1', callback1);
      eventManager.on('event-2', callback2);
      eventManager.on('event-3', callback3);

      eventManager.removeAllListeners();

      expect(eventManager.getListenerCount('event-1')).toBe(0);
      expect(eventManager.getListenerCount('event-2')).toBe(0);
      expect(eventManager.getListenerCount('event-3')).toBe(0);
      expect(eventManager.getEvents()).toEqual([]);
    });

    it('should handle removing listeners from non-existent event', () => {
      eventManager.removeAllListeners('non-existent-event');
      expect(eventManager.getListenerCount('non-existent-event')).toBe(0);
    });
  });

  describe('getListenerCount', () => {
    it('should return correct listener count', () => {
      expect(eventManager.getListenerCount('test-event')).toBe(0);

      const callback1 = vi.fn();
      const callback2 = vi.fn();

      eventManager.on('test-event', callback1);
      expect(eventManager.getListenerCount('test-event')).toBe(1);

      eventManager.on('test-event', callback2);
      expect(eventManager.getListenerCount('test-event')).toBe(2);

      eventManager.off('test-event', callback1);
      expect(eventManager.getListenerCount('test-event')).toBe(1);
    });

    it('should return 0 for non-existent event', () => {
      expect(eventManager.getListenerCount('non-existent-event')).toBe(0);
    });
  });

  describe('getEvents', () => {
    it('should return all registered events', () => {
      expect(eventManager.getEvents()).toEqual([]);

      const callback = vi.fn();
      eventManager.on('event-1', callback);
      eventManager.on('event-2', callback);
      eventManager.on('event-3', callback);

      const events = eventManager.getEvents();
      expect(events).toContain('event-1');
      expect(events).toContain('event-2');
      expect(events).toContain('event-3');
      expect(events).toHaveLength(3);
    });

    it('should not return events with no listeners', () => {
      const callback = vi.fn();
      eventManager.on('event-1', callback);
      eventManager.on('event-2', callback);

      eventManager.off('event-1', callback);

      const events = eventManager.getEvents();
      expect(events).not.toContain('event-1');
      expect(events).toContain('event-2');
      expect(events).toHaveLength(1);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex event scenarios', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      // Register listeners
      eventManager.on('plugin:loaded', callback1);
      eventManager.on('plugin:loaded', callback2);
      eventManager.on('plugin:unloaded', callback3);

      // Emit events
      eventManager.emit('plugin:loaded', 'plugin-1');
      eventManager.emit('plugin:unloaded', 'plugin-2');

      // Verify calls
      expect(callback1).toHaveBeenCalledWith('plugin-1');
      expect(callback2).toHaveBeenCalledWith('plugin-1');
      expect(callback3).toHaveBeenCalledWith('plugin-2');

      // Remove one listener
      eventManager.off('plugin:loaded', callback1);

      // Emit again
      eventManager.emit('plugin:loaded', 'plugin-3');

      // Verify only remaining listener was called
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(2);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid event emission', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);

      for (let i = 0; i < 100; i++) {
        eventManager.emit('test-event', `data-${i}`);
      }

      expect(callback).toHaveBeenCalledTimes(100);
      for (let i = 0; i < 100; i++) {
        expect(callback).toHaveBeenNthCalledWith(i + 1, `data-${i}`);
      }
    });

    it('should handle listeners that add/remove other listeners', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      const dynamicCallback = vi.fn(() => {
        eventManager.on('dynamic-event', callback3);
        eventManager.off('dynamic-event', callback2);
      });

      eventManager.on('trigger-event', dynamicCallback);
      eventManager.on('dynamic-event', callback2);

      eventManager.emit('trigger-event');

      expect(dynamicCallback).toHaveBeenCalledTimes(1);
      expect(eventManager.getListenerCount('dynamic-event')).toBe(1);
    });
  });
});
