import Environment from 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';

/**
 * A custom environment to set the TextEncoder and TextDecoder variables, that is required by @pdfme during testing.
 * Providing a polyfill to the environment for the same
 */
export default class CustomTestEnvironment extends Environment {
  async setup(): Promise<void> {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder as any;
    }
  }
}
