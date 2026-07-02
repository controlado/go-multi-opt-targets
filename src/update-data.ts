import childProcess from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { checksumText, readJson, writeJson } from './file-utils.js'
import { catalogSchema } from './schema.js'
import type { TargetCatalog } from './target-filter.js'

interface Args {
  goSha?: string
  goRoot: string
}

const require = createRequire(import.meta.url)
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseArgs(argv: string[]): Args {
  const goRootIndex = argv.indexOf('--go-root')
  const goShaIndex = argv.indexOf('--go-sha')
  const explicitGoRoot = argv[goRootIndex + 1]
  const explicitGoSha = argv[goShaIndex + 1]
  const goRoot =
    goRootIndex >= 0 && explicitGoRoot
      ? explicitGoRoot
      : path.join(repoRoot, 'work/genshin-optimizer')

  return {
    goRoot: path.resolve(goRoot),
    ...(goShaIndex >= 0 && explicitGoSha ? { goSha: explicitGoSha } : {}),
  }
}

function run(command: string, args: string[], cwd: string, env = process.env) {
  childProcess.execFileSync(command, args, {
    cwd,
    env,
    stdio: 'inherit',
  })
}

function output(command: string, args: string[], cwd: string): string {
  return childProcess
    .execFileSync(command, args, { cwd, encoding: 'utf8' })
    .trim()
}

function ensureGoCheckout(goRoot: string, goSha?: string): void {
  if (!fs.existsSync(path.join(goRoot, 'package.json'))) {
    fs.mkdirSync(path.dirname(goRoot), { recursive: true })
    run(
      'git',
      [
        'clone',
        '--depth=1',
        'https://github.com/frzyc/genshin-optimizer.git',
        goRoot,
      ],
      repoRoot
    )
  }

  if (!fs.existsSync(path.join(goRoot, '.git'))) {
    throw new Error(`${goRoot} is not a git checkout`)
  }

  run('git', ['fetch', '--depth=1', 'origin', goSha ?? 'HEAD'], goRoot)
  run('git', ['checkout', '--detach', goSha ?? 'FETCH_HEAD'], goRoot)
}

function ensureGoDependencies(goRoot: string): void {
  const yarnRelease = path.join(goRoot, '.yarn/releases/yarn-3.4.1.cjs')
  if (!fs.existsSync(yarnRelease)) {
    throw new Error(`Cannot find GO Yarn release at ${yarnRelease}`)
  }

  run(process.execPath, [yarnRelease, 'install', '--immutable'], goRoot, {
    ...process.env,
    CYPRESS_INSTALL_BINARY: '0',
  })
}

function copyExtractor(goRoot: string): string {
  const tempDir = path.join(goRoot, '.go-multi-opt-targets')
  fs.rmSync(tempDir, { force: true, recursive: true })
  fs.mkdirSync(tempDir, { recursive: true })

  for (const file of ['go-extractor.ts', 'target-filter.ts']) {
    fs.copyFileSync(path.join(repoRoot, 'src', file), path.join(tempDir, file))
  }

  return path.join(tempDir, 'go-extractor.ts')
}

function runExtractor(goRoot: string, extractorPath: string, outPath: string) {
  const env = {
    ...process.env,
    TS_NODE_COMPILER_OPTIONS: JSON.stringify({
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      jsx: 'react-jsx',
      module: 'CommonJS',
    }),
    TS_NODE_PROJECT: path.join(goRoot, 'tsconfig.base.json'),
  }

  run(
    process.execPath,
    [
      '-r',
      require.resolve('ts-node/register/transpile-only'),
      '-r',
      require.resolve('tsconfig-paths/register'),
      extractorPath,
      '--out',
      outPath,
    ],
    goRoot,
    env
  )
}

function metadata(goRoot: string, catalog: TargetCatalog) {
  const packageJson = readJson<{ version?: string }>(path.join(goRoot, 'package.json'))
  const commit = output('git', ['rev-parse', 'HEAD'], goRoot)
  const targetCount = catalog.characters.reduce(
    (total, character) => total + character.targets.length,
    0
  )

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    genshinOptimizer: {
      repository: 'frzyc/genshin-optimizer',
      commit,
      version: packageJson.version ?? null,
    },
    characterCount: catalog.characters.length,
    targetCount,
  }
}

const args = parseArgs(process.argv.slice(2))
const dataDir = path.join(repoRoot, 'data')
const catalogPath = path.join(dataDir, 'multi-opt-targets.json')

ensureGoCheckout(args.goRoot, args.goSha)
ensureGoDependencies(args.goRoot)
const extractorPath = copyExtractor(args.goRoot)
runExtractor(args.goRoot, extractorPath, catalogPath)

const catalog = readJson<TargetCatalog>(catalogPath)
writeJson(catalogPath, catalog)
fs.writeFileSync(
  path.join(dataDir, 'multi-opt-targets.min.json'),
  JSON.stringify(catalog)
)
fs.appendFileSync(path.join(dataDir, 'multi-opt-targets.min.json'), '\n')
writeJson(path.join(dataDir, 'schema.json'), catalogSchema())
writeJson(path.join(dataDir, 'metadata.json'), metadata(args.goRoot, catalog))
fs.writeFileSync(path.join(repoRoot, 'checksums.txt'), checksumText(repoRoot))
