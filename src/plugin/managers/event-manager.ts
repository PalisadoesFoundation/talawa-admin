/**
 * Event Manager
 * Handles event listeners and event emission for the plugin system
 */

export class EventManager {
  private eventListeners: Map<string, Array<(...args: unknown[]) => void>> =
    new Map();

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!event || typeof callback !== 'function') {
      console.error('Invalid event name or callback provided');
      return;
    }

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.push(callback);
    } else {
      this.eventListeners.set(event, [callback]);
    }
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    if (!event || typeof callback !== 'function') {
      console.error('Invalid event name or callback provided');
      return;
    }

    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      if (listeners.length === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  emit(event: string, ...args: unknown[]): void {
    if (!event) {
      console.error('Invalid event name provided for emission');
      return;
    }

    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.eventListeners.delete(event);
    } else {
      this.eventListeners.clear();
    }
  }

  getListenerCount(event: string): number {
    const listeners = this.eventListeners.get(event);
    return listeners ? listeners.length : 0;
  }

  getEvents(): string[] {
    return Array.from(this.eventListeners.keys());
  }
}
