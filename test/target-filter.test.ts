import { describe, expect, it } from 'vitest'
import {
  customMultiTargetFilters,
  labelForTarget,
  shouldIncludeTarget,
  targetFromNode,
} from '../src/target-filter.js'

describe('shouldIncludeTarget', () => {
  it('filters percent targets when flatOnly is enabled', () => {
    expect(
      shouldIncludeTarget(
        'skill',
        { info: { unit: '%' } },
        customMultiTargetFilters
      )
    ).toBe(false)
  })

  it('filters heals when excludeHeal is enabled', () => {
    expect(
      shouldIncludeTarget(
        'skill',
        { info: { variant: 'heal' } },
        customMultiTargetFilters
      )
    ).toBe(false)
  })

  it('excludes non-custom-target sections', () => {
    for (const section of [
      'basic',
      'bonusStats',
      'custom',
      'character',
      'teamBuff',
    ]) {
      expect(shouldIncludeTarget(section, {}, customMultiTargetFilters)).toBe(
        false
      )
    }
  })

  it('preserves empty targets because showEmptyTargets is enabled', () => {
    expect(
      shouldIncludeTarget(
        'constellation2',
        { isEmpty: true },
        customMultiTargetFilters
      )
    ).toBe(true)
  })
})

describe('targetFromNode', () => {
  it('builds the public target shape', () => {
    expect(
      targetFromNode('skill', 'shellDmg', {
        info: { multi: 2, path: 'atk', unit: '', variant: 'anemo' },
        isEmpty: true,
      })
    ).toEqual({
      isEmpty: true,
      key: 'shellDmg',
      label: { en: 'atk' },
      labelSource: 'info.path',
      multi: 2,
      path: ['skill', 'shellDmg'],
      section: 'skill',
      unit: '',
      variant: 'anemo',
    })
  })

  it('prefers string labels and falls back to the technical path', () => {
    expect(labelForTarget(['skill', 'x'], { name: 'Skill hit' })).toEqual({
      label: 'Skill hit',
      labelSource: 'info.name',
    })
    expect(labelForTarget(['skill', 'x'], {})).toEqual({
      label: 'skill.x',
      labelSource: 'path',
    })
    expect(labelForTarget(['skill', 'x'], { path: 'path_7' })).toEqual({
      label: 'skill.x',
      labelSource: 'path',
    })
  })
})
