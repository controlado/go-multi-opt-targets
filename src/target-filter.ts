export const excludedSections = [
  'basic',
  'bonusStats',
  'custom',
  'character',
  'teamBuff',
] as const

export type LabelSource = 'info.name' | 'info.path' | 'path'

export interface TargetNodeInfo {
  multi?: number
  name?: unknown
  path?: string
  unit?: string
  variant?: string
}

export interface TargetNode {
  info?: TargetNodeInfo
  isEmpty?: boolean
}

export interface TargetFilterOptions {
  excludeHeal: boolean
  excludeSections: readonly string[]
  flatOnly: boolean
  showEmptyTargets: boolean
}

export interface CatalogTarget {
  isEmpty: boolean
  key: string
  label: {
    en: string
  }
  labelSource: LabelSource
  multi: number | null
  path: [string, string]
  section: string
  unit: string | null
  variant: string | null
}

export interface CatalogCharacter {
  characterKey: string
  genderVariant?: 'F' | 'M'
  sheetKey: string
  targets: CatalogTarget[]
}

export interface TargetCatalog {
  schemaVersion: 1
  characters: CatalogCharacter[]
}

export const customMultiTargetFilters: TargetFilterOptions = {
  excludeHeal: true,
  excludeSections: excludedSections,
  flatOnly: true,
  showEmptyTargets: true,
}

export function displaySectionsInModalOrder<T>(
  display: Record<string, Record<string, T>>
): Array<[string, Record<string, T>]> {
  const sections = Object.entries(display)
  const byKey = (key: string) => sections.filter(([section]) => section === key)
  const byPrefix = (prefix: string) =>
    sections.filter(([section]) => section.startsWith(prefix))

  const orderedKeys = new Set([
    'basic',
    'reaction',
    'custom',
    'moonsign',
  ])

  const rest = sections.filter(
    ([section]) =>
      !orderedKeys.has(section) &&
      !section.startsWith('weapon') &&
      !section.startsWith('artifact')
  )

  return [
    ...byKey('basic'),
    ['character', {}],
    ['bonusStats', {}],
    ...byKey('moonsign'),
    ...byKey('reaction'),
    ...byKey('custom'),
    ...rest,
    ...byPrefix('weapon'),
    ...byPrefix('artifact'),
    ['teamBuff', {}],
  ]
}

export function shouldIncludeTarget(
  sectionKey: string,
  node: TargetNode,
  options: TargetFilterOptions = customMultiTargetFilters
): boolean {
  const info = node.info ?? {}

  if (options.excludeSections.includes(sectionKey)) return false
  if (options.flatOnly && info.unit === '%') return false
  if (options.excludeHeal && info.variant === 'heal') return false
  if (!options.showEmptyTargets && node.isEmpty && sectionKey !== 'basic') {
    return false
  }

  return true
}

export function labelForTarget(
  targetPath: [string, string],
  info: TargetNodeInfo = {}
): { label: string; labelSource: LabelSource } {
  if (typeof info.name === 'string' && info.name.trim()) {
    return { label: info.name, labelSource: 'info.name' }
  }

  if (
    typeof info.path === 'string' &&
    info.path.trim() &&
    !/^path_\d+$/.test(info.path)
  ) {
    return { label: info.path, labelSource: 'info.path' }
  }

  return { label: targetPath.join('.'), labelSource: 'path' }
}

export function targetFromNode(
  section: string,
  key: string,
  node: TargetNode
): CatalogTarget {
  const info = node.info ?? {}
  const path: [string, string] = [section, key]
  const { label, labelSource } = labelForTarget(path, info)

  return {
    isEmpty: Boolean(node.isEmpty),
    key,
    label: { en: label },
    labelSource,
    multi: typeof info.multi === 'number' ? info.multi : null,
    path,
    section,
    unit: typeof info.unit === 'string' ? info.unit : null,
    variant: typeof info.variant === 'string' ? info.variant : null,
  }
}
