# go-multi-opt-targets

[Português](README.br.md)

A ready-to-use catalog of selectable Genshin Optimizer `Custom Multi-Optimization Target` entries.

Use it when you need target paths for tools, scripts, or imports and do not want to open the target selector for each character. The update workflow reads the Genshin Optimizer source code, builds the same character data used by the app, and publishes JSON files you can consume.

## Files

- `data/multi-opt-targets.json`: readable catalog for inspection.
- `data/multi-opt-targets.min.json`: compact catalog for apps and scripts.
- `data/metadata.json`: Genshin Optimizer commit, version, generation date, and totals.
- `data/schema.json`: JSON Schema for the catalog.
- `checksums.txt`: SHA256 checksums for the published files.

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

The published catalog follows the same custom multi-target selector behavior:

- `showEmptyTargets: true`
- `flatOnly: true`
- `excludeHeal: true`
- excluded sections: `basic`, `bonusStats`, `custom`, `character`, `teamBuff`

## License

MIT
