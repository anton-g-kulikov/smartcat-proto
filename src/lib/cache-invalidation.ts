import { getVersion } from './version'

/**
 * Get the version from the HTML meta tag
 */
function getVersionFromMeta(): string | null {
  const metaTag = document.querySelector('meta[name="app-version"]')
  return metaTag ? metaTag.getAttribute('content') : null
}

/**
 * Get the stored version from localStorage
 */
function getStoredVersion(): string | null {
  return localStorage.getItem('app-version')
}

/**
 * Store the current version in localStorage
 */
function storeVersion(version: string): void {
  localStorage.setItem('app-version', version)
}

/**
 * Check if the app version has changed and force a hard reload if needed
 * This ensures cache invalidation when version is bumped
 */
export function checkVersionAndInvalidateCache(): void {
  const currentVersion = getVersion()
  const metaVersion = getVersionFromMeta()
  const storedVersion = getStoredVersion()

  // Use meta tag version as source of truth (it's injected at build time)
  const htmlVersion = metaVersion || currentVersion

  // If no stored version, this is first load - store and continue
  if (!storedVersion) {
    storeVersion(htmlVersion)
    return
  }

  // If versions don't match, force a hard reload to clear cache
  if (storedVersion !== htmlVersion) {
    console.log(
      `Version changed from ${storedVersion} to ${htmlVersion}. Clearing cache and reloading...`
    )
    
    // Clear all localStorage except auth tokens (if any)
    // You might want to preserve certain keys
    const keysToPreserve = ['auth-token', 'refresh-token'] // Adjust as needed
    const preserved: Record<string, string> = {}
    
    keysToPreserve.forEach((key) => {
      const value = localStorage.getItem(key)
      if (value) {
        preserved[key] = value
      }
    })
    
    // Clear all localStorage
    localStorage.clear()
    
    // Restore preserved keys
    Object.entries(preserved).forEach(([key, value]) => {
      localStorage.setItem(key, value)
    })
    
    // Store new version
    storeVersion(htmlVersion)
    
    // Force a hard reload to clear all caches
    window.location.reload()
  }
}



