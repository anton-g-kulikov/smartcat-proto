import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Read version from package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const version = packageJson.version

/**
 * Vite plugin to inject version into HTML and add version query parameters to asset URLs
 * This ensures cache invalidation when version changes
 */
function versionCachePlugin(): Plugin {
  let isBuild = false
  
  return {
    name: 'version-cache-plugin',
    enforce: 'post', // Run after Vite's built-in HTML plugin
    configResolved(config) {
      isBuild = config.command === 'build'
    },
    transformIndexHtml(html) {
      // Inject version meta tag (always, for version checking)
      const versionMeta = `<meta name="app-version" content="${version}" />`
      
      // Only add version query parameters during build
      // In dev mode, Vite handles source files directly and adding query params breaks esbuild
      if (!isBuild) {
        // Just add the meta tag in dev mode
        return html.replace('</head>', `  ${versionMeta}\n</head>`)
      }
      
      // Add version query parameter to all asset URLs (JS, CSS, and other assets) during build
      let htmlWithVersion = html
      
      // Handle script tags with src attribute
      htmlWithVersion = htmlWithVersion.replace(
        /(<script[^>]*src=["']([^"']+)["'][^>]*>)/g,
        (match, fullTag, src) => {
          // Skip if already has version param, is inline script, external URL, or source file
          if (
            src.includes('?v=') || 
            src.includes('&v=') || 
            !src.startsWith('/') || 
            src.startsWith('http') ||
            src.startsWith('/src/') // Skip source files
          ) {
            return match
          }
          const separator = src.includes('?') ? '&' : '?'
          return fullTag.replace(src, `${src}${separator}v=${version}`)
        }
      )
      
      // Handle link tags with stylesheet rel
      htmlWithVersion = htmlWithVersion.replace(
        /(<link[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>)/g,
        (match, fullTag, href) => {
          // Skip if already has version param, external URL, or source file
          if (
            href.includes('?v=') || 
            href.includes('&v=') || 
            !href.startsWith('/') || 
            href.startsWith('http') ||
            href.startsWith('/src/') // Skip source files
          ) {
            return match
          }
          const separator = href.includes('?') ? '&' : '?'
          return fullTag.replace(href, `${href}${separator}v=${version}`)
        }
      )
      
      // Handle preload links for assets
      htmlWithVersion = htmlWithVersion.replace(
        /(<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:modulepreload|preload)["'][^>]*>)/g,
        (match, fullTag, href) => {
          // Skip if already has version param, external URL, or source file
          if (
            href.includes('?v=') || 
            href.includes('&v=') || 
            !href.startsWith('/') || 
            href.startsWith('http') ||
            href.startsWith('/src/') // Skip source files
          ) {
            return match
          }
          const separator = href.includes('?') ? '&' : '?'
          return fullTag.replace(href, `${href}${separator}v=${version}`)
        }
      )

      // Insert version meta tag before closing </head>
      return htmlWithVersion.replace('</head>', `  ${versionMeta}\n</head>`)
    },
  }
}

export default defineConfig({
  plugins: [react(), versionCachePlugin()],
  base: '/',
  build: {
    outDir: 'docs',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
})

