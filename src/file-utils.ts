import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export const publishedFiles = [
  'data/multi-opt-targets.json',
  'data/multi-opt-targets.min.json',
  'data/metadata.json',
  'data/schema.json',
] as const

export function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

export function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

export function sha256(filePath: string): string {
  return crypto
    .createHash('sha256')
    .update(fs.readFileSync(filePath))
    .digest('hex')
}

export function checksumText(repoRoot: string): string {
  return publishedFiles
    .map((file) => `${sha256(path.join(repoRoot, file))}  ${file}`)
    .join('\n')
    .concat('\n')
}
