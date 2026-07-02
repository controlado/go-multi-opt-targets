# go-multi-opt-targets

Catálogo gerado das entradas selecionáveis do `Custom Multi-Optimization Target` do Genshin Optimizer para todos os personagens.

A fonte de verdade é o código-fonte do Genshin Optimizer, não a interface renderizada. O job de atualização clona `frzyc/genshin-optimizer`, importa os sheets reais dos personagens, calcula `UIData`, percorre `data.getDisplay()` e aplica os mesmos filtros do seletor usado no editor de multi-target customizado.

## Dados

- `data/multi-opt-targets.json`: catálogo legível.
- `data/multi-opt-targets.min.json`: catálogo compacto.
- `data/metadata.json`: commit fonte, versão do GO, data de geração, total de personagens e total de targets.
- `data/schema.json`: JSON Schema do catálogo.
- `checksums.txt`: checksums SHA256 dos arquivos publicados.

Cada personagem contém `characterKey`, `sheetKey`, `genderVariant` quando aplicável, e `targets`.

Cada target contém:

- `path`: caminho importável no GO, por exemplo `["skill", "shellDmg"]`.
- `section` e `key`: os dois segmentos do path separados para facilitar filtros.
- `multi`, `variant`, `unit`, `isEmpty`.
- `label.en` e `labelSource`.

Labels são best-effort. Quando o GO expõe uma string direta, ela é usada. Labels que dependem de React/i18n usam fallback para `info.path` ou `path.join(".")`.

## Atualização local

```sh
npm ci
npm run update:data
npm run ci
```

`update:data` cria ou sincroniza `work/genshin-optimizer`, instala as dependências do GO com download do binário do Cypress desativado e então regenera os arquivos publicados.

## Filtros

O extrator espelha o modal de multi-target customizado:

- `showEmptyTargets: true`
- `flatOnly: true`
- `excludeHeal: true`
- seções excluídas: `basic`, `bonusStats`, `custom`, `character`, `teamBuff`

## Licença

MIT
