/**
 * Application version
 * This is injected at build time from package.json
 */
export const APP_VERSION = __APP_VERSION__

/**
 * Get the application version
 */
export function getVersion(): string {
  return APP_VERSION
}

