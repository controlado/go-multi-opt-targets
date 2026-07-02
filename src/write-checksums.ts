import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { checksumText } from './file-utils.js'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

fs.writeFileSync(path.join(repoRoot, 'checksums.txt'), checksumText(repoRoot))
