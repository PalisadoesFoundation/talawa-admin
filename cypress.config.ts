import { defineConfig } from 'cypress';
import fs from 'node:fs';
import codeCoverageTask from '@cypress/code-coverage/task';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || '4321';

export default defineConfig({
  e2e: {
    baseUrl: `http://localhost:${PORT}`,

    // Viewport settings
    viewportWidth: 1920,
    viewportHeight: 1080,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',

    defaultCommandTimeout: 50000,
    requestTimeout: 50000,
    responseTimeout: 50000,
    pageLoadTimeout: 50000,

    testIsolation: false, // Keep state between tests in same spec
    experimentalRunAllSpecs: true,

    watchForFileChanges: true,
    chromeWebSecurity: false,
    retries: {
      runMode: 3,
      openMode: 0,
    },

    // Environment variables
    env: {
      apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:4000/graphql',
      RECAPTCHA_SITE_KEY: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      // Custom task to log messages and read files
      on('task', {
        log(message: string) {
          console.log(message);
          return null;
        },
        readFileMaybe(filename: string) {
          return fs.existsSync(filename)
            ? fs.readFileSync(filename, 'utf8')
            : null;
        },
      });

      // Browser launch options for both Chrome and Firefox
      on('before:browser:launch', (browser, launchOptions) => {
        // Chrome specific configurations
        if (browser.name === 'chrome') {
          if (browser.isHeadless) {
            launchOptions.args.push('--max_old_space_size=4096');
          }

          // Chrome performance optimizations
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
        }

        // Firefox specific configurations
        if (browser.name === 'firefox') {
          // Firefox preferences
          launchOptions.preferences = {
            ...launchOptions.preferences,
            'signon.rememberSignons': false,
            'browser.safebrowsing.enabled': false,
            'browser.safebrowsing.malware.enabled': false,
            'app.update.enabled': false,
            'browser.download.folderList': 2,
            'browser.download.manager.showWhenStarting': false,
            'browser.helperApps.neverAsk.saveToDisk':
              'application/pdf,text/csv,application/csv',
          };
          launchOptions.args = launchOptions.args || [];
        }

        return launchOptions;
      });

      // Custom plugins can be registered here
      // Example: require('@cypress/code-coverage/task')(on, config);

      return config;
    },
  },

  includeShadowDom: true,
  experimentalStudio: true,

  downloadsFolder: 'cypress/downloads',
  fixturesFolder: 'cypress/fixtures',
});
