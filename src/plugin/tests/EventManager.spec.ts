import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventManager } from '../managers/event-manager';

describe('EventManager', () => {
  let eventManager: EventManager;

  beforeEach(() => {
    vi.clearAllMocks();
    eventManager = new EventManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create a new EventManager instance', () => {
      expect(eventManager).toBeInstanceOf(EventManager);
    });

    it('should initialize with empty event listeners', () => {
      expect(eventManager).toBeDefined();
    });
  });

  describe('Event Registration', () => {
    it('should register event listener', () => {
      const callback = vi.fn();
      expect(() => eventManager.on('test-event', callback)).not.toThrow();
    });

    it('should register multiple listeners for same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      eventManager.on('test-event', callback1);
      eventManager.on('test-event', callback2);

      expect(() => eventManager.emit('test-event')).not.toThrow();
    });

    it('should register listeners for different events', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      eventManager.on('event-1', callback1);
      eventManager.on('event-2', callback2);

      expect(() => eventManager.emit('event-1')).not.toThrow();
      expect(() => eventManager.emit('event-2')).not.toThrow();
    });
  });

  describe('Event Emission', () => {
    it('should emit event and call registered listeners', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);

      eventManager.emit('test-event');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should emit event with data', () => {
      const callback = vi.fn();
      const testData = { message: 'test' };

      eventManager.on('test-event', callback);
      eventManager.emit('test-event', testData);

      expect(callback).toHaveBeenCalledWith(testData);
    });

    it('should emit event with multiple arguments', () => {
      const callback = vi.fn();
      const arg1 = 'first';
      const arg2 = 'second';
      const arg3 = { data: 'third' };

      eventManager.on('test-event', callback);
      eventManager.emit('test-event', arg1, arg2, arg3);

      expect(callback).toHaveBeenCalledWith(arg1, arg2, arg3);
    });

    it('should call multiple listeners for same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      eventManager.on('test-event', callback1);
      eventManager.on('test-event', callback2);
      eventManager.on('test-event', callback3);

      eventManager.emit('test-event');

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('should not call listeners for different events', () => {
      const callback = vi.fn();
      eventManager.on('event-1', callback);

      eventManager.emit('event-2');

      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle emission of non-existent event', () => {
      expect(() => eventManager.emit('non-existent-event')).not.toThrow();
    });
  });

  describe('Event Listener Removal', () => {
    it('should remove specific event listener', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);

      eventManager.off('test-event', callback);
      eventManager.emit('test-event');

      expect(callback).not.toHaveBeenCalled();
    });

    it('should remove only the specified listener', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      eventManager.on('test-event', callback1);
      eventManager.on('test-event', callback2);

      eventManager.off('test-event', callback1);
      eventManager.emit('test-event');

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle removal of non-existent listener', () => {
      const callback = vi.fn();
      expect(() => eventManager.off('test-event', callback)).not.toThrow();
    });

    it('should handle removal of listener for non-existent event', () => {
      const callback = vi.fn();
      expect(() =>
        eventManager.off('non-existent-event', callback),
      ).not.toThrow();
    });

    it('should handle removal of listener that was never registered', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      eventManager.on('test-event', callback1);
      eventManager.off('test-event', callback2);
      eventManager.emit('test-event');

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  describe('Event Listener Management', () => {
    it('should handle multiple registrations of same listener', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);
      eventManager.on('test-event', callback);

      eventManager.emit('test-event');

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should handle removal of one instance of multiple registrations', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);
      eventManager.on('test-event', callback);

      eventManager.off('test-event', callback);
      eventManager.emit('test-event');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle removal of all instances of a listener', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);
      eventManager.on('test-event', callback);

      eventManager.off('test-event', callback);
      eventManager.off('test-event', callback);
      eventManager.emit('test-event');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle listener that throws error', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Listener error');
      });
      const normalCallback = vi.fn();

      eventManager.on('test-event', errorCallback);
      eventManager.on('test-event', normalCallback);

      expect(() => eventManager.emit('test-event')).not.toThrow();
      expect(normalCallback).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple listeners with errors', () => {
      const errorCallback1 = vi.fn(() => {
        throw new Error('Error 1');
      });
      const errorCallback2 = vi.fn(() => {
        throw new Error('Error 2');
      });
      const normalCallback = vi.fn();

      eventManager.on('test-event', errorCallback1);
      eventManager.on('test-event', normalCallback);
      eventManager.on('test-event', errorCallback2);

      expect(() => eventManager.emit('test-event')).not.toThrow();
      expect(normalCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Data Handling', () => {
    it('should handle undefined event data', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);

      eventManager.emit('test-event', undefined);

      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it('should handle null event data', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);

      eventManager.emit('test-event', null);

      expect(callback).toHaveBeenCalledWith(null);
    });

    it('should handle complex event data', () => {
      const callback = vi.fn();
      const complexData = {
        user: { id: 1, name: 'Test' },
        settings: { theme: 'dark', language: 'en' },
        timestamp: new Date(),
      };

      eventManager.on('test-event', callback);
      eventManager.emit('test-event', complexData);

      expect(callback).toHaveBeenCalledWith(complexData);
    });

    it('should handle array event data', () => {
      const callback = vi.fn();
      const arrayData = [1, 2, 3, 'test', { key: 'value' }];

      eventManager.on('test-event', callback);
      eventManager.emit('test-event', arrayData);

      expect(callback).toHaveBeenCalledWith(arrayData);
    });
  });

  describe('Memory Management', () => {
    it('should not leak memory when listeners are removed', () => {
      const callback = vi.fn();
      eventManager.on('test-event', callback);
      eventManager.off('test-event', callback);

      // The event manager should not retain references to removed listeners
      eventManager.emit('test-event');
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle large number of events', () => {
      const callbacks = Array.from({ length: 100 }, () => vi.fn());

      callbacks.forEach((callback, index) => {
        eventManager.on(`event-${index}`, callback);
      });

      callbacks.forEach((callback, index) => {
        eventManager.emit(`event-${index}`);
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle large number of listeners for same event', () => {
      const callbacks = Array.from({ length: 50 }, () => vi.fn());

      callbacks.forEach((callback) => {
        eventManager.on('test-event', callback);
      });

      eventManager.emit('test-event');

      callbacks.forEach((callback) => {
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });
  });
});
