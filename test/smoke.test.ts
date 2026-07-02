import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { TargetCatalog } from '../src/target-filter.js'

const repoRoot = path.resolve(import.meta.dirname, '..')
const catalog = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data/multi-opt-targets.json'), 'utf8')
) as TargetCatalog

describe('generated catalog smoke tests', () => {
  it('contains known Chasca custom multi-target paths', () => {
    const chasca = catalog.characters.find(
      (character) => character.sheetKey === 'Chasca'
    )
    expect(chasca).toBeDefined()

    const paths = new Set(chasca?.targets.map((target) => target.path.join('.')))
    expect(paths).toContain('skill.activationDmg')
    expect(paths).toContain('skill.shellDmg')
    expect(paths).toContain('burst.galeSplittingDmg')
    expect(paths).toContain('constellation2.pyro')
  })

  it('does not include custom section targets or short paths', () => {
    for (const character of catalog.characters) {
      for (const target of character.targets) {
        expect(target.path[0]).not.toBe('custom')
        expect(target.path.length).toBe(2)
        expect(target.unit).not.toBe('%')
        expect(target.variant).not.toBe('heal')
        expect(target.label.en).not.toMatch(/^path_\d+$/)
      }
    }
  })

  it('includes populated traveler gender variants', () => {
    const bySheetKey = new Map(
      catalog.characters.map((character) => [character.sheetKey, character])
    )

    for (const element of [
      'Anemo',
      'Geo',
      'Electro',
      'Dendro',
      'Hydro',
      'Pyro',
    ]) {
      const characterKey = `Traveler${element}`
      const female = bySheetKey.get(`${characterKey}F`)
      const male = bySheetKey.get(`${characterKey}M`)

      expect(female).toMatchObject({
        characterKey,
        genderVariant: 'F',
        sheetKey: `${characterKey}F`,
      })
      expect(male).toMatchObject({
        characterKey,
        genderVariant: 'M',
        sheetKey: `${characterKey}M`,
      })
      expect(female?.targets.length).toBeGreaterThan(0)
      expect(male?.targets.length).toBeGreaterThan(0)
    }
  })
})
