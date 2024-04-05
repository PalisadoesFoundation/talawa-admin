import Environment from 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';

/**
 * A custom environment to set the TextEncoder and TextDecoder variables, that is required by @pdfme during testing.
 * Providing a polyfill to the environment for the same
 */
export default class CustomTestEnvironment extends Environment {
<<<<<<< HEAD
=======
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
}
