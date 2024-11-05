// @ts-check
const { defineConfig, devices } = require('@playwright/test')

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  timeout: 30000,
  expect: {
    timeout: 10000,
  },

  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on',
    retries: 2,

    launchOptions: {
      args: [
        '--disable-web-security', // Wyłącza zabezpieczenia sieciowe
      ],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     browserName: 'firefox',
    //     userAgent:
    //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0', // Ustaw niestandardowy user-agent
    //     firefoxUserPrefs: {
    //       'network.http.speculative-parallel-limit': 0, // Ogranicz równoczesne zapytania HTTP
    //       'dom.disable_open_during_load': false, // Zezwól na otwieranie okienek podczas ładowania
    //       'network.http.connection-retry-timeout': 15, // Czas na ponowienie połączenia w sekundach
    //       'browser.cache.disk.enable': false, // Wyłącz cache na dysku
    //       'browser.cache.memory.enable': false, // Wyłącz cache w pamięci
    //     },
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
