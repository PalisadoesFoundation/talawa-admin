import { defineConfig } from 'cypress';
import fs from 'fs';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4321',

    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',

    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,

    watchForFileChanges: true,
    chromeWebSecurity: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Environment variables
    env: {
      // apiUrl: "http://localhost:8000/api",
    },
    setupNodeEvents(on, config) {
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
