# go-multi-opt-targets

Generated catalog of selectable Genshin Optimizer `Custom Multi-Optimization Target` entries for every character.

The source of truth is the Genshin Optimizer codebase, not the rendered UI. The update job clones `frzyc/genshin-optimizer`, imports the real character sheets, computes `UIData`, walks `data.getDisplay()`, and applies the same target selector filters used by the custom multi-target editor.

## Data

- `data/multi-opt-targets.json`: readable catalog.
- `data/multi-opt-targets.min.json`: compact catalog.
- `data/metadata.json`: source commit, GO version, generated time, character count, and target count.
- `data/schema.json`: JSON Schema for the catalog.
- `checksums.txt`: SHA256 checksums for published data files.

Each character entry contains `characterKey`, `sheetKey`, optional `genderVariant`, and `targets`.

Each target contains:

- `path`: the importable GO target path, such as `["skill", "shellDmg"]`.
- `section` and `key`: the two path segments split out for simple filtering.
- `multi`, `variant`, `unit`, `isEmpty`.
- `label.en` and `labelSource`.

Labels are best effort. When GO exposes a direct string, it is used. React/i18n labels fall back to `info.path` or `path.join(".")`.

## Local Update

```sh
npm ci
npm run update:data
npm run ci
```

`update:data` creates or syncs `work/genshin-optimizer`, installs the GO dependencies with Cypress binary download disabled, and then regenerates the published files.

## Filters

The extractor mirrors the custom multi-target modal:

- `showEmptyTargets: true`
- `flatOnly: true`
- `excludeHeal: true`
- excluded sections: `basic`, `bonusStats`, `custom`, `character`, `teamBuff`

## License

MIT
