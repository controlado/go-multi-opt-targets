declare const require: NodeJS.Require

const fs = require('node:fs') as typeof import('node:fs')
const path = require('node:path') as typeof import('node:path')

for (const ext of ['.css', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp']) {
  require.extensions[ext] = (mod, filename) => {
    mod.exports = filename
  }
}

const { getUnitStr } = require('@genshin-optimizer/common/util')
const { allCharacterKeys, allTravelerKeys } = require(
  '@genshin-optimizer/gi/consts'
)
const { KeyMap } = require('@genshin-optimizer/gi/keymap')
const { getCharSheet } = require('@genshin-optimizer/gi/sheets')
const { computeUIData } = require('@genshin-optimizer/gi/uidata')
const {
  customMultiTargetFilters,
  displaySectionsInModalOrder,
  shouldIncludeTarget,
  targetFromNode,
} = require('./target-filter')

type GenderVariant = 'F' | 'M'

interface CliArgs {
  out: string
}

function parseArgs(argv: string[]): CliArgs {
  const outIndex = argv.indexOf('--out')
  const out = argv[outIndex + 1]
  if (outIndex < 0 || !out) {
    throw new Error('Usage: go-extractor.ts --out <catalog-json-path>')
  }

  return { out: path.resolve(out) }
}

function sheetKey(characterKey: string, gender: GenderVariant): string {
  return allTravelerKeys.includes(characterKey)
    ? `${characterKey}${gender}`
    : characterKey
}

function resolveInfo(info: Record<string, unknown> = {}) {
  const next = { ...info }
  const infoPath = typeof next.path === 'string' ? next.path : undefined

  if (infoPath && KeyMap.getStr(infoPath)) {
    next.variant ??= KeyMap.getVariant(infoPath)
    next.unit ??= getUnitStr(infoPath)
  }

  return next
}

function extractCharacter(characterKey: string, gender: GenderVariant) {
  const sheet = getCharSheet(characterKey, gender)
  const data = computeUIData([sheet.data])
  const targets = []

  for (const [section, nodes] of displaySectionsInModalOrder(data.getDisplay())) {
    for (const [key, rawNode] of Object.entries(nodes)) {
      const node = {
        ...(rawNode as Record<string, unknown>),
        info: resolveInfo((rawNode as { info?: Record<string, unknown> }).info),
      }

      if (!shouldIncludeTarget(section, node, customMultiTargetFilters)) {
        continue
      }

      targets.push(targetFromNode(section, key, node))
    }
  }

  const character = {
    characterKey,
    sheetKey: sheetKey(characterKey, gender),
    targets,
  } as {
    characterKey: string
    genderVariant?: GenderVariant
    sheetKey: string
    targets: unknown[]
  }

  if (allTravelerKeys.includes(characterKey)) {
    character.genderVariant = gender
  }

  return character
}

function characterInputs(): Array<[string, GenderVariant]> {
  return allCharacterKeys.flatMap((characterKey: string) =>
    allTravelerKeys.includes(characterKey)
      ? (['F', 'M'] as GenderVariant[]).map((gender) => [
          characterKey,
          gender,
        ])
      : ([[characterKey, 'F']] as Array<[string, GenderVariant]>)
  )
}

const args = parseArgs(process.argv.slice(2))
const catalog = {
  schemaVersion: 1,
  characters: characterInputs().map(([characterKey, gender]) =>
    extractCharacter(characterKey, gender)
  ),
}

fs.mkdirSync(path.dirname(args.out), { recursive: true })
fs.writeFileSync(args.out, `${JSON.stringify(catalog, null, 2)}\n`)
process.exit(0)
