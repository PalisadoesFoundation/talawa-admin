import Environment from 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';

/**
 * A custom environment to set the TextEncoder and TextDecoder variables,
 * required for pdfme during testing.
 * Providing a polyfill to the environment.
 */

export default class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
}
