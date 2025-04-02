/**
 * Browser Polyfills for Contentful Integration
 *
 * This file provides Node.js environment compatibility for browser execution.
 * These polyfills allow libraries originally built for Node.js to work in browser contexts.
 *
 * Contentful's JavaScript SDK and related dependencies were originally designed for
 * Node.js environments and expect certain Node.js globals to be available.
 * Without these polyfills, the Contentful client would throw reference errors
 * when used in browser-based applications.
 */

// Polyfill for Node.js 'global' object
// Contentful SDK may reference the global object which exists in Node.js but not browsers
(window as any).global = window;

// Polyfill for Node.js 'process' object
// Contentful SDK and its dependencies check process.env to determine environment
// and may use process.nextTick for async operations
(window as any).process = {
  env: {
    NODE_ENV: "production",
    CONTENTFUL_SPACE_ID: "zm7rtuyvkdw4",
    CONTENTFUL_ACCESS_TOKEN: "lG_hunxKompS9qkl0dskL-W1zo7QURER4p3ta3FetDU",
    CONTENTFUL_HOME_PAGE_ID: "2cayfg7wVF5WezADCHgSgL",
  },
  version: "",
  // Simplified implementation of process.nextTick using setTimeout
  // Used by Contentful SDK for scheduling microtasks in a Node.js-compatible way
  nextTick: (fn: Function) => {
    setTimeout(fn, 0);
  },
};

// Minimal polyfill for Node.js Buffer API
// Contentful SDK may include modules that check for Buffer existence
// or attempt to use Buffer methods for handling binary data and encodings
(window as any).Buffer = {
  isBuffer: () => false,
};
