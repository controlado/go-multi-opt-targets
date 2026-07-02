<div align="center">

# go-multi-opt-targets <br>

[![license](https://img.shields.io/github/license/controlado/go-multi-opt-targets)](LICENSE)
[![CI](https://github.com/controlado/go-multi-opt-targets/actions/workflows/ci.yml/badge.svg)](https://github.com/controlado/go-multi-opt-targets/actions/workflows/ci.yml)
[![release](https://img.shields.io/github/release/controlado/go-multi-opt-targets.svg?label=release)](https://github.com/controlado/go-multi-opt-targets/releases/latest) <br>
[![json](https://img.shields.io/badge/data-JSON-292929)](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/multi-opt-targets.json)
[![schema](https://img.shields.io/badge/schema-JSON%20Schema-blue)](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/schema.json) <br>
![documentation](https://img.shields.io/badge/Documentation-gray)
[![english](https://img.shields.io/badge/-English-blue)](README.md)
[![português](https://img.shields.io/badge/-Português%20Brasileiro-blue)](README.br.md)

Selectable Genshin Optimizer custom multi-optimization targets, published as JSON files. <br>
Download the catalog and use the paths in tools, scripts, or imports.

</div>
<br>

## Download

| File | Use |
| --- | --- |
| [`multi-opt-targets.json`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/multi-opt-targets.json) | Readable catalog for inspection. |
| [`multi-opt-targets.min.json`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/multi-opt-targets.min.json) | Compact catalog for apps and scripts. |
| [`metadata.json`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/metadata.json) | Genshin Optimizer commit, version, generation date, and totals. |
| [`schema.json`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/schema.json) | JSON Schema for the catalog. |
| [`checksums.txt`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/checksums.txt) | SHA256 checksums for the published files. |

## Current Data

| Field | Value |
| --- | --- |
| Genshin Optimizer version | `10.36.0` |
| Genshin Optimizer commit | `e156833` |
| Characters | `128` |
| Targets | `4245` |

## Example

Small slice from `data/multi-opt-targets.json`:

```json
{
  "characterKey": "Chasca",
  "sheetKey": "Chasca",
  "target": {
    "path": ["skill", "shellDmg"],
    "section": "skill",
    "key": "shellDmg",
    "label": {
      "en": "skill.shellDmg"
    },
    "labelSource": "path"
  }
}
```

## Catalog Shape

Each character entry includes `characterKey`, `sheetKey`, optional `genderVariant`, and `targets`.

Each target includes the importable `path`, its `section` and `key`, basic flags such as `multi`, `variant`, `unit`, and `isEmpty`, plus an English label when Genshin Optimizer exposes one.

## Local Update

```sh
npm ci
npm run update:data
npm run ci
```

`update:data` syncs `work/genshin-optimizer`, installs the Genshin Optimizer dependencies with Cypress binary downloads disabled, and refreshes the published files.

## Filters

The published catalog follows the custom multi-target selector behavior:

- `showEmptyTargets: true`
- `flatOnly: true`
- `excludeHeal: true`
- excluded sections: `basic`, `bonusStats`, `custom`, `character`, `teamBuff`

## Note

This independent project publishes data generated from the Genshin Optimizer source code.

## License

MIT
