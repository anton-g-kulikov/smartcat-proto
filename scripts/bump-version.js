import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get bump type from command line argument (default to 'patch')
const bumpType = (process.argv[2] || 'patch').toLowerCase()

// Validate bump type
if (!['patch', 'minor', 'major'].includes(bumpType)) {
  console.error(`Invalid bump type: ${bumpType}`)
  console.error('Usage: node bump-version.js [patch|minor|major]')
  console.error('Default: patch')
  process.exit(1)
}

// Read package.json
const packageJsonPath = join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

// Parse current version
const [major, minor, patch] = packageJson.version.split('.').map(Number)
const oldVersion = packageJson.version

// Calculate new version based on bump type
let newMajor = major
let newMinor = minor
let newPatch = patch

switch (bumpType) {
  case 'major':
    newMajor = major + 1
    newMinor = 0
    newPatch = 0
    break
  case 'minor':
    newMinor = minor + 1
    newPatch = 0
    break
  case 'patch':
  default:
    newPatch = patch + 1
    break
}

const newVersion = `${newMajor}.${newMinor}.${newPatch}`

// Update version in package.json
packageJson.version = newVersion

// Write back to package.json
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8')

console.log(`Version bumped from ${oldVersion} to ${newVersion} (${bumpType})`)

