import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Ajv2020 } from 'ajv/dist/2020.js'
import { checksumText, readJson } from './file-utils.js'
import { catalogSchema } from './schema.js'
import type { TargetCatalog } from './target-filter.js'

interface Metadata {
  characterCount: number
  targetCount: number
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = path.join(repoRoot, 'data/multi-opt-targets.json')
const minPath = path.join(repoRoot, 'data/multi-opt-targets.min.json')
const metadataPath = path.join(repoRoot, 'data/metadata.json')
const schemaPath = path.join(repoRoot, 'data/schema.json')
const checksumsPath = path.join(repoRoot, 'checksums.txt')

const catalog = readJson<TargetCatalog>(catalogPath)
const schema = readJson<Record<string, unknown>>(schemaPath)
if (JSON.stringify(schema) !== JSON.stringify(catalogSchema())) {
  throw new Error('data/schema.json is stale')
}

const ajv = new Ajv2020({ allErrors: true })
const validate = ajv.compile(schema)

if (!validate(catalog)) {
  throw new Error(`Catalog schema validation failed: ${ajv.errorsText(validate.errors)}`)
}

const minCatalog = readJson<TargetCatalog>(minPath)
if (JSON.stringify(minCatalog) !== JSON.stringify(catalog)) {
  throw new Error('Minified catalog does not match readable catalog')
}

const metadata = readJson<Metadata>(metadataPath)
const targetCount = catalog.characters.reduce(
  (total, character) => total + character.targets.length,
  0
)

if (metadata.characterCount !== catalog.characters.length) {
  throw new Error('metadata.characterCount does not match catalog')
}

if (metadata.targetCount !== targetCount) {
  throw new Error('metadata.targetCount does not match catalog')
}

const sheetKeys = new Set<string>()
for (const character of catalog.characters) {
  if (sheetKeys.has(character.sheetKey)) {
    throw new Error(`Duplicate sheetKey: ${character.sheetKey}`)
  }
  sheetKeys.add(character.sheetKey)

  const targetPaths = new Set<string>()
  for (const target of character.targets) {
    if (target.path.length !== 2) {
      throw new Error(`${character.sheetKey} has a non two-segment target path`)
    }
    if (target.path[0] !== target.section || target.path[1] !== target.key) {
      throw new Error(`${character.sheetKey} has inconsistent path fields`)
    }
    if (target.unit === '%') {
      throw new Error(`${character.sheetKey} contains percent target ${target.path.join('.')}`)
    }
    if (target.variant === 'heal') {
      throw new Error(`${character.sheetKey} contains heal target ${target.path.join('.')}`)
    }
    if (/^path_\d+$/.test(target.label.en)) {
      throw new Error(`${character.sheetKey} contains synthetic label ${target.label.en}`)
    }

    const key = target.path.join('.')
    if (targetPaths.has(key)) {
      throw new Error(`${character.sheetKey} has duplicate target ${key}`)
    }
    targetPaths.add(key)
  }
}

const expectedChecksums = checksumText(repoRoot)
const currentChecksums = fs.readFileSync(checksumsPath, 'utf8')
if (currentChecksums !== expectedChecksums) {
  throw new Error('checksums.txt is stale')
}
