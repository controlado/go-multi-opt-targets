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

Targets selecionáveis do `Custom Multi-Optimization Target` do Genshin Optimizer, publicados como JSON. <br>
Baixe o catálogo e use os caminhos em ferramentas, scripts ou imports.

</div>
<br>

## Download

| Arquivo | Uso |
| --- | --- |
| [`multi-opt-targets.json`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/multi-opt-targets.json) | Catálogo legível para inspeção. |
| [`multi-opt-targets.min.json`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/multi-opt-targets.min.json) | Catálogo compacto para apps e scripts. |
| [`metadata.json`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/metadata.json) | Commit do Genshin Optimizer, versão, data de geração e totais. |
| [`schema.json`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/schema.json) | JSON Schema do catálogo. |
| [`checksums.txt`](https://github.com/controlado/go-multi-opt-targets/releases/latest/download/checksums.txt) | Checksums SHA256 dos arquivos publicados. |

## Dados Atuais

| Campo | Valor |
| --- | --- |
| Versão do Genshin Optimizer | `10.36.0` |
| Commit do Genshin Optimizer | `e156833` |
| Personagens | `128` |
| Targets | `4245` |

## Exemplo

Trecho curto de `data/multi-opt-targets.json`:

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

## Formato do Catálogo

Cada personagem inclui `characterKey`, `sheetKey`, `genderVariant` quando aplicável, e `targets`.

Cada target inclui o `path` importável, `section`, `key`, flags básicas como `multi`, `variant`, `unit` e `isEmpty`, além de uma label em inglês quando o Genshin Optimizer expõe uma.

## Atualização Local

```sh
npm ci
npm run update:data
npm run ci
```

`update:data` sincroniza `work/genshin-optimizer`, instala as dependências do Genshin Optimizer com download do binário do Cypress desativado e atualiza os arquivos publicados.

## Filtros

O catálogo publicado segue o comportamento do seletor de multi-target customizado:

- `showEmptyTargets: true`
- `flatOnly: true`
- `excludeHeal: true`
- seções excluídas: `basic`, `bonusStats`, `custom`, `character`, `teamBuff`

## Nota

Este projeto independente publica dados gerados a partir do código-fonte do Genshin Optimizer.

## Licença

MIT
