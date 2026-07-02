import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeJson } from './file-utils.js'
import { catalogSchema } from './schema.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

writeJson(path.join(repoRoot, 'data/schema.json'), catalogSchema())
